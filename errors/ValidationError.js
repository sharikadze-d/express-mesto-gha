const { HTTP_STATUS_BAD_REQUEST } = require('http2').constants;

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = HTTP_STATUS_BAD_REQUEST;
  }
}

module.exports = ValidationError;
