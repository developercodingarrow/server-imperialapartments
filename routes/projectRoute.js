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
router.delete("/delete-single-project", projectController.deleteSingleProject);

router.post("/create-project-faq/:_id", projectController.createProjectFAQ);
router.patch(
  "/update-single-project/:id",
  projectController.updateSingleProject
);
router.patch(
  "/update-project-thumblin/:_id",
  projectThumblinMidelwear,
  projectController.UplodProjectThumblin
);

router.patch(
  "/update-gallery-single-image-field/:_id",
  projectController.upadteGallerySingleImageFiled
);

router.post(
  "/delete-image-from-gallery/:_id",
  projectController.deleteImageFromGallery
);

router.post(
  "/update-project-gallery/:_id",
  projectGalleryMidelwear,
  projectController.UplodProjectGallery
);

module.exports = router;
