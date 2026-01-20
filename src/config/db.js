const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    //develop
    host: "localhost",
    user: "qruser",
    password: "strongpassword",
    database: "qr_menu",
});
//live
// const pool = mysql.createPool(
//     "mysql://root:aYDHyZkrXBjIuDbryADKUoXDJGLPxUYN@turntable.proxy.rlwy.net:22111/railway"
// );
module.exports = pool;
