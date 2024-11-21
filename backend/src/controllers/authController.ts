import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { Role } from "@prisma/client";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      res.status(400).json({ error: "The user does not exist" });
      return;
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user.pwdHash);

    if (!isPasswordCorrect) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    generateToken(user.id.toString(), res);
    res.status(200).json({
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      image: user.image,
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
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    if (password !== passwordConfirm) {
      res.status(400).json({ error: "Passwords do not match" });
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

    // https://avatar-placeholder.iran.liara.run/
    const imagePlaceholder = `https://avatar.iran.liara.run/public`;

    const newUser = await prisma.user.create({
      data: {
        username,
        pwdHash: hashedPassword,
        nickname,
        image: imagePlaceholder,
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
          image: newUser.image,
        },
      });
    } else {
      res.status(400).json({ error: "Failed to register user" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
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
      image: user.image,
      description: user.description,
    });
  } catch (error: any) {
    console.log("Error in getMe controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { nickname, image, description } = req.body;
  console.log(req.body);

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        nickname,
        image,
        description,
      },
    });
    console.log(updatedUser);

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        nickname: updatedUser.nickname,
        image: updatedUser.image,
        description: updatedUser.description,
      },
    });
  } catch (error: any) {
    console.error("Error in updateProfile controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
