/**
 * prepare.ts
 */

import * as sourceLibrary from '../src/index';

// Keep in sync with libName in webpack.baseconfig.js. The base config is a
// CommonJS module without type declarations, so the name is inlined here.
const libName = 'generate-password';

type Library = typeof sourceLibrary;

export const getTestEnv = () => {
  let envName;
  let message;
  let library: Library;

  if (process.env.TEST_ENV === 'window') {
    const windowLibrary =
      typeof window !== 'undefined' ? (window as typeof window & Record<string, Library | undefined>)[libName] : undefined;
    if (typeof windowLibrary !== 'undefined') {
      envName = 'Window';
      library = windowLibrary;
      message = '**This is a test with a library imported from window.**';
    }
    else throw new Error('The library is not loaded in window object.');
  }
  else {
    envName = 'Source';
    library = sourceLibrary;
    message = '**This is a test with source codes in src.**';
  }

  return {library, envName, message};
};
