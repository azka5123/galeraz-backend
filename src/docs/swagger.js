const swaggerOptions = {
  swaggerDefinition: {
      openapi: '3.0.0',
      info: {
          title: "Api Galeraz",
          version: "1.0.0"
      },
      servers: [
          {
              url: "https://express-galeraz-backend.vercel.app",
              description: "Live server"
          },
          {
              url: "http://localhost:3000",
              description: "Local Server"
          }
      ],
      components: {
          securitySchemes: {
              bearerAuth: {
                  type: 'http',
                  scheme: 'bearer',
                  bearerFormat: 'JWT'
              }
          }
      },
      security: [{
          bearerAuth: []
      }]
  },
  apis: ['./src/docs/swagger/*.js']
};

module.exports = swaggerOptions