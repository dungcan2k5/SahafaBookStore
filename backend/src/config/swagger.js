const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sahafa Bookstore API',
      version: '1.0.0',
      description: 'Tài liệu API cho dự án Sahafa Bookstore',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }], // Áp dụng bảo mật Bearer toàn cục (hoặc tùy route)
  },
  // Quan trọng: Chỉ định nơi chứa file routes để nó quét comment
  apis: ['./src/routes/*.js'], 
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };