export async function poll(songId,redis_client,postgres_client){
    let songExists = await redis_client.get(songId);
    if (songExists === null) {
      songExists = (await postgres_client.query('SELECT COUNT(*) FROM songs WHERE track_id = $1;',[songId])).rows[0].count
      if (songExists == 1) {
        await redis_client.set(songId, songExists);
      }
    }
    return songExists
}