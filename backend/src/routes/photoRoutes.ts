import express from "express";
import {
  createPhoto,
  getPhotos,
  getPhotosById,
  updatePhoto,
  deletePhoto,
  getPhotoById,
} from "../controllers/photoController.js";
import protectRoute from "../middleware/protectRoute.js";

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

export default router;
