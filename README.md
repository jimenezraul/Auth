<p align="center">
    <img src="./img/auth-logo.png" alt="Parsifal logo" width="250">
</p>

## Description

This is a Auth module that provides a simple way to check if a user is authenticated. Every route that you want to protect you check if a user is passed in the request object. If the user is not passed, it means that the token is not valid or the user has not been authenticated yet. It also provides a middleware to check if the origin of the request is allowed. If the access_token is expired, it will generate a new access token if the refresh token is valid.

Some other functionalities are:

- Auth
  - `auth`
  - `generateToken`
  - `credentials`
  - `validateToken`
- Cookies
  - `getCookie`
  - `getSignedCookie`
  - `setCookie`
  - `removeCookie`

## Table of Contents

- [Description](#description)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
- [Adding middleware to the express app](#adding-middleware-to-the-express-app)
- [Generate Access Token and Refresh Token](#generate-access-token-and-refresh-token)
- [Validate Token](#validate-token)
- [How to use Cookies](#how-to-use-cookies)
- [How to use signed cookies](#how-to-use-signed-cookies)
- [License](#license)
- [Author](#author)
- [Website](#website)

## Installation

```bash
npm i @jimenezraul/auth
```

or

```bash
yarn add @jimenezraul/auth
```

## Usage

Create a .env file in the root folder and add the following code:

```bash
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

Create a file called `allowedOrigins.js` in the config folder and add the allowed origins. This is used to check if the origin of the request is allowed. You can add localhost for development and the production url for production.

```javascript
const allowedOrigins = [
  'http://localhost:3000', // Add as many origins as you want
];

module.exports = allowedOrigins;
```

Create another file called `auth.js` in the middleware folder and add the following code:

```javascript
const allowedOrigins = require('../config/allowedOrigins'); // List of allowed origins
const { Auth } = require('@jimenezraul/Auth'); // Auth module

const authMiddleware = new Auth('15m', '7d', allowedOrigins); // Initialize Auth module with (access token expiration time, refresh token expiration time, allowed origins)

module.exports = authMiddleware;
```

## Adding middleware to the express app

In the `server.js` file, add the following code:

```javascript
const authMiddleware = require('./middleware/auth'); // Auth middleware

// add the middleware after initializing the express app
app.use(authMiddleware.credentials);
app.use(authMiddleware.auth);
```

Now every route that you want to protect you check if a user is passed in the request object. If the user is not passed, it means that the token is not valid.

```javascript
app.get('/api/v1/protected', (req, res) => {
  if (req.user) {
    res.status(200).json({ message: 'You are authenticated' });
  } else {
    res.status(401).json({ message: 'You are not authenticated' });
  }
});
```

## Generate Access Token and Refresh Token

In the `routes.js` file, add the following code:

```javascript
const authMiddleware = require('./middleware/auth');

app.post('/api/v1/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password are correct
  if (username === 'admin' && password === 'admin') {
    const user = {
      username: 'admin',
      role: 'admin',
    };

    tokenNames = ['access_token', 'refresh_token'];

    tokenArray = [];
    // Generate Access Token and Refresh Token
    tokenNames.forEach((tokenName) => {
      const token = authMiddleware.generateToken(user, tokenName);
      tokenArray.push(token);
    });

    res
      .status(200)
      .json({ access_token: tokenArray[0], refresh_token: tokenArray[1] });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});
```

## Validate Token

In the `routes.js` file, add the following code:

```javascript
const authMiddleware = require('./middleware/auth');

app.post('/api/v1/refresh', (req, res) => {
 // check if the refresh token is passed in the cookie
  const refreshToken = req.cookies.refresh_token;

  // Validate Refresh Token
  const isValid = authMiddleware.validateToken(refreshToken); // returns true or false

  if(!isValid){
    res.status(401).json({ message: 'Invalid token' });
  } else {
    const user = {
      username: 'admin',
      role: 'admin',
    };

    // Generate Access Token and Refresh Token
    const accessToken = authMiddleware.generateToken(user, "access_token");
    //... rest of the code
  }
```

## How to use Cookies

Create a file called `cookies.js` in the middleware folder and add the following code:

```javascript
const { Cookies } = require('@jimenezraul/Auth'); // Auth module

const cookies = new Cookies(); // Initialize Cookies module

module.exports = cookies;
```

Import the cookies in the `routes.js` file and add the following code:

```javascript
const cookies = require('./middleware/cookies');
const authMiddleware = require('./middleware/auth');

app.post('/api/v1/refresh', (req, res) => {
  // check if the refresh token is passed in the cookie
  const refreshToken = req.cookies.refreshToken;

  // Validate Refresh Token
  const isValid = authMiddleware.validateToken(refreshToken); // returns true or false

  if (!isValid) {
    res.status(401).json({ message: 'Invalid token' });
  } else {
    // Get the user from the database that matches that refresh token
    const user = {
      username: 'admin',
      role: 'admin',
    }; // example of a user object

    const tokens = ['access_token', 'refresh_token'];

    let tokenArray = [];

    // Generate Access Token and Refresh Token
    tokens.forEach((tokenName) => {
      const token = authMiddleware.generateToken(user, tokenName); // generate a token
      tokenArray.push(token); // add the token to the array
      cookies.setCookie(res, tokenName, token); // set the cookie
    });

    res
      .status(200)
      .json({ access_token: tokenArray[0], refresh_token: tokenArray[1] });
  }
});
```

## How to use signed cookies

To sign the cookies you have to install the `cookie-parser` package:

```bash
npm install cookie-parser
```

Set the secret in the `server.js` file:

```javascript
const cookieParser = require('cookie-parser');

// add the cookie parser after initializing the express app
app.use(cookieParser('yoursecret'));
```

Now you can use the signed cookies:

```javascript
const cookies = require('./middleware/cookies');

app.post('/api/v1/refresh', (req, res) => {
  // Now you can use the signed cookies
  const refreshToken = cookies.getSignedCookie(req, 'refresh_token');

  // rest of the code
});
```


## License

[ISC](https://opensource.org/licenses/ISC)

## Author

Raul Jimenez

## Website

[RaulWebDev.com](https://raulwebdev.com)
