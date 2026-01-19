const { verifyToken } = require("../utils/jwt");

module.exports = function (req, res, next) {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ message: "No token" });
    }

    const token = header.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Invalid token" });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token invalid" });
    }
};
