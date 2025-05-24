const express = require("express");
const router = express.Router();
const { Category } = require("../Models/categoriesModel.js");

router.get("/", async (req, res) => {
  const categoryPresent = await Category.find();
  if (categoryPresent) {
    res.status(200).json({
      message: "Categories fetched successfully",
      categories: categoryPresent,
    });
  } else {
    res.status(500).json({
      message: "Error fetching categories",
      error: error,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });
    console.log(category);
    const NewCategroy = await category.save();

    res.status(201).json({
      message: "Category created successfully",
      category: NewCategroy,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating category",
      error: error,
    });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updatedCategory =  await Category.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    },
    { new: true }
  );
  if (updatedCategory) {
    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } else {
    res.status(500).json({
      message: "Error updating category",
      error: error,
    });
  }
});
  
  




router.delete("/:id", (req, res) => {
  const id = req.params.id;
  Category.findByIdAndDelete(id)
    .then(() => {
      res.status(200).json({
        message: "Category deleted successfully",
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error deleting category",
        error: error,
      });
    });
});

module.exports = router;
