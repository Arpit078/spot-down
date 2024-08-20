#!/bin/bash

YoutubeUrl=$1
TrackId=$2
TrackName=$3
TrackArtist=$4
TrackImage=$5

yt-dlp -f 'bestaudio[ext=m4a]' "$YoutubeUrl" -o "songs/$TrackId-old.m4a"

curl -L -o "songs/$TrackId.png" "$TrackImage"

if [[ $? -eq 0 ]]; then
  echo "Image downloaded successfully."

  ffmpeg -i "songs/$TrackId-old.m4a" -i "songs/$TrackId.png" -map_metadata 0 -map 0 -map 1 -acodec copy -metadata title="$TrackName" -metadata artist="$TrackArtist" "songs/$TrackId.m4a" -y
  if [[ $? -eq 0 ]]; then
    echo "Cover art set successfully."

    rm "songs/$TrackId.png"
    rm "songs/$TrackId-old.m4a"

  else
    echo "Error setting cover art."
  fi
else
  echo "Error downloading image."
fi
