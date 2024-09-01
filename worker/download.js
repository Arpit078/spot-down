// # Run the script from Node.js
import { exec} from 'child_process'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import * as yt from 'youtube-search-without-api-key'

export async function download(url, trackId, trackName, trackArtist, trackImage) {
  return new Promise((resolve, reject) => {
    //----------------uncomment this below if that npm package breaks.------//
    // const videoID = res.data.items[0].id.videoId;
    //----------------------------------------------------------------------//
    // trackName = trackName.replace(/ /g, "_");
    // trackArtist = trackArtist.replace(/ /g, "_");
    const command = `./script.sh "${url}" "${trackId}" "${trackName}" "${trackArtist}" "${trackImage}"`; // change url with videoId if package breaks.
    console.log(command);
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(stdout);
        resolve(true); // Return true on successful completion
      }
    });
  });
}
export async function getSongs(queryObj, trackId,trackName,trackArtist,trackImage,postgres_client) {
  const query = `${queryObj} official lyrics`
  const videos = await yt.search(query);
  console.log(videos[0].url)
  let success = await download(videos[0].url,trackId,trackName,trackArtist,trackImage);
  if(success){
    // First, create the table if it doesn't exist
    await postgres_client.query(`
      CREATE TABLE IF NOT EXISTS songs (
        track_id VARCHAR(255) PRIMARY KEY
      );
    `);

    // Then, insert the value with the conflict handling
    await postgres_client.query(`
      INSERT INTO songs (track_id) VALUES ($1)
      ON CONFLICT (track_id) DO NOTHING;
    `, [trackId]);

  }
}
