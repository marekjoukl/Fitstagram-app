import { Request, Response } from 'express';
import prisma from '../db/prisma.js';

export const createGroup = async (req: Request, res: Response) => {
  const { name, managerId, userIds } = req.body;
  console.log('userIds:', userIds);
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
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const addUserToGroup = async (req: Request, res: Response) => {
  const { groupId, userId } = req.body;

  try {
    const userInGroup = await prisma.usersInGroups.create({
      data: {
        groupId,
        userId,
      },
    });

    res.status(201).json(userInGroup);
  } catch (error) {
    console.error('Error adding user to group:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
    console.error('Error removing user from group:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const searchGroups = async (req: Request, res: Response) => {
    const { name } = req.query;
  
    try {
      const groups = await prisma.group.findMany({
        where: {
          name: {
            contains: name as string,
          },
        },
      });
  
      res.status(200).json(groups);
    } catch (error) {
      console.error('Error searching groups:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

// export const getGroupDetails = async (req: Request, res: Response) => {
//   const { groupId } = req.params;

//   try {
//     const group = await prisma.group.findUnique({
//       where: { id: parseInt(groupId) },
//       include: {
//         users: {
//           include: {
//             user: true,
//           },
//         },
//         photos: true,
//       },
//     });

//     if (!group) {
//       return res.status(404).json({ error: 'Group not found' });
//     }

//     res.status(200).json(group);
//   } catch (error) {
//     console.error('Error fetching group details:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };