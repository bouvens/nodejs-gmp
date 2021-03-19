import fs from 'fs';
import csv from 'csvtojson';

const SOURCE_PATH = './csv/example.csv';
const OUTPUT_PATH = './out/result.txt';

const readStream = fs.createReadStream(SOURCE_PATH);
const writeStream = fs.createWriteStream(OUTPUT_PATH);

readStream.on('error', console.error);

readStream.pipe(csv()).pipe(writeStream);
