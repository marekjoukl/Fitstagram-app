import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import photoRoutes from "./routes/photoRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import dotenv from "dotenv";
import path from "path";
dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(cookieParser());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);

if (process.env.NODE_ENV !== "development") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}
app.listen(3000, () => {
  console.log(`Example app listening on port 3000`);
});
