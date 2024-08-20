import axios  from "axios"
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()


async function refreshToken(clientSecret,clientId){
  const authString = `${clientId}:${clientSecret}`;
  const base64AuthString = Buffer.from(authString).toString('base64');
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${base64AuthString}`
  };
  const data = 'grant_type=client_credentials';
  const token = axios.post('https://accounts.spotify.com/api/token', data, { headers })
  .then(async (response)=> {
    return response.data.access_token
  })
  return token

}
export async function getSpotifyToken(redis_client) {
  let token = await redis_client.get('spotify_token');
  
  if (!token) {
    console.log("setting spotify token");
    token = await refreshToken(process.env.CLIENT_SECRET, process.env.CLIENT_ID);
    await redis_client.set('spotify_token', token); // Set the token without expiration
    await redis_client.expire('spotify_token', 1800); // Set expiration time to 1800 seconds (30 minutes)
  }

  return token;
}


export async function getPlaylistTracks(playlistId,spotifyToken){
      let spotifyUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`
      const arr = axios.get(spotifyUrl, { headers: 
        {"Authorization" : `Bearer ${spotifyToken}`},
      }).then((res)=>{
          const data = res.data.items
          let array = []
          for(let i=0;i<data.length;i++){
              array.push({
                "id": data[i].track.id,
                "trackName" : data[i].track.name,
                "artistName": data[i].track.artists[0].name,
                "imageUrl":  data[i].track.album.images[0].url
              })
          }
          return array
      })
      return arr
}


export async function getSearchedTracks(query,spotifyToken){
  let spotifyUrl = `https://api.spotify.com/v1/search?q=${query}&type=track`
  const arr = axios.get(spotifyUrl, { headers: 
    {"Authorization" : `Bearer ${spotifyToken}`},
  }).then((res)=>{
      const data = res.data.tracks.items
      let array = []
      for(let i=0;i<data.length;i++){
          array.push({
            "id": data[i].id,
            "trackName" : data[i].name,
            "artistName": data[i].artists[0].name,
            "imageUrl":  data[i].album.images[0].url
            
          })
      }
      return array
  })
  return arr
}
