const express = require("express");
const errorHandler = require("./src/middlewares/errorHandler");
const conncectDB = require("./src/config/db");
const dotenv = require("dotenv").config();
const cors = require("cors");

// Connect to database
conncectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/workspaces", require("./src/routes/workspaceRoutes"));
app.use("/api/tasks", require("./src/routes/taskRoutes"));

// health check
app.get("/", (req, res) => {
  res.send("Task Manager API running");
});
// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
