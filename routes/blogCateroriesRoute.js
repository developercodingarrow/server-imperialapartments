const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const categoriesController = require("../controllers/categoriesController");

// 1) GET ALL Categories
router.get("/get-all-categories", categoriesController.allCategories);

// Authicanted User Api
router.use(AuthController.protect, AuthController.restricTO("user"));

// 2) Create New Categorie
router.post("/create-new-categorie", categoriesController.createCategorie);
// 3) DELETE SINGLE CATEGORIES
router.delete(
  "/delete-one-categorie",
  categoriesController.deleteOneCategories
);

router.patch("/update-one-categore", categoriesController.updateOneCategories);

module.exports = router;
