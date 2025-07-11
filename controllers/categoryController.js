import asyncHandler from "../middlewares/asyncHandler.js";
import Category from "../models/categoryModel.js";
export const createCategory = asyncHandler(async (req, res) => {
  try {
    // console.log("Request Body:", req.body);
    // console.log("Request Headers:", req.headers);
    const { name } = req.body;
    if (!name) {
      return res.json({ error: "Name is required" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.json({
        error: "Already exists",
      });
    }

    const category = await new Category({ name }).save();
    return res.status(200).json({
      message: `${category.name} created.`,
      category,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      message: "Internal server error",
      success: false,
    });
  }
});

export const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: categoryId },
      { name }, // second argument is the projection (fields to return): { name } (optional)
      { new: true } //{ new: true } is used with findOneAndUpdate.  return only updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({
      message: "Category updated successfully 👻",
      updatedCategory,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || "Internal server error ",
    });
  }
});

export const listCategory = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({});
    // console.log(categories);
    if (!categories)
      return res.json({
        message: "category not exists create first 🙅‍♂️",
      });

    return res.status(200).json({
      message: "categories fetched successfully",
      success: true,
      count: categories.length,
      category: categories,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error while fetching categories...........",
      success: false,
    });
  }
});

export const removeCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) return res.json({ message: "Category  Not Found 🙅" });
    return res.json({
      message: `${category.name} removed successfully`,
      category,
    });
  } catch (error) {
    return res.json({
      error: error.message || "Internal server error",
    });
  }
});

// to get specific category
export const readCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    if (!category) return res.json({ messsage: "Category Not Found🙅" });
    return res.json({
      message: `${category.name} Fetched successfully`,
      category,
    });
  } catch (error) {
    return res.json({
      error: error.message || "Internal server error",
    });
  }
});
