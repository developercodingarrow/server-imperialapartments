const express = require("express");
const app = express();
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const BlogCategorieRoute = require("./routes/blogCateroriesRoute");
const BlogRouter = require("./routes/blogRouter");

// Midelwears
app.use(cors());
app.use(express.json());

app.use("/api/v1/imperialapartments/auth", authRoute);
app.use("/api/v1/imperialapartments/user", userRoute);
app.use("/api/v1/imperialapartments/blog-categories", BlogCategorieRoute);
app.use("/api/v1/imperialapartments/blog", BlogRouter);

module.exports = app;
