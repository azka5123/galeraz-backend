// src/services/authService.js
const { prisma } = require('../models/prisma');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const customError = require('../utils/customError'); // Adjust the path as needed

const JWT_SECRET = process.env.JWT_SECRET;

function expiresAt(number, unit) {
  return moment.tz('Asia/Jakarta').add(moment.duration(number, unit));
}

const register = async ({ name, username, email, password, address }) => {
  if (!name || !username || !email || !password || !address) {
    throw new customError(400, 'All fields are required');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        address,
      },
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '1d',
    });

    await prisma.token.create({
      data: {
        token,
        userId: user.id,
        expiresAt: expiresAt(1, 'd'),
        scope: 'login',
      },
    });

    return {
      status: 'success',
      message: 'User created successfully',
      data: {
        user,
        token,
      },
    };

  } catch (error) {
    if (error.code === 'P2002') {
      const errorMessage = error.meta.target.includes('User_username_key')
        ? 'Username already exists'
        : 'Email already exists';
      throw new customError(400, errorMessage);
    }

    throw new customError(500, 'Something went wrong');
  }
};

const login = async ({ email, password }) => {
  try {
    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      throw new customError(400, 'User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new customError(400, 'Email or password is incorrect');
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '1d',
    });

    await prisma.token.create({
      data: {
        token,
        userId: user.id,
        expiresAt: expiresAt(1, 'd'),
        scope: 'login',
      },
    });

    return {
      status: 'success',
      message: 'User logged in successfully',
      data: {
        token,
      },
    };

  } catch (error) {
    throw new customError(500, error.message);
  }
};

module.exports = { register, login };
