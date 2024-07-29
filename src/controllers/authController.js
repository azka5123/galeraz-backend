const { prisma } = require("../models/prisma");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");
const crypto = require("crypto");
const transporter = require("../services/emailService");
const JWT_SECRET = process.env.JWT_SECRET;

function expiresAt(number, unit) {
  const local = moment.tz("Asia/Jakarta");
  const expiresAt = moment(local).add(moment.duration(number, unit));
  return expiresAt;
}

async function register(req, res) {
  // return res.json(JWT_SECRET);
  const { name, username, email, password, address } = req.body;
  if (!name || !username || !email || !password || !address) {
    return res.status(400).json({
      status: "error",
      message: "All fields are required",
      missingField: {
        name: !name ? "Name is required" : undefined,
        username: !username ? "Username is required" : undefined,
        email: !email ? "Email is required" : undefined,
        password: !password ? "Password is required" : undefined,
        address: !address ? "Address is required" : undefined,
      },
    });
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
      expiresIn: "1d",
    });
    await prisma.token.create({
      data: {
        token,
        userId: user.id,
        expiresAt: expiresAt(1, "d"),
        scope: "login",
      },
    });
    return res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        user: user,
        token: token,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      if (error.meta.target.includes("User_username_key")) {
        return res.status(400).json({
          status: "error",
          message: "Username already exists",
        });
      } else if (error.meta.target.includes("User_email_key")) {
        return res.status(400).json({
          status: "error",
          message: "Email already exists",
        });
      }
    }

    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: {
        message: error.message,
        error: error,
      },
    });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: "error",
        message: "Email or password is incorrect",
      });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });
    await prisma.token.create({
      data: {
        token,
        userId: user.id,
        expiresAt: expiresAt(1, "d"),
        scope: "login",
      },
    });
    return res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      data: {
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: {
        message: error.message,
        error: error,
      }.message,
    });
  }
}

async function forgetPassword(req,res){
  // const {email}
}

module.exports = {
  register,
  login,
  forgetPassword,
};
