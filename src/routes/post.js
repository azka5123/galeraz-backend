const express = require("express");
const router = express.Router();
const { index,store } = require("../controllers/postController");
const { upload } = require("../utils/upload");

router.get('/v1/index',index);
router.post('/v1/store', upload.single('image'), store);

module.exports = router;
