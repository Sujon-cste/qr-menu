const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "qruser",
    password: "strongpassword",
    database: "qr_menu",
});

module.exports = pool;
