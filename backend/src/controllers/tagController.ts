import { Request, Response } from "express";
import prisma from "../db/prisma.js";

// Delete a tag
export const deleteTag = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.tagsOnPhotos.deleteMany({ where: { tagId: Number(id) } });

    await prisma.tag.delete({
      where: { id: Number(id) },
    });

    res.status(204).end();
  } catch (error) {
    console.error("Error deleting tag:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all tags
export const getTags = async (_req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany();

    res.status(200).json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Search for tags
export const searchTags = async (req: Request, res: Response) => {
  const { name } = req.query;

  try {
    let tags: { content: string }[] = [];

    if (typeof name === "string") {
      if (name.length < 3) {
        tags = await prisma.tag.findMany({
          where: {
            content: {
              startsWith: name,
            },
          },
        });
      } else {
        tags = await prisma.tag.findMany({
          where: {
            content: {
              contains: name,
            },
          },
        });
      }
    }

    res.status(200).json(tags);
  } catch (error) {
    console.error("Error searching tags:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}