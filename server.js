import express from "express"
const app = express()
import axios from 'axios'
import path from 'path'
import { execSync } from 'child_process'
// const {download} = require("./scrape")
import {spotifyTracks,refreshToken} from './spotify.js'
import {download,getSongs} from "./scrape.js"
import {zip} from "./zip.js"
app.use(express.json());
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()


var PORT = process.env.PORT||5001;
app.get('/:playlistURL&:user', async (req, res) => {
	try {
	  const token = await refreshToken(process.env.CLIENT_SECRET, process.env.CLIENT_ID);
	  await getSongs(req.params.playlistURL, token, process.env.YOUTUBE_API_KEY, req.params.user);
  
	  const zipFileName = `${req.params.user}.zip`;
	  const zipFilePath = `./zips/${zipFileName}`;
	  await zip(`./extracted/${req.params.user}`, zipFilePath);
  
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










app.get('/q=:query', async function(req, res){
	const url = `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=${req.params.query}%20lyrics&type=video&part=snippet`
	axios.get(url).then((response)=>{
		const videoID = response.data.items[0].id.videoId
		const videoTitle = response.data.items[0].snippet.title.replace("lyrics"," ")
		execSync(`./script.sh 'https://www.youtube.com/watch?v=${videoID}' '${videoTitle}.m4a'`, (err, stdout, stderr) => {
		  if (err) {
			console.error(err);
			return;
		  }
		  console.log(stdout);
		})
		var options = {
			root: path.join(__dirname)
		};
		 
		var fileName = 'music.m4a';
		res.download(fileName, `${videoTitle}.m4a`, function (err) {
			if (err) {
				console.log(err);
			} else {
				console.log('Sent:', fileName);
			}
		});
	})

});
