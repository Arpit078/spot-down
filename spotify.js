import axios  from "axios"
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()


export async function refreshToken(clientSecret,clientId){
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

export async function spotifyTracks(playlistId,spotifyToken){

      let spotifyUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`
      const arr = axios.get(spotifyUrl, { headers: 
        {"Authorization" : `Bearer ${spotifyToken}`},
      }).then((res)=>{
          const data = res.data.items
          let array = []
          for(let i=0;i<data.length;i++){
              array.push({
                "trackName" : data[i].track.name,
                "artistName": data[i].track.artists[0].name
              })
          }
          return array
      })
      return arr


}



// const token  =  await refreshToken("0826f6269a6542a3bd0bf5a6e329263c","dd7930c0a4a14972a2815e0324b9d58b")
// const arr = await spotifyTracks("6OIyGmoeM9DicKv2eCMUWJ",token)
// console.log(arr)


