// call database
import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import { cloudinaryConnect } from "./config/cloudinary.js";
const app = express();
dotenv.config();
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";

// Middleware Setup (IMPORTANT ORDER)
// Configure CORS properly
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://storeuiii.vercel.app", "https://storeapies.vercel.app"]
      : ["http://localhost:5173", "http://localhost:5000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
  exposedHeaders: ["*", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json()); // For JSON bodies
app.use(express.urlencoded({ extended: true })); // For form data
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Connecting to cloudinary
cloudinaryConnect();

app.get("/", (req, res) => {
  res.send("Hello World");
});

// // Database Connection
// connectDB(() => {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`Server is running at http://localhost:${PORT} 🎉`);
//   });
// });

// Connect to database first
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running at http://localhost:${PORT} 🎉`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

// Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

export default app;
