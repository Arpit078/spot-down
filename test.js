import * as yt from 'youtube-search-without-api-key';

const videos = await yt.search('Hallo Welt');
// const videos = await yt.search('y5kIrbG2gRc');
console.log('Videos:');
console.log(videos);