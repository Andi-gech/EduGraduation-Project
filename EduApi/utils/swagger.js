// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0", // Specify the version of the OpenAPI specification
    info: {
      title: "DEC API", // Title of your API
      version: "1.0.0", // Version of your API
      description: "API documentation dec api ",
    },
    servers: [
      {
        url: "https://eduapi.senaycreatives.com",
      },
    ],
    components: {
      securitySchemes: {
        tokenAuth: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: "JWT token for authentication (without 'Bearer')",
        },
      },
    },
  },
  apis: ["./Routes/*.js"], // Path to the API routes or JS files containing JSDoc comments
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
  // Serve Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
