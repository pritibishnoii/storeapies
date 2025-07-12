import asyncHandler from "../middlewares/asyncHandler.js";
// import { productValidation } from "../utils/validation.js";
import Product from "../models/productModel.js";
import { uploadImageToCloudinary } from "../utils/uploadImage.js";
export const addProduct = asyncHandler(async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const {
      name,
      description,
      price,
      category,
      quantity,
      brand,
      reviews,
      rating,
      countInStock,
    } = req.body;

    if (!req.files || !req.files.image) {
      console.log("No files uploaded or no image file");
      return res.status(400).json({ message: "Please upload an image" });
    }

    // upload image
    const productImage = req.files.image;
    console.log("productImage---->", productImage);

    if (!process.env.FOLDER_NAME) {
      console.log("FOLDER_NAME not set in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const uploadImageResult = await uploadImageToCloudinary(
      productImage,
      process.env.FOLDER_NAME,
      1000
    );

    const image = uploadImageResult.secure_url;

    // Create product
    const product = new Product({
      name,
      description,
      price,
      image,
      category,
      quantity,
      brand,
      countInStock: countInStock || 0,
      reviews: reviews || [],
      rating: rating || 0,
    });

    await product.save();
    return res.status(200).json({
      message: `${product.name}  added `,
      data: product,
    });
  } catch (error) {
    console.error("Error in addProduct:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
});

export const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const product = await Product.find({})
      .populate("category") // get category details also
      .limit(12) // only 12 product at once
      .sort({ createAt: -1 }); // most recently  added come first

    return res.status(200).json({
      message: "product fetched successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  try {
    // First handle the file upload if present
    let imagePath;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`; // Adjust path as needed
    }

    // Then handle other form data
    const updates = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      quantity: req.body.quantity,
      brand: req.body.brand,
      countInStock: req.body.countInStock,
      ...(imagePath && { image: imagePath }), // Only add image if it exists
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});

export const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.json({ message: "product not found" });
    return res.status(200).json({
      message: `${product.name} have deleted`,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
});

export const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.json({ message: "product  not found" });

    return res.status(200).json({
      message: "product fetched successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
});

export const fetchProductsBykeyword = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6; // ek page pe 6 product dikhenge
    // Agar query mein keyword hai toh uske hisaab se search karenge, warna sab products laayenge
    const keyword = req.query.keyword
      ? {
          name: {
            // http://localhost:5000/api/products/?keyword=TV
            $regex: req.query.keyword, // Name mein keyword match ho toh
            $options: "i", // Case-insensitive search (chhote-bade akshar farq nahi karenge)
          },
        }
      : {};
    const count = Product.countDocuments({ ...keyword }); //total kitne product hai
    const products = await Product.find({ ...keyword }).limit(pageSize); //
    return res.status(200).json({
      message: "product fetched ",
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
});

export const addProductReview = asyncHandler(async (req, res) => {
  console.log(req.body);
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.json({
          message: "Product already reviewed",
        });
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
      console.log(product.rating);
      await product.save();
      res.status(201).json({
        message: "Review Added",
        product,
      });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
});

export const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ rating: -1 }).limit(5);
    return res.status(200).json({
      message: "product fetched successfully",
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
});
export const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    return res.status(200).json({
      message: "product fetched successfully",
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
});

export const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;
    // User ne jo filter select kiye hain (category aur price), woh body se nikal rahe hain

    let args = {};
    // Ek khaali object banaya, jisme filter conditions daalenge

    //  checked =category IDs
    if (checked.length > 0) args.category = checked;

    // Agar user ne koi category select ki hai (checked array khaali nahi hai), toh args mein category add kar do

    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    // Agar user ne price range select ki hai (radio array mein values hain), toh price filter add kar do
    // $gte: radio[0] => minimum price
    // $lte: radio[1] => maximum price

    const products = await Product.find(args);
    // Ab args ke hisaab se products database se la rahe hain

    res.json(products);
    // Jo products mile, unko response mein bhej rahe hain
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
    // Agar koi error aata hai toh error message bhej rahe hain
  }
});
