const express = require("express");

const router = express.Router();

const {
  getCategories,
  addCategory,
} = require("../controller/category.controller");

const { auth } = require("../middleware");

router.post("/add-category", auth, addCategory);
router.get("/categories", auth, getCategories);

module.exports = router;
