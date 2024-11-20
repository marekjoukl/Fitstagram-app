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
        uploader: { select: { username: true } },
      },
      orderBy: { date: "desc" },
    });
    res.status(200).json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a single photo by ID
export const getPhotoById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const photo = await prisma.photo.findUnique({
      where: { id: Number(id) },
      include: {
        uploader: { select: { username: true } },
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
