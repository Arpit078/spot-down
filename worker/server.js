import express from 'express';
import cors from "cors";
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { getSongs } from "./download.js";
import { zip, getTrackName } from "./utils.js";
import fs from 'fs';
import path from 'path'; 
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cron from 'node-cron';  // Import node-cron
import { message_cron } from './download_queue.js';
import { poll } from './utils.js';
import { redis_client } from './lib/redis_wrapper.js';
import { postgres_client } from "./lib/postgres_wrapper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();
const app = express();
app.use(cors()); // Use CORS middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var PORT = process.env.PORT || 5002;

cron.schedule('*/5 * * * * *', () => {
  console.log('Running message_cron every 5 seconds');
  message_cron();
});


app.post('/worker/server_download', async (req, res) => {
  try {
    let message = req.body.message;
    let trackId = message.id;
    let trackName = message.trackName;
    let trackArtist = message.artistName;
    let trackImage = message.imageUrl;
    let query = trackName + " by " + trackArtist;
    await getSongs(query, trackId, trackName, trackArtist, trackImage, postgres_client, redis_client);

    res.status(200).send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

app.post('/worker/client_download', async (req, res) => {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    };

    let listOfIds = req.body.listOfIds;
    const uniqueId = Date.now() + Math.random().toString(36).substring(2, 15); // Generate a unique ID

    if (listOfIds.length == 1) {
      let id = listOfIds[0];
      let filePath = `./songs/${id}.m4a`;

      try {
        let title = await getTrackName(filePath);
        res.download(filePath, `${title}.m4a`, options, (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`File sent successfully.`);
          }
        });
      } catch (error) {
        console.error('Error reading metadata:', error);
        res.status(200).send('Song does not exist please download on server first');
      }
    } else {
      const tempDir = path.join(__dirname, `./temp_downloads_${uniqueId}`);
      fs.mkdirSync(tempDir);

      try {
        // Copy and rename files
        await Promise.all(listOfIds.map(async (id) => {
          let songExists = await poll(id,redis_client,postgres_client)
          if(songExists){
            try{
              let trackPath = `./songs/${id}.m4a`;
              let title = await getTrackName(trackPath);
              let destPath = path.join(tempDir, `${title}.m4a`);
              fs.copyFileSync(trackPath, destPath);
            }catch(err){
              console.error(err);
            }
          }
        }));

        // Zip the directory
        const zipFilePath = path.join(__dirname, `./songs_${uniqueId}.zip`);
        await zip(tempDir, zipFilePath);

        res.download(zipFilePath, `songs_${uniqueId}.zip`, options, (err) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`File sent successfully.`);
          }

          // Cleanup
          fs.unlinkSync(zipFilePath);
          fs.rmdirSync(tempDir, { recursive: true });
        });
      } catch (error) {
        console.error('Error processing files:', error);
        res.status(500).send('Error processing files');
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});
