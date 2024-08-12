const express = require('express');
const checkAuth = require('../middleware/checkAuth')
const authRoutes = require('./auth');
const postRoutes = require('./post');
const albumRoutes = require('./album');
const likeRoutes = require('./like');
const commentRoutes = require('./comment');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerOptions = require('../docs/swagger');
const fileUpload = require("express-fileupload");

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

const router = express.Router();

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// console.log(swaggerDocs);
router.use('/api-docs/v1', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    customCss:
        '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl: CSS_URL,
}));

router.use(fileUpload());

router.use('/api/auth', authRoutes);

router.use('/api/post', postRoutes);

router.use('/api/album', albumRoutes);

router.use('/api/like', likeRoutes);

router.use('/api/comment', commentRoutes);

module.exports = router;
