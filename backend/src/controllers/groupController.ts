import { Request, Response } from "express";
import prisma from "../db/prisma.js";

export const createGroup = async (req: Request, res: Response) => {
  const { name, managerId, userIds } = req.body;
  console.log("userIds:", userIds);
  try {
    const newGroup = await prisma.group.create({
      data: {
        name,
        managerId,
        users: {
          create: userIds.map((userId: number) => ({
            userId,
          })),
        },
      },
    });

    res.status(201).json(newGroup);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addUserToGroup = async (req: Request, res: Response) => {
  const { groupId, userIds } = req.body;
  console.log("Adding users to group:", { groupId, userIds });

  try {
    const usersInGroup = await prisma.usersInGroups.createMany({
      data: userIds.map((userId: number) => ({
        groupId,
        userId,
      })),
      skipDuplicates: true,
    });

    res.status(201).json(usersInGroup);
  } catch (error) {
    console.error("Error adding users to group:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeUserFromGroup = async (req: Request, res: Response) => {
  const { groupId, userId } = req.body;

  try {
    await prisma.usersInGroups.delete({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error removing user from group:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchGroups = async (req: Request, res: Response) => {
  const { name } = req.query;

  try {
    let groups: any[];

    if (typeof name === "string") {
      if (name.length < 3) {
        // Fetch entries that start with the substring
        groups = await prisma.group.findMany({
          where: {
            name: {
              startsWith: name,
            },
          },
        });
      } else {
        // Fetch entries that contain the substring
        groups = await prisma.group.findMany({
          where: {
            name: {
              contains: name,
            },
          },
        });
      }
    } else {
      groups = [];
    }

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error searching groups:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getGroupById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { groupId } = req.params;

  try {
    const group = await prisma.group.findUnique({
      where: { id: parseInt(groupId) },
      include: {
        users: {
          include: {
            user: true,
          },
        },
        photos: {
          include: {
            photo: {
              include: {
                uploader: true,
                comments: true,
              },
            },
          },
        },
        usersToJoin: {
          // Include usersToJoin
          include: {
            user: true,
          },
        },
      },
    });

    if (!group) {
      res.status(404).json({ error: "Group not found" });
      return;
    }

    // Extract full photo details
    const photos = group.photos.map((photoInGroup: any) => photoInGroup.photo);

    res.status(200).json({ ...group, photos }); // Return the group object with full photo details
  } catch (error) {
    console.error("Error fetching group details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addPhotoToGroup = async (req: Request, res: Response) => {
  const { groupId, photoId } = req.body;

  try {
    const photoInGroup = await prisma.photosInGroups.create({
      data: {
        groupId,
        photoId,
      },
    });

    res.status(201).json(photoInGroup);
  } catch (error) {
    console.error("Error adding photo to group:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removePhotoFromGroup = async (req: Request, res: Response) => {
  const { groupId, photoId } = req.body;

  try {
    await prisma.photosInGroups.delete({
      where: {
        photoId_groupId: {
          photoId,
          groupId,
        },
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error removing photo from group:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getJoinRequests = async (req: Request, res: Response) => {
  const { groupId } = req.params;

  try {
    const joinRequests = await prisma.usersWaitingToJoinGroup.findMany({
      where: { groupId: parseInt(groupId, 10) },
      include: {
        user: true,
      },
    });

    res.status(200).json(joinRequests);
  } catch (error) {
    console.error("Error fetching join requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const approveJoinRequest = async (req: Request, res: Response) => {
  const { groupId, userId } = req.body;

  try {
    await prisma.usersInGroups.create({
      data: {
        groupId,
        userId,
      },
    });

    await prisma.usersWaitingToJoinGroup.delete({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    res.status(200).json({ message: "User added to group successfully" });
  } catch (error) {
    console.error("Error approving join request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const refuseJoinRequest = async (req: Request, res: Response) => {
  const { groupId, userId } = req.body;

  try {
    await prisma.usersWaitingToJoinGroup.delete({
      where: {
        userId_groupId: {
          userId,
          groupId: parseInt(groupId, 10),
        },
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error refusing join request:", error); // Log the error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllGroups = async (req: Request, res: Response) => {
  try {
    const groups = await prisma.group.findMany({
      include: {
        users: true, // Include users in the group
      },
    });
    console.log("groups:", groups);
    res.status(200).json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  const { groupId } = req.params;

  try {
    // Delete related records in join tables
    await prisma.photosInGroups.deleteMany({
      where: { groupId: parseInt(groupId, 10) },
    });

    await prisma.usersInGroups.deleteMany({
      where: { groupId: parseInt(groupId, 10) },
    });

    await prisma.usersWaitingToJoinGroup.deleteMany({
      where: { groupId: parseInt(groupId, 10) },
    });

    // Delete the group
    await prisma.group.delete({
      where: { id: parseInt(groupId, 10) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting group:", error); // Log the error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const leaveGroup = async (req: Request, res: Response) => {
  const { groupId, userId } = req.body;

  try {
    await prisma.usersInGroups.delete({
      where: {
        userId_groupId: {
          userId,
          groupId: parseInt(groupId, 10),
        },
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error leaving group:", error); // Log the error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const isUserMember = async (req: Request, res: Response) => {
  const { groupId, userId } = req.params;

  try {
    const userInGroup = await prisma.usersInGroups.findUnique({
      where: {
        userId_groupId: {
          userId: parseInt(userId, 10),
          groupId: parseInt(groupId, 10),
        },
      },
    });

    res.status(200).json(!!userInGroup);
  } catch (error) {
    console.error("Error checking if user is a member:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getGroupMembers = async (req: Request, res: Response) => {
  const { groupId } = req.params;

  try {
    const members = await prisma.usersInGroups.findMany({
      where: { groupId: Number(groupId) },
      include: { user: true },
    });

    res.status(200).json(members.map(member => member.user));
  } catch (error) {
    console.error("Error fetching group members:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
