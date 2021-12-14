// jest.setup.js
const Crypto = require('@peculiar/webcrypto').Crypto;
// import { Crypto } from '@peculiar/webcrypto';

global.crypto = new Crypto();
