import amqp from 'amqplib/callback_api.js';

export async function send_message(queue, message_batch) {
  try{
    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
  
            channel.assertQueue(queue, {
                durable: false
            });
            for(let i=0;i<message_batch.length;i++){
                channel.sendToQueue(queue, Buffer.from(JSON.stringify(message_batch[i])));
                console.log(" [x] Sent %s", message_batch[i]);
            }
        });
        setTimeout(function() {
            connection.close();
        }, 100);
    });
    return true
  } catch(err){
    return err
  }
}
