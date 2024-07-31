const express = require("express");
const router = express.Router();
const { index, show, store, update, destroy } = require("../controllers/postController");
const { Multer } = require("../utils/multer");

router.get('/v1/index', index);
router.get('/v1/show/:id', show);
router.post('/v1/store', Multer.single('image'), store);
router.put('/v1/update/:id', Multer.single('image'), update);
router.delete('/v1/destroy/:id', destroy);

module.exports = router;
