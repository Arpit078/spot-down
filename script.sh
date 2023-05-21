#!/bin/bash

# Read the variable from Node.js
MYVAR=$1
rm -rf ./music.m4a
# Use the variable
yt-dlp -f 'bestaudio[ext=m4a]' $MYVAR -o ./songs/$2