import express from 'express';
import {
  createGroup,
  addUserToGroup,
  removeUserFromGroup,
  searchGroups,
  getGroupById,
  addPhotoToGroup,
  removePhotoFromGroup, // Import the new controller function
} from '../controllers/groupController.js';

const router = express.Router();

router.post('/create', createGroup);
router.post('/add-user', addUserToGroup);
router.post('/remove-user', removeUserFromGroup);
router.get('/search', searchGroups);
router.get('/:groupId', getGroupById);
router.post('/add-photo', addPhotoToGroup);
router.post('/remove-photo', removePhotoFromGroup); // Add the new route

export default router;