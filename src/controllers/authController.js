const authService = require('../services/authService');
const customError = require('../utils/customError'); // Adjust the path as needed

const register = async (req, res) => {
  const { name, username, email, password, address } = req.body;
  if (!name || !username || !email || !password || !address) {
    throw new customError(400, 'All fields are required');
  }
  // console.log('Received values:', { name, username, email, password, address });
  try {
    const result = await authService.register({name, username, email, password, address});
    return res.status(201).json(result);
  } catch (error) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        error: error,
      });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new customError(400, 'All fields are required');
    }
    const result = await authService.login({email, password});
    return res.status(200).json(result);
  } catch (error) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        error: error,
      });
  }
};

module.exports = { register, login };
