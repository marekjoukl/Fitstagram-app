import express from "express";
import { deleteTag, getTags, searchTags } from "../controllers/tagController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// Route to delete a tag
router.delete("/:id", protectRoute, deleteTag);

// Route to get all tags
router.get("/", getTags);

// Route to search for tags
router.get("/search", searchTags);

export default router;