import * as fs from 'fs';
import * as stego from './stego';

it('decode . encode = id', () => {
  const image = fs.readFileSync('src/test.gif');
  const key = undefined;
  const message = 'hello, world!';
  const encoded = stego.encode(image, message, key);
  const decoded = stego.decode(encoded, key);
  expect(decoded).toBe(message);
});
