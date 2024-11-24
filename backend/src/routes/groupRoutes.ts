import express from 'express';
import {
  createGroup,
  addUserToGroup,
  removeUserFromGroup,
  searchGroups,
  getGroupById,
  addPhotoToGroup,
  removePhotoFromGroup,
  getJoinRequests, // Import the new controller function
  approveJoinRequest, // Import the new controller function
  getAllGroups, // Import the new controller function
  deleteGroup, // Import the new controller function
  leaveGroup, // Import the new controller function
  refuseJoinRequest, // Import the new controller function
  isUserMember, // Import the new controller function
} from '../controllers/groupController.js';
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post('/create', createGroup);
router.post('/add-user', addUserToGroup);
router.post('/remove-user', removeUserFromGroup);
router.get('/search', searchGroups);
router.get('/:groupId', getGroupById);
router.post('/add-photo', addPhotoToGroup);
router.post('/remove-photo', removePhotoFromGroup);
router.get('/:groupId/join-requests', protectRoute, getJoinRequests); // Add the new route
router.post('/approve-join-request', protectRoute, approveJoinRequest); // Add the new route
router.get('/', getAllGroups); // Add the new route
router.delete('/:groupId', protectRoute, deleteGroup); // Add the new route
router.post('/leave-group', protectRoute, leaveGroup); // Add the new route
router.post('/refuse-join-request', protectRoute, refuseJoinRequest); // Add the new route
router.get('/:groupId/is-member/:userId', protectRoute, isUserMember); // Add the new route

export default router;