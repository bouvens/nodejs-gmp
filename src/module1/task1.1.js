import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', (input) => {
  const length = input.length - 1;
  const output = input
    .split('')
    .map((letter, index, line) => line[length - index])
    .join('');
  rl.output.write(`${output}\n`);
});
