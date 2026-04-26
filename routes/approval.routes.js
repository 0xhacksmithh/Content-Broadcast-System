import express from "express";
import {
  getPendingContent,
  approveContent,
  rejectContent,
  getContent,
} from "../controllers/approval.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/pending",
  authMiddleware,
  allowRoles("principal"),
  getPendingContent,
);

router.get("/content", authMiddleware, allowRoles("principal"), getContent);

router.post(
  "/:id/approve",
  authMiddleware,
  allowRoles("principal"),
  approveContent,
);

router.post(
  "/:id/reject",
  authMiddleware,
  allowRoles("principal"),
  rejectContent,
);

export default router;
