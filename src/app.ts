import express, { Application } from "express";
import path from "path";
import { RequestHandler } from "express";
import cors from "cors";
import { swaggerUi, swaggerSpec } from "./swagger";
import { errorHandler } from "./middleware/errorHandler";
import helmet from "helmet";

// const messageRoutes = require("./routes/messageRoutes");
import authRoutes from "./routes/authRoutes";
import messageRoutes from "./routes/messageRoutes";
import postRoutes from "./routes/postRoutes"; 
import viewRoutes from "./routes/viewRoutes";



// const app = express();
const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//swagger routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/test-css", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../public/css/styles.css"));
});

//use for css
app.use(express.static(path.join(__dirname, "../public")));


// Set EJS as template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views")); 

app.use("/", viewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/posts", postRoutes);

const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
};

app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);
// module.exports = app;
export default app;
