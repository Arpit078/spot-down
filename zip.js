import fs from 'fs';
import archiver from 'archiver';

export function zip(sourceFolderPath, destFilePath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(destFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`Folder ${sourceFolderPath} compressed successfully.`);
      resolve(destFilePath);
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(sourceFolderPath, false);
    archive.finalize();
  });
}
