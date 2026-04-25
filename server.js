import express from "express";
import dotenv from "dotenv";
import pool from "./database/db.js";
import authRoutes from "./routes/auth.routes.js";
import contentRoutes from "./routes/content.routes.js";

const app = express();
dotenv.config();

const port = process.env.PORT || 8000;

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/auth", authRoutes);
app.use("/content", contentRoutes);

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
