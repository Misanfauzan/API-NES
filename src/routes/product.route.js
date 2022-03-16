const express = require("express");

const router = express.Router();

const {
  addProduct,
  updateProduct,
  removeProduct,
  getProducts,
  getProduct,
} = require("../controller/product.controller");

const { auth } = require("../middleware");
const { uploadImage } = require("../services/uploadImage");

router.post("/add-product", auth, uploadImage("image"), addProduct);
router.patch("/update-product/:id", auth, uploadImage("image"), updateProduct);
router.delete("/delete-product/:id", auth, removeProduct);

router.get("/products", auth, getProducts);
router.get("/product/:id", auth, getProduct);

module.exports = router;
