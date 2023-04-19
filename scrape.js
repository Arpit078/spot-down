// # Run the script from Node.js
import axios from 'axios'
import { execSync,spawnSync,exec} from 'child_process'
import {spotifyTracks,refreshToken} from './spotify.js'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()


export async function download(url, trackName, folderName) {
  return new Promise((resolve, reject) => {
    axios.get(url).then((res) => {
      const videoID = res.data.items[0].id.videoId;
      const videoTitle = trackName.replace(/ /g, "_");
      const command = `./script.sh "https://www.youtube.com/watch?v=${videoID}" "${videoTitle}.m4a" "${folderName}"`;
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

export async function getSongs(playlistID, spotifyToken, ytKey, folderName) {
  // const playlistId = playlistUrl.replace("https://open.spotify.com/playlist/","")
  const array = await spotifyTracks(playlistID, spotifyToken);
  const downloadPromises = array.map(async (item) => {
    const query = item.trackName + " by " + item.artistName;
    const url = `https://www.googleapis.com/youtube/v3/search?key=${ytKey}&q=${query}%20lyrics&type=video&part=snippet`;
    await download(url, item.trackName, folderName);
  });
  await Promise.all(downloadPromises);
}
// module.exports = {getSongs,download}
// const token  =  await refreshToken("0826f6269a6542a3bd0bf5a6e329263c","dd7930c0a4a14972a2815e0324b9d58b")
// getSongs("1qpDYY8t6WcPPNlJVtSZXx",token,process.env.YOUTUBE_API_KEY,"h")
