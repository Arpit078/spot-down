import express from "express"
const app = express()
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import { getPlaylistTracks,getSearchedTracks,getSpotifyToken } from "./spotify.js";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import { postgres_client } from "./lib/postgres_wrapper.js";
import { redis_client } from "./lib/redis_wrapper.js";
import { poll } from "./utils.js";
import { send_message} from "./lib/rabbitMQ_wrapper.js";
var PORT = process.env.PORT||5001;

app.get('/api/search', async (req, res) => {
    try{
        let query = req.body.query;
        let token = await getSpotifyToken(redis_client);
        let data = await getSearchedTracks(query,token);
        res.status(200).send(data)
    } catch(err){
      console.error(err);
	    res.status(err.response.status).send(err.response.data);
    }
})

app.get('/api/queryPlaylist', async (req, res) => {
	try {
      let playlistId = req.body.playlistUrl.match(/playlist\/(.*?)\?/)[1];
      console.log(playlistId)
      let token = await getSpotifyToken(redis_client);
      console.log(`got token ${token}`)
      let data = await getPlaylistTracks(playlistId,token);
      console.log("data",data)
      res.status(200).send(data)
	} catch (err) {
	  console.error(err);
	  res.status(err.response.status).send(err.response.data);
	}
  });
  
app.get('/api/poll',async (req,res)=>{
  try{
    let songId = req.body.songId;
    let songExists = await poll(songId,redis_client,postgres_client);
    res.status(200).json({ success: songExists }); 

  }catch(err){
    console.error(err);
	  res.status(err.response.status).send(err.response.data);
  }
})
app.post('/api/download', async (req, res) => {
  try {
    let songs = req.body.songs;

    const filteredSongs = [];
    for (let i=0;i<songs.length;i++) {
      const songExists = await poll(songs[i].id, redis_client, postgres_client); // Access song ID
      if (songExists != 1) {
        filteredSongs.push(songs[i]);
      } 
    }

    let isSent = await send_message('download_queue', filteredSongs);
    res.status(200).send({ success: isSent });

  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, function(err){
	if (err) console.log(err);
	console.log("Server listening on PORT", PORT);
});
