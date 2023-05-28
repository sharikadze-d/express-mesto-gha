const http2 = require('http2');
const { verify } = require('../utils/jwt');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res
      .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: 'Необходима авторизация' });
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = verify(token);
  } catch (err) {
    res
      .status(http2.constants.HTTP_STATUS_BAD_REQUEST)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};
