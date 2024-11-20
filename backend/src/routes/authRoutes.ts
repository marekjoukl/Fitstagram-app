import express from "express";
import { Request, Response } from "express";
import {
  login,
  register,
  logout,
  getMe,
  updateProfile,
} from "../controllers/authController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// Route to register a new user
router.post("/register", register);

// Route to log in a user
router.post("/login", login);

// Route to log out a user
router.post("/logout", logout);

router.get("/me", protectRoute, getMe);

router.put("/me", protectRoute, updateProfile);

export default router;
