const { Cookies } = require('@jimenezraul/auth');

const cookie = new Cookies();

test('setCookie', () => {
  const res = {
    // mock a cookie function
    cookie: function (name, value, options) {
      this.cookies = { [name]: value };
    },
  };

  cookie.setCookie(res, 'access_token', '1234567890');
  // expected to return req with a accessToken
  expect(res.cookies['access_token']).toEqual('1234567890');
});

test('getCookie', () => {
  const req = {
    cookies: { access_token: 123 },
  };

  const res = {};

  const token = cookie.getCookie(req, 'access_token');

  // expected to return req with a accessToken
  expect(token).toEqual(123);
});
