import express from "express";
import {
  createPhoto,
  getPhotos,
  getPhotosById,
  updatePhoto,
  deletePhoto,
  getPhotoById,
  likePhoto,
  unlikePhoto,
  isPhotoLikedByUser,
} from "../controllers/photoController.js";
import protectRoute from "../middleware/protectRoute.js";
import {
  addComment,
  deleteComment,
  getComments,
} from "../controllers/commentsController.js";

const router = express.Router();

// Route to create a new photo (post)
router.post("/", protectRoute, createPhoto);

// Route to get all photos
router.get("/", getPhotos);

// Route to get photos by user ID
// @ts-ignore
router.get("/profile/:id", getPhotosById);

// @ts-ignore
router.get("/:id", getPhotoById);

// Route to update a photo
// @ts-ignore
router.put("/:id", protectRoute, updatePhoto);

// Route to delete a photo
// @ts-ignore
router.delete("/:id", protectRoute, deletePhoto);

// Route to fetch comments for a photo
router.get("/:photoId/comments", getComments);

// Route to add a comment to a photo
// @ts-ignore
router.post("/:photoId/comments", protectRoute, addComment);

// Route to delete a comment
// @ts-ignore
router.delete("/comments/:commentId", deleteComment);

// @ts-ignore
router.post("/:photoId/like", protectRoute, likePhoto);

// @ts-ignore
router.delete("/:photoId/like", protectRoute, unlikePhoto);

router.get("/:photoId/like", protectRoute, isPhotoLikedByUser);

export default router;
