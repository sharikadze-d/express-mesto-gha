function handleError(err, req, res, next) {
  const { statusCode = 500 } = err;
  res.status(statusCode).send({ message: err.message });

  next();
}

module.exports = handleError;
