#!/bin/bash

YoutubeUrl=$1
TrackId=$2
TrackName=$3
TrackArtist=$4
TrackImage=$5

yt-dlp -f 'bestaudio[ext=m4a]' "$YoutubeUrl" -o "/app/songs/$TrackId-old.m4a"

curl -L -o "/app/songs/$TrackId.png" "$TrackImage"

if [[ $? -eq 0 ]]; then
  echo "Image downloaded successfully."

  ffmpeg -i "/app/songs/$TrackId-old.m4a" -i "/app/songs/$TrackId.png" -map_metadata 0 -map 0 -map 1 -acodec copy -metadata title="$TrackName" -metadata artist="$TrackArtist" "/app/songs/$TrackId.m4a" -y
  if [[ $? -eq 0 ]]; then
    echo "Cover art set successfully."

    rm "/app/songs/$TrackId.png"
    rm "/app/songs/$TrackId-old.m4a"

  else
    echo "Error setting cover art."
    ffmpeg -i "/app/songs/$TrackId-old.m4a" -i "default.png" -map_metadata 0 -map 0 -map 1 -acodec copy -metadata title="$TrackName" -metadata artist="$TrackArtist" "/app/songs/$TrackId.m4a" -y
  fi
else
  echo "Error downloading image."
fi
