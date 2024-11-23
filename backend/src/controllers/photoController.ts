import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import { Role } from "@prisma/client";

// Create a new photo
export const createPhoto = async (req: Request, res: Response) => {
  const { name, description, url, visibleTo, tags } = req.body;
  const uploaderId = req.user.id;

  try {
    const photo = await prisma.photo.create({
      data: {
        name,
        description,
        url,
        uploaderId,
        visibleTo: {
          create: visibleTo.map((userId: number) => ({
            userId,
          })),
        },
      },
      include: {
        visibleTo: true,
      },
    });

    // Handle tags
    for (const tagName of tags) {
      let tag = await prisma.tag.findFirst({ where: { content: tagName } });
      if (!tag) {
        tag = await prisma.tag.create({ data: { content: tagName } });
      }
      await prisma.tagsOnPhotos.create({
        data: {
          photoId: photo.id,
          tagId: tag.id,
        },
      });
    }

    const photoWithTags = await prisma.photo.findUnique({
      where: { id: photo.id },
      include: { tags: true },
    });

    res.status(201).json(photoWithTags);
  } catch (error) {
    console.error("Error creating photo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all photos
export const getPhotos = async (req: Request, res: Response) => {
  const { userId, role } = req.query;

  try {
    const photos = await prisma.photo.findMany({
      where:
        // If userId is not provided, return public photos
        !userId
        ? { visibleTo: { none: {} } }

        // If user is admin or modeeturn all photos
        : role === Role.ADMIN || role === Role.MODERATOR
        ? {}
        
        // If userId is provided, return photos uploaded by the user, photos visible to the user, and public photos
        : {
            OR: [
              { uploaderId: Number(userId) },
              { visibleTo: { some: { userId: Number(userId) } } },
              { visibleTo: { none: {} } },
            ],
          },
      include: {
        uploader: { select: { nickname: true, id: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { date: "desc" },
    });

    const photosWithCommentCount = photos.map((photo) => ({
      ...photo,
      numOfComments: photo._count.comments, // Attach comment count
    }));

    res.status(200).json(photosWithCommentCount);
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPhotosById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const photos = await prisma.photo.findMany({
      where: { uploaderId: Number(id) },
      include: {
        uploader: { select: { nickname: true, id: true } },
      },
    });

    if (!photos) {
      return res.status(404).json({ error: "Photo not found" });
    }

    res.status(200).json(photos);
  } catch (error) {
    console.error("Error fetching photo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPhotoById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const photo = await prisma.photo.findUnique({
      where: { id: Number(id) },
      include: {
        uploader: { select: { nickname: true } },
        visibleTo: { select: { userId: true } }
      },
    });

    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }

    res.status(200).json(photo);
  } catch (error) {
    console.error("Error fetching photo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a photo
export const updatePhoto = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, url, visibleTo } = req.body;

  try {
    const photo = await prisma.photo.findUnique({ where: { id: Number(id) } });

    if (!photo || photo.uploaderId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this photo" });
    }

    const updatedPhoto = await prisma.photo.update({
      where: { id: Number(id) },
      data: { name, description, url, visibleTo},
      include: { visibleTo: true },
    });

    res.status(200).json(updatedPhoto);
  } catch (error) {
    console.error("Error updating photo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a photo
export const deletePhoto = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const photo = await prisma.photo.findUnique({ where: { id: Number(id) } });

    if (!photo || photo.uploaderId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this photo" });
    }

    await prisma.tagsOnPhotos.deleteMany({ where: { photoId: Number(id) } });

    // If a tag is not associated with any photo, delete it
    await prisma.tag.deleteMany({
      where: {
        photos: { none: {} },
      },
    });
    await prisma.likes.deleteMany({ where: { photoId: Number(id) } });
    await prisma.comment.deleteMany({ where: { photoId: Number(id) } });

    await prisma.photo.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Photo deleted successfully" });
  } catch (error) {
    console.error("Error deleting photo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const likePhoto = async (req: Request, res: Response) => {
  const { photoId } = req.params;
  const userId = req.user.id;

  try {
    // Check if the user has already liked the photo
    const existingLike = await prisma.likes.findUnique({
      where: {
        userId_photoId: {
          userId,
          photoId: Number(photoId),
        },
      },
    });

    if (existingLike) {
      return res.status(400).json({ error: "Photo already liked" });
    }

    // Add a like
    await prisma.likes.create({
      data: {
        userId,
        photoId: Number(photoId),
      },
    });

    // Increment the number of likes
    await prisma.photo.update({
      where: { id: Number(photoId) },
      data: { numOfLikes: { increment: 1 } },
    });

    res.status(201).json({ message: "Photo liked successfully" });
  } catch (error) {
    console.error("Error liking photo:", error);
    res.status(500).json({ error: "Failed to like photo" });
  }
};

export const unlikePhoto = async (req: Request, res: Response) => {
  const { photoId } = req.params;
  const userId = req.user.id;

  try {
    // Check if the like exists
    const existingLike = await prisma.likes.findUnique({
      where: {
        userId_photoId: {
          userId,
          photoId: Number(photoId),
        },
      },
    });

    if (!existingLike) {
      return res.status(400).json({ error: "Photo not liked" });
    }

    // Remove the like
    await prisma.likes.delete({
      where: {
        userId_photoId: {
          userId,
          photoId: Number(photoId),
        },
      },
    });

    // Decrement the number of likes
    await prisma.photo.update({
      where: { id: Number(photoId) },
      data: { numOfLikes: { decrement: 1 } },
    });

    res.status(200).json({ message: "Photo unliked successfully" });
  } catch (error) {
    console.error("Error unliking photo:", error);
    res.status(500).json({ error: "Failed to unlike photo" });
  }
};

export const isPhotoLikedByUser = async (req: Request, res: Response) => {
  const { photoId } = req.params;
  const userId = req.user.id;

  try {
    const like = await prisma.likes.findUnique({
      where: {
        userId_photoId: {
          userId,
          photoId: Number(photoId),
        },
      },
    });

    res.status(200).json({ liked: !!like });
  } catch (error) {
    console.error("Error checking liked state:", error);
    res.status(500).json({ error: "Failed to fetch liked state" });
  }
};
