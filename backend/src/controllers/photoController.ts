import { Request, Response } from "express";
import prisma from "../db/prisma.js";

// Create a new photo
export const createPhoto = async (req: Request, res: Response) => {
  const { name, description, url } = req.body;
  const uploaderId = req.user.id;

  try {
    const photo = await prisma.photo.create({
      data: {
        name,
        description,
        url,
        uploaderId,
      },
    });
    res.status(201).json(photo);
  } catch (error) {
    console.error("Error creating photo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all photos
export const getPhotos = async (_req: Request, res: Response) => {
  try {
    const photos = await prisma.photo.findMany({
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
  const { name, description, url } = req.body;

  try {
    const photo = await prisma.photo.findUnique({ where: { id: Number(id) } });

    if (!photo || photo.uploaderId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this photo" });
    }

    const updatedPhoto = await prisma.photo.update({
      where: { id: Number(id) },
      data: { name, description, url },
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
