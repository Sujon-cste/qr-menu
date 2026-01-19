const express = require("express");
const router = express.Router();
const menu = require("../controllers/menu.controller");

router.get("/menu/:slug", menu.getPublicMenu);

module.exports = router;
