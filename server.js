import express from "express"
const app = express()
import {spotifyTracks,refreshToken} from './spotify.js'
import {download,getSongs} from "./scrape.js"
import {zip} from "./zip.js"
import fs from "fs"
import fsx from "fs-extra"
import { fileURLToPath } from 'url';
import path ,{ dirname } from 'path';
app.use(express.json());
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()


var PORT = process.env.PORT||5001;



//-------------webpage-------------------//
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
//-------------webpage-end-------------------//



app.get('/:playlistURL', async (req, res) => {
	const directoryPath = './songs/';
	try {
		fsx.removeSync(directoryPath);
		console.log('Directory removed successfully.');
		} catch (error) {
		console.error('Error removing directory:', error);
		}
		try {
		fs.mkdirSync(directoryPath);
		console.log('Directory created successfully.');
		} catch (error) {
		console.error('Error creating directory:', error);
		}
	try {
	  const token = await refreshToken(process.env.CLIENT_SECRET, process.env.CLIENT_ID);
	  await getSongs(req.params.playlistURL, token, process.env.YOUTUBE_API_KEY);
  
	  const zipFileName = `songs.zip`;
	  const zipFilePath = `./${zipFileName}`;
	  await zip(`./songs`, zipFilePath);
  
	  const options = {
		headers: {
		  'Content-Type': 'application/octet-stream',
		},
	  };
  
	  res.download(zipFilePath, zipFileName, options, (err) => {
		if (err) {
		  console.error(err);
		} else {
		  console.log(`File ${zipFilePath} sent successfully.`);
		}
		// Delete the ZIP file after sending it
		fs.unlinkSync(zipFilePath);
	  });
	} catch (err) {
	  console.error(err);
	  res.sendStatus(500);
	}
  });
  

app.listen(PORT, function(err){
	if (err) console.log(err);
	console.log("Server listening on PORT", PORT);
});
