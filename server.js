import express from "express";
import { port } from "./config/index.js";

import pool from "./database/db.js";

import authRoutes from "./routes/auth.routes.js";
import contentRoutes from "./routes/content.routes.js";
import approvalRoutes from "./routes/approval.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";

const app = express();

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/auth", authRoutes);
app.use("/content", contentRoutes);
app.use("/approval", approvalRoutes);
app.use("/assignment", assignmentRoutes);

const startServer = async () => {
  try {
    await pool.execute("SELECT 1");
    console.log("Database Connected ...");

    app.listen(port, () => {
      console.log(`Server Running On Port ${port}`);
    });
  } catch (error) {
    console.log("Error :: ", error.message);
    process.exit(1);
  }
};

startServer();
