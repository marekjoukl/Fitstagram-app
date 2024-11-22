import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { updateProfile } from "../controllers/authController.js";
import { getUserById, searchUsers } from "../controllers/userController.js";
const router = express.Router();

router.put("/me", protectRoute, updateProfile);

router.get("/search", searchUsers);

// @ts-ignore
router.get("/:userId", getUserById);

export default router;
