import { Request, Response } from 'express';
import prisma from '../db/prisma.js';

export const searchUsers = async (req: Request, res: Response) => {
  const { nickname } = req.query;

  try {
    let users: { nickname: string }[];

    if (typeof nickname === 'string') {
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
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};