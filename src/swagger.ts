// const swaggerJsDoc = require("swagger-jsdoc");
import swaggerJsDoc from "swagger-jsdoc";

// const swaggerUi = require("swagger-ui-express");
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Chat App API",
      version: "1.0.0",
      description:
        "API documentation for simple chat app (login, register, users)",
    },
    servers: [{ url: "http://localhost:5000" }],
  },
  apis: ["./routes/*.ts"],   
};

const swaggerSpec = swaggerJsDoc(options);

// module.exports = { swaggerUi, swaggerSpec };
export { swaggerUi, swaggerSpec };