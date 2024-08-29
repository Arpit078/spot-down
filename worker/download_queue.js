import axios  from "axios"
import amqp from 'amqplib/callback_api.js';

// Function to perform POST request
async function doPostRequest(message) {
  try {
    const response = await axios.post('http://localhost:5002/worker/server_download', { message });
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

amqp.connect('amqp://localhost', (err, connection) => {
  if (err) {
    throw err;
  }

  connection.createChannel((err, channel) => {
    if (err) {
      throw err;
    }

    const queue = 'download_queue'; 
    channel.assertQueue(queue, {
      durable: false
    });

    console.log('Waiting for messages in %s. To exit press CTRL+C', queue);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        console.log(`Received ${msg.content.toString()}`);
        const success = await doPostRequest(JSON.parse(msg.content.toString())); // Perform POST request
        if (success) {
          channel.ack(msg); // Acknowledge the receipt of the message only if POST was successful
        }
      }
    });
  });
});
