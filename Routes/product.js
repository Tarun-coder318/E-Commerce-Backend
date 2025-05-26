const express = require("express");
const router = express.Router();
const { Product } = require("../Models/ProductModel.js");
const { Category } = require("../Models/categoriesModel.js");

router.get("/", async (req, res) => {
  await Product.find()
    .populate("category")
    .then((result) => {
      res.status(200).json({
        message: "Products fetched successfully",
        products: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error fetching products",
        error: error,
      });
    });
});

router.get("/get/featured", async (req, res) => {
  const featuredProducts = await Product.find({ isFeatured: true });
  const countfeaturedProducts = await Product.countDocuments({
    countInStock: { $gt: 100 },
  });

  if (featuredProducts || countfeaturedProducts) {
    res.status(200).json({
      message: "Featured products fetched successfully",
      products: featuredProducts,
      count: countfeaturedProducts,
    });
  } else {
    res.status(500).json({
      message: "Error fetching featured products",
      error: error,
    });
  }
});
router.get("/filter", async (req, res) => {
  let filter = {};

  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  const products = await Product.find(filter).populate("category");
  if (products) {
    res.status(200).json({
      message: "Products fetched successfully",
      products: products,
    });
  } else {
    res.status(500).json({
      message: "Error fetching products",
      error: error,
    });
  }
});

router.post("/", async (req, res) => {
  const categoryPresent = await Category.findById(req.body.category);
  if (!categoryPresent) {
    return res.status(400).json({
      message: "Category not found",
    });
  }

  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
    description: req.body.description,
    richdescription: req.body.richdescription,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,

    rating: req.body.rating,
    isFeatured: req.body.isFeatured,
  });
  const newProduct = await product.save();

  if (newProduct) {
    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } else {
    res.status(500).json({
      message: "Error creating product",
      error: error,
    });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const categoryPresent = await Category.findById(req.body.category);
  if (!categoryPresent) {
    return res.status(400).json({
      message: "Category not found",
    });
  }
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      image: req.body.image,
      countInStock: req.body.countInStock,
      description: req.body.description,
      richdescription: req.body.richdescription,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );
  if (updatedProduct) {
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } else {
    res.status(500).json({
      message: "Error updating product",
      error: error,
    });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const deletedProduct = await Product.findByIdAndDelete(id);
  if (deletedProduct) {
    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } else {
    res.status(500).json({
      message: "Error deleting product",
      error: error,
    });
  }
});

module.exports = router;
