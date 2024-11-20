import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      res.status(400).json({ message: "The user does not exist" });
      return;
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user.pwdHash);

    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    generateToken(user.id.toString(), res);
    res.status(200).json({
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      role: user.role,
    });
  } catch (error: any) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password, passwordConfirm, nickname } = req.body;
  try {
    if (!username || !password || !passwordConfirm || !nickname) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (password !== passwordConfirm) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      res.status(400).json({ error: "Username already exists" });
      return;
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username,
        pwdHash: hashedPassword,
        nickname,
      },
    });
    if (newUser) {
      generateToken(newUser.id.toString(), res);
      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: newUser.id,
          username: newUser.username,
          nickname: newUser.nickname,
        },
      });
    } else {
      res.status(400).json({ message: "Failed to register user" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error: any) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      role: user.role,
    });
  } catch (error: any) {
    console.log("Error in getMe controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
