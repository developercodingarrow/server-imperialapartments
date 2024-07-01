const express = require("express");
const app = express();
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const BlogCategorieRoute = require("./routes/blogCateroriesRoute");

// Midelwears
app.use(cors());
app.use(express.json());

app.use("/api/v1/imperialapartments/auth", authRoute);
app.use("/api/v1/imperialapartments/user", userRoute);
app.use("/api/v1/imperialapartments/blog-categories", BlogCategorieRoute);

module.exports = app;
