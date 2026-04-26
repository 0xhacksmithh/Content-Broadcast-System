import express from "express";
import { getLiveAssignment } from "../controllers/assignment.controller.js";

const router = express.Router();

router.get("/live/:teacherId", getLiveAssignment);

export default router;
