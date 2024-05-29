const express = require("express");
const app = express();
const cors = require("cors");
const authRoute = require("./routes/authRoute");

// Midelwears
app.use(cors());
app.use(express.json());

app.use("/api/v1/imperialapartments/auth", authRoute);

module.exports = app;
