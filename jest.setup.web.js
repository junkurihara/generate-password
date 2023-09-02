// jest.setup.js
const crypto = require('crypto').webcrypto;

global.crypto = crypto;
