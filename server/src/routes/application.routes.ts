import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createApplication,
  listApplications,
  updateApplicationStatus,
} from "../controllers/application.controllers.js";

const router = express.Router();

router.post("/", authMiddleware(["tenant"]), createApplication);
router.put("/:id/status", authMiddleware(["manager"]), updateApplicationStatus);
router.get("/", authMiddleware(["manager", "tenant"]), listApplications);

export default router;
