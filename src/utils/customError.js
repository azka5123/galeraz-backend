class CustomError extends Error {
  constructor(statusCode, message, error = {}) {
    super(message);
    this.statusCode = statusCode;
    this.error = {
      message: error.message || null,
      error: error,
    };
  }
}

module.exports = CustomError;
