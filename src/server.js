
require("dotenv").config();

const app = require("./app");
const PORT = 5000;

app.listen(PORT, () => {
    console.log("Server running on http://0.0.0.0:" + PORT);
});
