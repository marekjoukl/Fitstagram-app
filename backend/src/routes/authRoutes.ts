import express from "express";
import { login, register, logout } from "../controllers/authController.js";

const router = express.Router();

// Route to register a new user
router.post("/register", register);

// Route to log in a user
router.post("/login", login);

// Route to log out a user
router.post("/logout", logout);

export default router;
