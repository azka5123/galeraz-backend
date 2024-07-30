const express = require("express");
const router = express.Router();
const {register, login} = require("../controllers/authController");
const { upload } = require("../utils/upload");


router.post('/v1/register',upload.none(),register);
router.post('/v1/login',upload.none(),login);

module.exports = router;
