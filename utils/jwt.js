const jwt = require('jsonwebtoken');

const JWT_SECRET = 'supersupersecret';

const getJwtToken = (id) => jwt.sign({ _id: id }, JWT_SECRET, { expiresIn: '7d' });

module.exports = {
  getJwtToken,
};
