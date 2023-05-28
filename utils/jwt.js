const jwt = require('jsonwebtoken');

const JWT_SECRET = 'supersupersecret';

const getJwtToken = (id) => jwt.sign({ _id: id }, JWT_SECRET, { expiresIn: '7d' });

const verify = (token) => jwt.verify(token, JWT_SECRET);

module.exports = {
  getJwtToken,
  verify,
};
