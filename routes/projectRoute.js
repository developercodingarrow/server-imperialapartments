const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const projectController = require("../controllers/projectController");
const {
  projectThumblinMidelwear,
  projectGalleryMidelwear,
} = require("../utils/multerUploadMiddleware");

// SSR API
router.get("/all-listing", projectController.allListing);
router.get("/fillter-projects", projectController.fillterProjects);

router.use(AuthController.protect, AuthController.restricTO("user"));
router.post("/create-new-project", projectController.createProject);
router.get("/get-all-projects", projectController.getAllProjects);
router.get("/get-single-project/:slug", projectController.getSingleProject);
router.post("/is-feaured-blog", projectController.isFeaturedProject);
router.patch(
  "/update-single-project/:id",
  projectController.updateSingleProject
);
router.patch(
  "/update-project-thumblin/:_id",
  projectThumblinMidelwear,
  projectController.UplodProjectThumblin
);

router.post(
  "/update-project-gallery/:_id",
  projectGalleryMidelwear,
  projectController.UplodProjectGallery
);

module.exports = router;
