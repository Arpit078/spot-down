import axios from "axios";
import amqp from 'amqplib/callback_api.js';

async function doPostRequest(message) {
  try {
    const response = await axios.post('http://worker:5002/worker/server_download', { message });
    if (response.status === 200) {
      console.log('POST request completed successfully.');
      return true; // Indicate success
    } else {
      console.error('POST request failed with status:', response.status);
      return false; // Indicate failure
    }
  } catch (error) {
    console.error('Error performing POST request:', error);
    return false; // Indicate failure
  }
}

function connectToRabbitMQ(retries = 5) {
  amqp.connect('amqp://rabbitmq', (err, connection) => {
    if (err) {
      console.error('Failed to connect to RabbitMQ, retrying...', retries);
      if (retries === 0) {
        throw err;
      }
      setTimeout(() => connectToRabbitMQ(retries - 1), 5000); // Retry after 5 seconds
      return;
    }

    connection.createChannel((err, channel) => {
      if (err) {
        throw err;
      }

      const queue = 'download_queue';
      channel.assertQueue(queue, { durable: false });

      console.log('Waiting for messages in %s. To exit press CTRL+C', queue);
      let processing = false;

      channel.consume(queue, async (msg) => {
        if (msg !== null) {
          processing = true
          console.log(`Received ${msg.content.toString()}`);
          const _ = await doPostRequest(JSON.parse(msg.content.toString()));
        }else{
          processing  = false
        }
      }, { noAck: true });

      // Periodically check if the queue is empty
      const checkQueueInterval = setInterval(() => {
        channel.checkQueue(queue, (err, ok) => {
          if (err) {
            console.error('Error checking queue:', err);
            clearInterval(checkQueueInterval);
            channel.close(() => {
              console.log('Channel closed due to error');
              connection.close(() => {
                console.log('Connection closed due to error');
              });
            });
            return;
          }

          if (ok.messageCount === 0 && !processing) {
            console.log('Queue is empty. Closing channel and connection.');
            clearInterval(checkQueueInterval);
            channel.close(() => {
              console.log('Channel closed');
              connection.close(() => {
                console.log('Connection closed');
              });
            });
          }
        });
      }, 5000); // Check every 5 seconds
    });
  });
}

export async function message_cron() {
  connectToRabbitMQ();
}
