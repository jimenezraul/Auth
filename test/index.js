const Auth = require('@jimenezraul/auth');

const auth = new Auth('1m', '1d', ['http://localhost:3000']);

console.log(auth.accessExp); // return the expiration time for access and refresh tokens
console.log(auth.refreshExp); // return the expiration time for access and refresh tokens
console.log(auth.allowedOrigins); // return an array of allowed origins

const accessToken = auth.generateToken(
  { firstName: 'John', lastName: 'Doe' },
  'accessToken'
);

console.log(accessToken); // return a valid access token

const refreshToken = auth.generateToken(
  {
    firstName: 'John',
    lastName: 'Doe',
  },
  'refreshToken'
);

console.log(refreshToken); // return a valid refresh token

console.log(auth.validateToken(refreshToken)); // return true if token is valid

console.log(auth); // return the class instance

module.exports = auth;
