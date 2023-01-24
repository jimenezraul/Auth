const { Auth, Cookies } = require('@jimenezraul/auth');

const auth = new Auth('1m', '1d', ['http://localhost:3000']);
const cookies = new Cookies();

test('Auth class', () => {
  expect(auth.accessExp).toBe('1m');
  expect(auth.refreshExp).toBe('1d');
  expect(auth.allowedOrigins).toEqual(['http://localhost:3000']);
});

test('Auth.auth', () => {
  const req = {
    headers: {},
  };
  const res = {};
  const auth = new Auth('1m', '1d', ['http://localhost:3000']);
  const userAuth = auth.auth({req, res});
  // expected to return req
  expect(userAuth).toEqual(req);
});

test('Auth.generateToken', () => {
  const req = {
    headers: {},
  };
  const res = {};
  const auth = new Auth('1m', '1d', ['http://localhost:3000']);
  const response = auth.generateToken(
    { firstName: 'John', lastName: 'Doe' },
    'accessToken'
  );

  console.log(response);
});

test('removeCookie', () => {
  const user = {
    firstName: 'John',
    lastName: 'Doe',
  };

  const res = {
    // mock a cookie function
    cookie: function (name, value, options) {
      this.cookies = { [name]: value, ...options };
    },
  };

  const tokens = ['access_token', 'refresh_token'];

  // Generate Access Token and Refresh Token
  tokens.map((tokenName) => {
    const token = auth.generateToken(user, tokenName);
    console.log(tokenName);
    cookies.setCookie(res, tokenName, token);
    console.log(res);
  });
});