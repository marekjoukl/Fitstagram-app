import { Request, Response } from "express";
import prisma from "../db/prisma.js"; // Adjust the path to your Prisma client

// Fetch comments for a specific photo
export const getComments = async (req: Request, res: Response) => {
  const { photoId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { photoId: Number(photoId) },
      include: {
        author: { select: { nickname: true, image: true, id: true } },
      },
      orderBy: { id: "desc" },
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

// Add a comment to a photo
export const addComment = async (req: Request, res: Response) => {
  const { photoId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  if (!content || !userId) {
    return res
      .status(400)
      .json({ error: "Content and user authentication are required" });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        photoId: Number(photoId),
        authorId: userId,
      },
      include: {
        author: { select: { nickname: true, image: true, id: true } },
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

// Delete a comment
export const deleteComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: Number(commentId) },
    });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    await prisma.comment.delete({ where: { id: Number(commentId) } });
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ error: "Failed to delete comment" });
  }
};
