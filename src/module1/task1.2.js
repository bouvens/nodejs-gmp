import fs from 'fs';
import path from 'path';
import csv from 'csvtojson';

const SOURCE_FILE = 'csv/example.csv';
const RESULT_PATH = 'out';
const RESULT_FILE = path.join(RESULT_PATH, 'result.txt');

try {
  if (!fs.existsSync(RESULT_PATH)) {
    fs.mkdirSync(RESULT_PATH, { recursive: true });
  }
} catch (e) {
  console.error(e);
}

const readStream = fs.createReadStream(SOURCE_FILE);
const writeStream = fs.createWriteStream(RESULT_FILE);

readStream.on('error', console.error);
writeStream.on('error', console.error);

readStream.pipe(csv()).pipe(writeStream);
