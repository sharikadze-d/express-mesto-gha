const { HTTP_STATUS_CONFLICT } = require('http2').constants;

class AlreadyExistError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AlreadyExistError';
    this.statusCode = HTTP_STATUS_CONFLICT;
  }
}

module.exports = AlreadyExistError;
