const express = require("express");

const router = express.Router();

const { getUser } = require("../controller/profile.controller");

const { auth } = require("../middleware");

router.get("/user", auth, getUser);

module.exports = router;
