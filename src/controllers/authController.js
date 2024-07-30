// src/controllers/postController.js
const authService = require('../services/authService');
const customError = require('../utils/customError'); // Adjust the path as needed

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof customError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof customError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
      error: error.message,
    });
  }
};

module.exports = { register, login };
