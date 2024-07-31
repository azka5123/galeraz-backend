const express = require('express');
const checkAuth = require('../middleware/checkAuth')
const authRoutes = require('./auth');
const postRoutes = require('./post');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerOptions = require('../docs/swagger');

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

const router = express.Router();

const swaggerDocs = swaggerJsDoc(swaggerOptions);


router.use('/api-docs/v1', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    customCss:
        '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl: CSS_URL,
}));

router.use('/api/auth', authRoutes);

router.use('/api/post', checkAuth, postRoutes);

module.exports = router;
