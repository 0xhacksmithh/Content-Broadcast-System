import express from "express";
import {
  uploadContent,
  getMyContent,
} from "../controllers/content.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  allowRoles("teacher"),
  upload.single("file"),
  uploadContent,
);

router.get("/my", authMiddleware, allowRoles("teacher"), getMyContent);

export default router;
