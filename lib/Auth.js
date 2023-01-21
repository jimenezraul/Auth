const jwt = require('jsonwebtoken');

require('dotenv').config();

class Auth {
  constructor(accessExp, refreshExp, allowedOrigins) {
    this.accessExp = accessExp;
    this.refreshExp = refreshExp;
    this.allowedOrigins = allowedOrigins;
  }

  auth(req) {
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
  }

  generateToken(user, type) {
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
  }

  credentials(req, res, next) {
    const origin = req.headers.origin;

    if (this.allowedOrigins.indexOf(origin) > -1) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
  }

  validateToken(refreshToken) {
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
  }
}

module.exports = Auth;
