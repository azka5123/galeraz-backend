const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { Multer } = require('../utils/multer');


router.post('/v1/register', Multer.none(), register);


router.post('/v1/login', Multer.none(), login);

module.exports = router;
