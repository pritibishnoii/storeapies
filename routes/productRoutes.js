import express from "express";
import {
  addProduct,
  addProductReview,
  fetchNewProducts,
  fetchProductById,
  fetchProductsBykeyword,
  fetchTopProducts,
  filterProducts,
  getAllProducts,
  removeProduct,
  updateProduct,
} from "../controllers/productController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import upload from "../utils/multerFileUpload.js";
import checkId from "../utils/checkId.js";
const router = express.Router();

router
  .route( "/" )
  .post(
    authenticate, // User login hona chahiye
    authorizeAdmin, // Admin hona chahiye
    upload.single( "image" ), // Agar file upload hai to
    addProduct
  )
  .get( fetchProductsBykeyword );

router.route( "/allproducts" ).get( getAllProducts );
router.route( "/:id/reviews" ).post( authenticate, checkId, addProductReview );

router.get( "/top", fetchTopProducts );
router.get( "/new", fetchNewProducts );

router
  .route( "/:id" )
  .put( authenticate, authorizeAdmin, upload.single( "image" ), updateProduct )
  .delete( authenticate, authorizeAdmin, removeProduct )
  .get( fetchProductById );

router.route( "/filtered-products" ).post( filterProducts );
export default router;
