const pool = require("../config/db");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });
exports.uploadMiddleware = upload.single("image");


// Get all menu items for logged in user
exports.getMyMenu = async (req, res) => {
    const userId = req.user.id;

    try {
        const [[restaurant]] = await pool.query(
            "SELECT id FROM restaurants WHERE user_id = ?",
            [userId]
        );

        const [rows] = await pool.query(
            "SELECT * FROM menu_items WHERE restaurant_id = ? ORDER BY sort_order ASC",
            [restaurant.id]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Add menu item
exports.createMenuItem = async (req, res) => {
    const userId = req.user.id;
    const { category, name, price, image_url, status, sort_order } = req.body;

    try {
        const [[restaurant]] = await pool.query(
            "SELECT id FROM restaurants WHERE user_id = ?",
            [userId]
        );

        await pool.query(
            `INSERT INTO menu_items 
      (restaurant_id, category, name, price, image_url, status, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                restaurant.id,
                category,
                name,
                price,
                image_url || null,
                status || "active",
                sort_order || 0,
            ]
        );

        res.json({ message: "Menu item created" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Update menu item
exports.updateMenuItem = async (req, res) => {
    const userId = req.user.id;
    const id = req.params.id;
    const { category, name, price, image_url, status, sort_order } = req.body;

    try {
        const [[restaurant]] = await pool.query(
            "SELECT id FROM restaurants WHERE user_id = ?",
            [userId]
        );

        await pool.query(
            `UPDATE menu_items 
       SET category=?, name=?, price=?, image_url=?, status=?, sort_order=?
       WHERE id=? AND restaurant_id=?`,
            [
                category,
                name,
                price,
                image_url || null,
                status,
                sort_order,
                id,
                restaurant.id,
            ]
        );

        res.json({ message: "Menu item updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
    const userId = req.user.id;
    const id = req.params.id;

    try {
        const [[restaurant]] = await pool.query(
            "SELECT id FROM restaurants WHERE user_id = ?",
            [userId]
        );

        await pool.query(
            "DELETE FROM menu_items WHERE id = ? AND restaurant_id = ?",
            [id, restaurant.id]
        );

        res.json({ message: "Menu item deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Public menu by restaurant slug
exports.getPublicMenu = async (req, res) => {
    const slug = req.params.slug;

    try {
        const [[restaurant]] = await pool.query(
            "SELECT id, name, logo,theme_color FROM restaurants WHERE slug = ?",
            [slug]
        );

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        const [items] = await pool.query(
            "SELECT category, name, price, image_url,status FROM menu_items WHERE restaurant_id = ? AND status='active' ORDER BY sort_order ASC",
            [restaurant.id]
        );

        res.json({
            restaurant,
            items,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.uploadImage = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ message: "No file uploaded" });

        const result = await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
            { folder: "qr-menu" }
        );

        res.json({ url: result.secure_url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Upload failed" });
    }
};
exports.reorderMenu = async (req, res) => {
    const userId = req.user.id;
    const { items } = req.body;

    try {
        for (const item of items) {
            await pool.query(
                "UPDATE menu_items SET sort_order = ? WHERE id = ?",
                [item.sort_order, item.id]
            );
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to reorder" });
    }
};
exports.updateStatus = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    try {
        await pool.query(
            `
      UPDATE menu_items 
      SET status = ?
      WHERE id = ? AND restaurant_id = (
        SELECT id FROM restaurants WHERE user_id = ?
      )
      `,
            [status, id, userId]
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update status" });
    }
};



