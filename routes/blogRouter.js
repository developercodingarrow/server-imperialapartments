const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const blogController = require("../controllers/blogController");

// 1) GET ALL Categories
router.get("/get-all-blogs", blogController.allBlog);
// Authicanted User Api
router.use(AuthController.protect, AuthController.restricTO("user"));

// 2) Create New Categorie
router.post("/create-new-blog", blogController.createBlog);

// 3) GET SINGLE BLOG BY ID
router.get("/get-single-blog/:slug", blogController.getSingleBlog);

// 4) Update Single Blog
router.patch("/update-single-blog/:id", blogController.updateSingleBolg);

// 5)
router.post("/update-blog-tags/:_id", blogController.updateBlogTag);

module.exports = router;
