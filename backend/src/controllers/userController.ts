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
  const loggedInUserId = req.user?.id; // Logged-in user's ID from middleware
  const loggedInUserRole = req.user?.role; // Logged-in user's role from middleware

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
      include: {
        photos: {
          where:
            loggedInUserRole === "ADMIN" || loggedInUserRole === "MODERATOR"
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
            tags: { select: { tag: { select: { content: true } } } },
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
      photos: user.photos.map((photo: any) => ({
        ...photo,
        numOfComments: photo._count.comments, // Attach the number of comments
        tags: photo.tags.map((tag: any) => tag.tag.content), // Extract tag content
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

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    if (req.user?.role !== "ADMIN") {
      res.status(403).json({ error: "Not authorized to delete user" });
      return;
    }
    const groups = await prisma.group.findMany({ where: { managerId: parseInt(userId, 10) } });
    for (const group of groups) {
      await prisma.photosInGroups.deleteMany({ where: { groupId: group.id } });
      await prisma.usersInGroups.deleteMany({ where: { groupId: group.id } });
      await prisma.usersWaitingToJoinGroup.deleteMany({ where: { groupId: group.id } });
      await prisma.group.delete({ where: { id: group.id } });
    }
    
    await prisma.usersWaitingToJoinGroup.deleteMany({ where: { userId: parseInt(userId, 10) } });
    await prisma.usersInGroups.deleteMany({ where: { userId: parseInt(userId, 10) } });

    const photos = await prisma.photo.findMany({ where: { uploaderId: parseInt(userId, 10) } });

    for (const photo of photos) {
      await prisma.tagsOnPhotos.deleteMany({ where: { photoId: Number(photo.id) } });

      // If a tag is not associated with any photo, delete it
      await prisma.tag.deleteMany({ where: { photos: { none: {} } } });
      await prisma.photosInGroups.deleteMany({ where: { photoId: Number(photo.id) } });
      await prisma.likes.deleteMany({ where: { photoId: Number(photo.id) } });
      await prisma.comment.deleteMany({ where: { photoId: Number(photo.id) } });
      await prisma.usersWhoCanSeePhotos.deleteMany({ where: { photoId: Number(photo.id) } });

      await prisma.photo.delete({ where: { id: photo.id } });
    }
    await prisma.usersWhoCanSeePhotos.deleteMany({ where: { userId: parseInt(userId, 10) } });
    await prisma.likes.deleteMany({ where: { userId: parseInt(userId, 10) } });
    await prisma.comment.deleteMany({ where: { authorId: parseInt(userId, 10) } });
    
    await prisma.user.delete({ where: { id: parseInt(userId, 10) } });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" })
  }
};
    
