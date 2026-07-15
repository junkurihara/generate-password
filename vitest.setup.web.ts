// Expose Node's Web Crypto API in the jsdom environment, which does not
// implement it, so that js-crypto-random takes the browser code path.
import {webcrypto} from 'node:crypto';

Object.defineProperty(globalThis, 'crypto', {value: webcrypto, configurable: true});
