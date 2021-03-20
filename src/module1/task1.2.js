import fs from 'fs';
import csv from 'csvtojson';

const SOURCE_PATH = './csv/example.csv';
const RESULT_PATH = './out/result.txt';

const readStream = fs.createReadStream(SOURCE_PATH);
const writeStream = fs.createWriteStream(RESULT_PATH);

readStream.on('error', console.error);

readStream.pipe(csv()).pipe(writeStream);
