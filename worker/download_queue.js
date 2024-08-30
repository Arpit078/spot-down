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

export async function message_cron() {
  amqp.connect('amqp://rabbitmq', (err, connection) => {
    if (err) {
      throw err;
    }

    connection.createChannel((err, channel) => {
      if (err) {
        throw err;
      }

      const queue = 'download_queue';
      channel.assertQueue(queue, { durable: false });

      console.log('Waiting for messages in %s. To exit press CTRL+C', queue);

      let processing = true;

      channel.consume(queue, async (msg) => {
        if (msg !== null) {
          console.log(`Received ${msg.content.toString()}`);
          const success = await doPostRequest(JSON.parse(msg.content.toString())); // Perform POST request
          if (success) {
            channel.ack(msg); // Acknowledge the receipt of the message only if POST was successful
          } else {
            console.error('Failed to process message, not acknowledging.');
            // Optionally, you could reject the message here
            // channel.nack(msg);
          }
        }
      }, { noAck: false });

      // Check if the queue is empty periodically
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
          } else {
            processing = false; // If there are messages, processing should continue
          }
        });
      }, 10000); // Check every 10 seconds
    });
  });
}
