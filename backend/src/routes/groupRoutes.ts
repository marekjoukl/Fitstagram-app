import express from 'express';
import {
  createGroup,
  addUserToGroup,
  removeUserFromGroup,
  searchGroups
} from '../controllers/groupController.js';

const router = express.Router();

router.post('/create', createGroup);
router.post('/addUser', addUserToGroup);
router.post('/removeUser', removeUserFromGroup);
router.get('/search', searchGroups);

export default router;