const express = require("express");

const router = express.Router();

const { register, login } = require("../controller/auth.controller");

const { isUserExist } = require("../middleware");

router.post("/register", isUserExist, register);
router.post("/login", login);

module.exports = router;
