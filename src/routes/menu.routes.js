const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const menu = require("../controllers/menu.controller");
const { uploadMiddleware } = require("../controllers/menu.controller");
const menuController = require("../controllers/menu.controller");



router.get("/", auth, menu.getMyMenu);
router.post("/", auth, menu.createMenuItem);
router.put("/:id", auth, menu.updateMenuItem);
router.delete("/:id", auth, menu.deleteMenuItem);
router.post("/upload", auth, uploadMiddleware, menu.uploadImage);
router.post("/reorder", auth, menuController.reorderMenu);
router.put("/:id/status", auth, menuController.updateStatus);




module.exports = router;

