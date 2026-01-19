const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { generateToken } = require("../utils/jwt");

exports.register = async (req, res) => {
    try {
        const { email, password, restaurantName, slug } = req.body;

         // console.log("REGISTER BODY:", req.body);  👈 ADD THIS LINE FOR DEBUG

        if (!email || !password || !restaurantName || !slug) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // check user exists
        const [existing] = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );
        if (existing.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // check slug unique
        const [slugExists] = await pool.query(
            "SELECT id FROM restaurants WHERE slug = ?",
            [slug]
        );
        if (slugExists.length > 0) {
            return res.status(400).json({ message: "Slug already in use" });
        }

        // hash password
        const hashed = await bcrypt.hash(password, 10);

        // create user
        const [userResult] = await pool.query(
            "INSERT INTO users (email, password_hash) VALUES (?, ?)",
            [email, hashed]
        );

        const userId = userResult.insertId;

        // 🔥 CREATE RESTAURANT USING USER INPUT
        await pool.query(
            "INSERT INTO restaurants (user_id, name, slug) VALUES (?, ?, ?)",
            [userId, restaurantName, slug]
        );

        // create token
        const token = jwt.sign(
            { id: userId, email },
            process.env.JWT_SECRET,
            { expiresIn: "365d" }
        );

        res.json({ token });
    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};



exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const user = rows[0];

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken({ id: user.id, email: user.email });

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
