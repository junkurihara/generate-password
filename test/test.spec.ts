// https://github.com/mtiller/ts-jest-sample

import {uniq} from 'underscore';
import {getTestEnv} from './prepare';
const env = getTestEnv();
const generator = env.library;
describe('generate-password', () => {
  describe('generate()', () => {
    it('should accept to be called without the options parameter', () => {
      expect(() => {
        generator.generate();
      }).not.toThrow();
    });
    it('should give password of correct length', () => {
      const length = 12;

      const password = generator.generate({length});

      expect(password.length).toEqual(length);
    });

    it('should generate strict random sequence that is correct length', () => {
      const length = 12;

      const password = generator.generate({length, strict: true});

      expect(password.length).toEqual(length);
    });

    it('should remove possible similar characters from the sequences', () => {
      const password = generator.generate({length: 10000, excludeSimilarCharacters: true});

      expect(password).not.toMatch(/[ilLI|`oO0]/);
    });
  });
  describe('strict mode', () => {
    // Testing randomly generated passwords and entropy isn't perfect,
    // thus in order to get a good sample of whether or not a rule
    // is passing correctly, we generate lots of passwords and check
    // each individually. If we're seeing spotty tests, this number should
    // be increased accordingly.
    const amountToGenerate = 500;

    it('should generate strict random sequence that has strictly at least one number', () => {
      const passwords = generator.generateMultiple(amountToGenerate, {length: 4, strict: true, uppercase: false, numbers: true});

      passwords.forEach((password: string) => {
        expect(password).toMatch(/[0-9]/);
      });
      expect(passwords.length).toEqual(amountToGenerate);
    });

    it('should generate strict random sequence that has strictly at least one lowercase letter', () => {
      const passwords = generator.generateMultiple(amountToGenerate, {length: 4, strict: true, uppercase: false});

      passwords.forEach((password: string) => {
        expect(password).toMatch( /[a-z]/);
      });
      expect(passwords.length).toEqual(amountToGenerate);
    });

    it('should generate strict random sequence that has strictly at least one uppercase letter', () => {
      const passwords = generator.generateMultiple(amountToGenerate, {length: 4, strict: true, uppercase: true});

      passwords.forEach((password: string) => {
        expect(password).toMatch(/[A-Z]/);
      });
      expect(passwords.length).toEqual(amountToGenerate);
    });

    it('should generate strict random sequence that has strictly at least one special symbol', () => {
      const passwords = generator.generateMultiple(amountToGenerate, {length: 4, strict: true, symbols: true});

      passwords.forEach((password: string) => {
        expect(password).toMatch(/[\\!@#$%^&*()+_\-=}{[\]|:;"/?.><,`~']/);
      });
      expect(passwords.length).toEqual(amountToGenerate);
    });

    it('should generate strict random sequence that avoids all excluded characters', () => {
      const passwords = generator.generateMultiple(amountToGenerate, {length: 4, strict: true, symbols: true, exclude: '\\abcdefg+_-=}{[]|:;"/?.><,`~\''});

      passwords.forEach((password: string) => {
        expect(password).toMatch(/[!@#$%^&*()]/);
        expect(password).not.toMatch( /[\\abcdefg+_\-=}{[\]|:;"/?.><,`~']/);
      });
      expect(passwords.length).toEqual(amountToGenerate);
    });

    it('should generate strict random sequence that has has no lowercase letter', () => {
      const passwords = generator.generateMultiple(amountToGenerate, { length: 10, strict: true, lowercase: false });

      passwords.forEach((password: string) => {
        expect(password).not.toMatch(/[a-z]/);
      });
      expect(passwords.length).toEqual(amountToGenerate);
    });

    it('should generate strict random sequence that has strictly at least one lowercase, one symbol, and one uppercase letter', () => {
      const passwords = generator.generateMultiple(amountToGenerate, { length: 10, strict: true, uppercase: true, lowercase: true, symbols: true, numbers: true });

      passwords.forEach((password: string) => {
        expect(password).toMatch(/[a-z]/);
        expect(password).toMatch(/[A-Z]/);
        expect(password).toMatch(/[\\!@#$%^&*()+_\-=}{[\]|:;"/?.><,`~']/);
        expect(password).toMatch(/[0-9]/);
      });
      expect(passwords.length).toEqual(amountToGenerate);
    });

    it('should respect explicit list of symbols when provided', () => {
      const passwords = generator.generateMultiple(amountToGenerate, { length: 10, strict: true, symbols: '!', lowercase: true });

      passwords.forEach((password: string) => {
        expect(password).not.toMatch(/[\\@#$%^&*()+_\-=}{[\]|:;"/?.><,`~']/);
        expect(password).toMatch(/[!]/);
      });
      expect(passwords.length).toEqual(amountToGenerate);
    });

    it('should throw an error if rules don\'t correlate with length', () => {
      expect(() => {
        generator.generate({length: 2, strict: true, symbols: true, numbers: true});
      }).toThrow();
    });

    it('should throw an error if no rules are applied', () => {
      expect(() => {
        generator.generate({ length: 10,  uppercase: false, lowercase: false, symbols: false, numbers: false });
      }).toThrow();
    });

    it('should generate short strict passwords without stack overflow', () => {
      expect(() => {
        generator.generate({length: 4, strict: true, uppercase: true, numbers: true, symbols: true});
      }).not.toThrow(Error);
    });
  });

  describe('generateMultiple()', () => {
    it('should accept to be called without the options parameter', () => {
      expect(() => {
        generator.generateMultiple(1);
      }).not.toThrow();
    });
    // should give right amount
    it('should give right amount of passwords', () => {
      const amount = 34;

      const passwords = generator.generateMultiple(amount);

      expect(passwords.length).toEqual(amount);
    });

    // shouldn't give duplicates in pool of 250 (extremely rare)
    it('should not give duplicates in pool', () => {
      const passwords = generator.generateMultiple(250, {length: 10, numbers: true, symbols: true});

      const unique = uniq(passwords);
      expect(unique.length).toEqual(passwords.length);
    });
  });
});
