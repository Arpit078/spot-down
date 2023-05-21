// # Run the script from Node.js
import axios from 'axios'
import { execSync,spawnSync,exec} from 'child_process'
import {spotifyTracks,refreshToken} from './spotify.js'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import * as yt from 'youtube-search-without-api-key';



export async function download(url, trackName) {
  return new Promise((resolve, reject) => {
    axios.get(url).then((res) => {
      //----------------uncomment this below if that npm package breaks.------//
      // const videoID = res.data.items[0].id.videoId;
      //----------------------------------------------------------------------//
      const videoTitle = trackName.replace(/ /g, "_");
      const command = `./script.sh "${url}" "${videoTitle}.m4a"`;//change url with videoId if package breaks.
      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(stdout);
          resolve();
        }
      });
    });
  });
}

export async function getSongs(playlistID, spotifyToken, ytKey) {
  // const playlistId = playlistUrl.replace("https://open.spotify.com/playlist/","")
  const array = await spotifyTracks(playlistID, spotifyToken);
  const downloadPromises = array.map(async (item) => {
    const query = item.trackName + " by " + item.artistName;
    
    //-----------------------------------------------------------//
    //for the while the npm package is working!!
    // const url = `https://www.googleapis.com/youtube/v3/search?key=${ytKey}&q=${query}%20lyrics&type=video&part=snippet`;

    //comment the following code if the lib is rendered useless. uncomment the upper block plis!
    const videos = await yt.search(`${query} lyrics`);
    const url = await videos[0].url
    console.log(url)

    //-----------------------------------------------------------//

    await download(url, item.trackName);
  });
  await Promise.all(downloadPromises);
}
