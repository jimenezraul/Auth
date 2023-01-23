require('dotenv').config();

class Cookies {
  constructor() {
    this.cookieConfig = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    };

    // bind methods to the class
    this.getCookie = this.getCookie.bind(this);
    this.setCookie = this.setCookie.bind(this);
    this.removeCookie = this.removeCookie.bind(this);

    // return the class instance
    return this;
  }

  getCookie(req, name) {
    return req.cookies[name];
  }

  setCookie = function (res, name, value, options = {}) {
    res.cookie(name, value, {
      ...this.cookieConfig,
      ...options,
    });
  };

  removeCookie = function (res, name, options = {}) {
    res.clearCookie(name, { ...this.cookieConfig, ...options });
  };
}

module.exports = Cookies;
