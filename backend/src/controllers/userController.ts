import { Request, Response } from "express";
import prisma from "../db/prisma.js";

export const searchUsers = async (req: Request, res: Response) => {
  const { nickname } = req.query;

  try {
    let users: { nickname: string }[];

    if (typeof nickname === "string") {
      if (nickname.length < 3) {
        // Fetch entries that start with the substring
        users = await prisma.user.findMany({
          where: {
            nickname: {
              startsWith: nickname,
            },
          },
        });
      } else {
        // Fetch entries that contain the substring
        users = await prisma.user.findMany({
          where: {
            nickname: {
              contains: nickname,
            },
          },
        });
      }
    } else {
      users = [];
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
      include: {
        photos: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserGroups = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const groups = await prisma.group.findMany({
      where: {
        users: {
          some: {
            userId: parseInt(userId, 10),
          },
        },
      },
    });

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error fetching user groups:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const requestToJoinGroup = async (req: Request, res: Response) => {
  const { groupId, userId } = req.body;

  try {
    await prisma.usersWaitingToJoinGroup.create({
      data: {
        groupId,
        userId,
      },
    });

    res.status(201).json({ message: "Request to join group sent successfully" });
  } catch (error) {
    console.error("Error requesting to join group:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
