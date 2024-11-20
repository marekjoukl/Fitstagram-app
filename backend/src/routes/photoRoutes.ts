import express from "express";
import {
  createPhoto,
  getPhotos,
  getPhotoById,
  updatePhoto,
  deletePhoto,
} from "../controllers/photoController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// Route to create a new photo (post)
router.post("/", protectRoute, createPhoto);

// Route to get all photos
router.get("/", getPhotos);

// Route to get a single photo by ID
// @ts-ignore
router.get("/:id", getPhotoById);

// Route to update a photo
// @ts-ignore
router.put("/:id", protectRoute, updatePhoto);

// Route to delete a photo
// @ts-ignore
router.delete("/:id", protectRoute, deletePhoto);

export default router;
