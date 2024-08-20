FROM ubuntu:latest
USER root
WORKDIR /app
RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_16.x  | bash -
RUN apt-get -y install nodejs ffmpeg python3 python3-pip

RUN pip3 install yt-dlp 

ADD script.sh /bin/script
RUN chmod +x /bin/script


COPY package.json ./

RUN npm install

COPY . .
# key comes 1st in argument then id
ENV YOUTUBE_API_KEY=AIzaSyAQxX1NjBQpOZfLuO-7qqwrtCUdpLL8tJg
ENV PORT 10000
EXPOSE 10000


CMD ["npm" , "start"]