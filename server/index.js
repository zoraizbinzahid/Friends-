import express from "express";
import bodyparser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { verifyToken } from "./middleWare/auth.js";
import { createPost } from "./controllers/posts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ poslicy: "corss-origin" }));
app.use(morgan("common"));
app.use(bodyparser.json({ limit: "30mb", extended: true }));
app.use(bodyparser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// FILE STORAGE

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cd(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cd(null, file.originalname);
  },
});
const upload = multer({ storage });

// ROUTES FOR FILES
app.use("auth/register", upload.single("Picture"), register);
app.use("/posts", verifyToken, upload.single("Picture"), createPost);

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
// DATABASE CONNECTION
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.DB_URL, {})
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((err) => console.log(`${err} NOT CONNECTED`));
