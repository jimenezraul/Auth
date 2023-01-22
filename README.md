<p align="center">
    <img src="./img/auth-logo.png" alt="Parsifal logo" height="400">
</p>

## Description

This is a Auth module that provides a simple way to authenticate users. It will check for token in the header and validate it. If the token is valid, it will set the user in the request object.

Some other functionalities are:

- Generate Access Token and Refresh Token
- Validate Token
- Credentials

## Table of Contents

- [Description](#description)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
- [Adding middleware to the express app](#adding-middleware-to-the-express-app)
- [Generate Access Token and Refresh Token](#generate-access-token-and-refresh-token)
- [Validate Token](#validate-token)
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
const Auth = require('@jimenezraul/Auth'); // Auth module

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

    // Generate Access Token and Refresh Token
    const accessToken = authMiddleware.generateToken(user, 'accessToken');
    const refreshToken = authMiddleware.generateToken(user, 'refreshToken');

    res.status(200).json({ accessToken, refreshToken });
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
  const refreshToken = req.cookies.refreshToken;

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
    const accessToken = authMiddleware.generateToken(user, "accessToken");
  }

//... more code
```

## License

[ISC](https://opensource.org/licenses/ISC)

## Author

Raul Jimenez

## Website

[RaulWebDev.com](https://raulwebdev.com)
