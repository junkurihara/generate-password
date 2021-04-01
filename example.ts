import generator from './src/';

// Generate one password.
let password = generator.generate({
  length: 15, // defaults to 10
  numbers: true, // defaults to false
  symbols: true, // defaults to false
  uppercase: true, // defaults to true
  strict: true // defaults to false
});
console.log(password);

// Generate one password with provided list of symbols.
password = generator.generate({
  length: 15, // defaults to 10
  numbers: true, // defaults to false
  symbols: '!@#$%&*', // defaults to false
  uppercase: true, // defaults to true
  strict: true // defaults to false
});
console.log(password);

// Generate ten bulk.
const passwords = generator.generateMultiple(10, {
  length: 15,
  numbers: true,
  symbols: true,
  uppercase: true
});
console.log(passwords);
