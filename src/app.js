const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const menuRoutes = require("./routes/menu.routes");
const publicRoutes = require("./routes/public.routes");

const app = express();

// ✅ Proper CORS config
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/restaurant", restaurantRoutes);

app.get("/", (req, res) => {
  res.send("QR Menu API is running");
});

module.exports = app;

