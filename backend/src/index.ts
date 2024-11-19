import express from "express";
import authRoutes from "./routes/authRoutes.js";
import photoRoutes from "./routes/photoRoutes.js";
import userRoutes from "./routes/userRoutes.js";
const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`);
});
