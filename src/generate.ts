/**
 * generate.ts
 */
import jscr from 'js-crypto-random';

// var self = module.exports;

const RANDOM_BATCH_SIZE = 256;

let randomIndex: number|undefined = undefined;
let randomBytes: Uint8Array = new Uint8Array();

const getNextRandomValue = () => {
  if (randomIndex === undefined || randomIndex >= randomBytes.length) {
    randomIndex = 0;
    randomBytes = jscr.getRandomBytes(RANDOM_BATCH_SIZE);
  }

  const result = randomBytes[randomIndex];
  randomIndex += 1;

  return result;
};

// Generates a random number
const randomNumber = (max: number) => {
  // gives a number between 0 (inclusive) and max (exclusive)
  let rand = getNextRandomValue();
  while (rand >= 256 - (256 % max)) {
    rand = getNextRandomValue();
  }
  return rand % max;
};

// Possible combinations
const lowercase = 'abcdefghijklmnopqrstuvwxyz',
  uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers = '0123456789',
  symbols = '\\!@#$%^&*()+_-=}{[]|:;"/?.><,`~\'',
  similarCharacters = /[ilLI|`oO0]/g,
  strictRules = [
    { name: 'lowercase', rule: /[a-z]/ },
    { name: 'uppercase', rule: /[A-Z]/ },
    { name: 'numbers', rule: /[0-9]/ },
    { name: 'symbols', rule: /[\\!@#$%^&*()+_\-=}{[\]|:;"/?.><,`~']/ }
  ];

const generateLocal = (options: Options, pool: string): string => {
  let password = '';
  const optionsLength = options.length,
    poolLength = pool.length;

  for (let i = 0; i < (optionsLength as number); i++) {
    password += pool[randomNumber(poolLength)];
  }

  if (options.strict) {
    // Iterate over each rule, checking to see if the password works.
    const fitsRules = strictRules.every((rule) => {
      // If the option is not checked, ignore it.
      if (options[(rule.name as 'lowercase'||'uppercase'||'numbers'||'symbols')] == false) return true;

      // Treat symbol differently if explicit string is provided
      if (rule.name === 'symbols' && typeof options[rule.name] === 'string') {
        // Create a regular expression from the provided symbols
        const re = new RegExp(`[${options[rule.name]}]`);
        return re.test(password);
      }

      // Run the regex on the password and return whether
      // or not it matches.
      return rule.rule.test(password);
    });

    // If it doesn't fit the rules, generate a new one (recursion).
    if (!fitsRules) return generateLocal(options, pool);
  }

  return password;
};

export interface Options {
	length?: number;
	numbers?: boolean;
	symbols?: boolean|string;
	exclude?: string;
	uppercase?: boolean;
	lowercase?: boolean;
	excludeSimilarCharacters?: boolean;
	strict?: boolean;
}

// Generate a random password.
export const generate = (options: Options): string => {
  // Set defaults.
  options = options || {};
  if (!Object.prototype.hasOwnProperty.call(options, 'length')) options.length = 10;
  if (!Object.prototype.hasOwnProperty.call(options, 'numbers')) options.numbers = false;
  if (!Object.prototype.hasOwnProperty.call(options, 'symbols')) options.symbols = false;
  if (!Object.prototype.hasOwnProperty.call(options, 'exclude')) options.exclude = '';
  if (!Object.prototype.hasOwnProperty.call(options, 'uppercase')) options.uppercase = true;
  if (!Object.prototype.hasOwnProperty.call(options, 'lowercase')) options.lowercase = true;
  if (!Object.prototype.hasOwnProperty.call(options, 'excludeSimilarCharacters')) options.excludeSimilarCharacters = false;
  if (!Object.prototype.hasOwnProperty.call(options, 'strict')) options.strict = false;

  if (options.strict) {
    const minStrictLength = 1 + (options.numbers ? 1 : 0) + (options.symbols ? 1 : 0) + (options.uppercase ? 1 : 0);
    if (minStrictLength > (options.length as number)) {
      throw new TypeError('Length must correlate with strict guidelines');
    }
  }

  // Generate character pool
  let pool = '';

  // lowercase
  if (options.lowercase) {
    pool += lowercase;
  }

  // uppercase
  if (options.uppercase) {
    pool += uppercase;
  }
  // numbers
  if (options.numbers) {
    pool += numbers;
  }
  // symbols
  if (options.symbols) {
    if (typeof options.symbols === 'string') {
      pool += options.symbols;
    } else {
      pool += symbols;
    }
  }

  // Throw error if pool is empty.
  if (!pool) {
    throw new TypeError('At least one rule for pools must be true');
  }

  // similar characters
  if (options.excludeSimilarCharacters) {
    pool = pool.replace(similarCharacters, '');
  }

  // excludes characters from the pool
  let i = (options.exclude as string).length;
  while (i--) {
    pool = pool.replace((options.exclude as string)[i], '');
  }

  return generateLocal(options, pool);
};

// Generates multiple passwords at once with the same options.
export const generateMultiple = (amount: number, options: Options): Array<string> => {
  const passwords = [];

  for (let i = 0; i < amount; i++) {
    passwords.push(generate(options));
  }

  return passwords;
};
