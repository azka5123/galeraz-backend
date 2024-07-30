class CustomError extends Error {
    constructor(statusCode, message,error) {
      super(message);
      this.statusCode = statusCode;
      this.error = {
        message: error.message,
        error: error
      }
    }
  }
  
  module.exports = CustomError;
  