const pool = require("../config/db");

exports.getMyRestaurant = async (req, res) => {
    const userId = req.user.id;

    try {
        const [rows] = await pool.query(
            "SELECT id, name, slug, logo,theme_color FROM restaurants WHERE user_id = ?",
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateMyRestaurant = async (req, res) => {
    const userId = req.user.id;
    const { name, slug, logo ,theme_color} = req.body;

    try {
        // check slug unique
        if (slug) {
            const [exists] = await pool.query(
                "SELECT id FROM restaurants WHERE slug = ? AND user_id != ?",
                [slug, userId]
            );
            if (exists.length > 0) {
                return res.status(400).json({ message: "Slug already in use" });
            }
        }

        await pool.query(
            "UPDATE restaurants SET name = ?, slug = ?, logo = ?, theme_color=? WHERE user_id = ?",
            [name, slug, logo,theme_color, userId]
        );

        res.json({ message: "Restaurant updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
