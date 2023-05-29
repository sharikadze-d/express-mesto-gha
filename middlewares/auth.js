const { verify } = require('../utils/jwt');
const UnauthorizedError = require('../errors/UnauthoriedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = verify(token);
  } catch (err) {
    throw Promise.reject(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
