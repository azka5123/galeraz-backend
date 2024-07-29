const express = require("express");
const router = express.Router();
const {register, login} = require("../controllers/authController");

router.post('/v1/register',register);
router.post('/v1/login',login);

module.exports = router;
