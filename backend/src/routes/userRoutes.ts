import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { updateProfile } from "../controllers/authController.js";
const router = express.Router();

router.put("/me", protectRoute, updateProfile);

export default router;
