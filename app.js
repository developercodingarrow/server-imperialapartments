const express = require("express");
const app = express();
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");

// Midelwears
app.use(cors());
app.use(express.json());

app.use("/api/v1/imperialapartments/auth", authRoute);
app.use("/api/v1/imperialapartments/user", userRoute);

module.exports = app;
