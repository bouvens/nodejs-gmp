import { Transform } from 'stream';

class ReverseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    try {
      const line = chunk.toString().replace(/\n$/, '');
      const lastIndex = line.length - 1;
      const reversed = line
        .split('')
        .map((letter, index, line) => line[lastIndex - index])
        .join('');
      callback(null, `${reversed}\n`);
    } catch (error) {
      callback(error);
    }
  }
}

const reverse = new ReverseTransform();

process.stdin.pipe(reverse).pipe(process.stdout);
