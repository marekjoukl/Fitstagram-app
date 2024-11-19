import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const login = async (req: Request, res: Response) => {};
export const register = async (req: Request, res: Response) => {
  const { username, password, passwordConfirm, nickname } = req.body;
  try {
    if (!username || !password || !passwordConfirm || !nickname) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
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
      res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    } else {
      res.status(400).json({ message: "Failed to register user" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = async (req: Request, res: Response) => {};
