import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { updateProfile } from "../controllers/authController.js";
import { getUserById, searchUsers, getUserGroups } from "../controllers/userController.js";
const router = express.Router();

router.put("/me", protectRoute, updateProfile);

router.get("/search", searchUsers);

// @ts-ignore
router.get("/:userId", getUserById);

router.get("/:userId/groups", protectRoute, getUserGroups);

export default router;
