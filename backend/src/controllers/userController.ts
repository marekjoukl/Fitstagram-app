import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import { Role } from "@prisma/client";

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
  const loggedInUserId = req.user?.id; // Logged-in user's ID from middleware
  const loggedInUserRole = req.user?.role; // Logged-in user's role from middleware

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
      include: {
        photos: {
          where:
            loggedInUserRole === Role.ADMIN ||
            loggedInUserRole === Role.MODERATOR
              ? {} // Admins and moderators see all photos
              : {
                  OR: [
                    { uploaderId: Number(loggedInUserId) }, // Photos uploaded by the profile owner
                    { visibleTo: { some: { userId: Number(loggedInUserId) } } }, // Photos explicitly visible to the logged-in user
                    { visibleTo: { none: {} } }, // Public photos
                  ],
                },
          include: {
            uploader: { select: { nickname: true, id: true } },
            _count: { select: { comments: true } },
            visibleTo: {
              select: { user: { select: { id: true, nickname: true } } },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Format the response to include the correct structure
    const userWithPhotos = {
      ...user,
      photos: user.photos.map((photo) => ({
        ...photo,
        numOfComments: photo._count.comments, // Attach the number of comments
      })),
    };

    res.status(200).json(userWithPhotos);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

    res
      .status(201)
      .json({ message: "Request to join group sent successfully" });
  } catch (error) {
    console.error("Error requesting to join group:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
