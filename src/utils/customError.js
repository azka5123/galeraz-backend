class CustomError extends Error {
  constructor(statusCode, message, error = {}) {
    super(message);
    this.statusCode = statusCode;
    this.details = error.details || message;
  }
}

module.exports = CustomError;
