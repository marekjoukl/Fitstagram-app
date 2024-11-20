import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import photoRoutes from "./routes/photoRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`);
});
