const jwt = require('jsonwebtoken');

require('dotenv').config();

class Auth {
  #accessExp;
  #refreshExp;
  #allowedOrigins;

  constructor(accessExp, refreshExp, allowedOrigins) {
    this.#accessExp = accessExp;
    this.#refreshExp = refreshExp;
    this.#allowedOrigins = allowedOrigins;

    // bind methods to the class
    this.auth = this.auth.bind(this);
    this.generateToken = this.generateToken.bind(this);
    this.credentials = this.credentials.bind(this);
    this.validateToken = this.validateToken.bind(this);

    // return the class instance
    return this;
  }

  get accessExp() {
    return this.#accessExp;
  }

  get refreshExp() {
    return this.#refreshExp;
  }

  get allowedOrigins() {
    return this.#allowedOrigins;
  }

  auth = function (req) {
    let token = req.headers.authorization || req.headers.Authorization;

    if (!token) {
      return req;
    }

    token = token.split(' ').pop().trim();

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      {
        maxAge: this.accessExp,
      },
      (err, decoded) => {
        if (err) {
          return req;
        }
        req.user = decoded.user;
        return req;
      }
    );

    return req;
  };

  generateToken = function (user, type) {
    let secret = process.env.ACCESS_TOKEN_SECRET;

    if (type === 'refreshToken') {
      secret = process.env.REFRESH_TOKEN_SECRET;

      return jwt.sign(
        {
          user,
        },
        secret,
        {
          expiresIn: this.refreshExp,
        }
      );
    }

    return jwt.sign(user, secret, {
      expiresIn: this.accessExp,
    });
  };

  credentials = function (req, res, next) {
    const origin = req.headers.origin;
    
    if (this.allowedOrigins.indexOf(origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
  };

  validateToken = function (refreshToken) {
    return jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return false;
        }
        return true;
      }
    );
  };
}

module.exports = Auth;
