import express from 'express';
import {
  createGroup,
  addUserToGroup,
  removeUserFromGroup,
  searchGroups,
  getGroupById,
} from '../controllers/groupController.js';

const router = express.Router();

router.post('/create', createGroup);
router.post('/add-user', addUserToGroup);
router.post('/remove-user', removeUserFromGroup);
router.get('/search', searchGroups);
router.get('/:groupId', getGroupById);

export default router;