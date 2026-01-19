const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const restaurant = require("../controllers/restaurant.controller");

router.get("/me", auth, restaurant.getMyRestaurant);
router.put("/", auth, restaurant.updateMyRestaurant);

module.exports = router;
