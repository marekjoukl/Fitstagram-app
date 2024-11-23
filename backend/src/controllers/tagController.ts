import { Request, Response } from "express";
import prisma from "../db/prisma.js";
import { Role } from "@prisma/client";

// Delete a tag
export const deleteTag = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.tag.delete({
      where: { id: Number(id) },
    });

    res.status(204).end();
  } catch (error) {
    console.error("Error deleting tag:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};