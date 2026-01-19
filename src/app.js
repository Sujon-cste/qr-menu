const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const menuRoutes = require("./routes/menu.routes");
const publicRoutes = require("./routes/public.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/restaurant", restaurantRoutes);


app.get("/", (req, res) => {
    res.send("QR Menu API is running");
});

module.exports = app;
