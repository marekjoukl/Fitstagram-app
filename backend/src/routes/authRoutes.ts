import express from "express";
import { Request, Response } from "express";
import {
  login,
  register,
  logout,
  getMe,
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

export default router;
