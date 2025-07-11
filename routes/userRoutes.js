import express from "express";
import {
  deleteUser,
  getAllUsers,
  getCurrentUserProfile,
  getuserById,
  login,
  logout,
  register,
  updateCurrentUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

router
  .route("/")
  .post(register) // for   register    user /admin
  .get(authenticate, authorizeAdmin, getAllUsers); // to get all users  only admin can have access

router.post("/auth", login); //for login
router.post("/logout", logout); // for logout

// for current logedin user  who can see and update his/her profile
router
  .route("/profile")
  .all(authenticate)
  .get(getCurrentUserProfile)
  .put(updateCurrentUserProfile);
// ADMIN ROUTES 👇 // admin can have access and change
router
  .route("/:id")
  .get(authenticate, authorizeAdmin, getuserById)
  .put(authenticate, authorizeAdmin, updateUserProfile)
  .delete(authenticate, authorizeAdmin, deleteUser);

export default router;
