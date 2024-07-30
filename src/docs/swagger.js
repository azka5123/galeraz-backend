const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['../routes/index.js'];

const doc = {
  openapi: '3.0.0',
  info: {
    title: 'Galeraz API',
    description: 'API documentation',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'https://express-galeraz-backend.vercel.app/',
    },
  ],
  components: {
    schemas: {},
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Operations related to authentication',
    },
    {
      name: 'Posts',
      description: 'Operations related to post management',
    },
  ],
  paths: {},
};

swaggerAutogen(outputFile, endpointsFiles, doc);
