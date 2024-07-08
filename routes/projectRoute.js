const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const projectController = require("../controllers/projectController");
const { projectThumblinMidelwear } = require("../utils/multerUploadMiddleware");

// SSR API
router.get("/all-listing", projectController.allListing);
router.get("/fillter-projects", projectController.fillterProjects);

router.use(AuthController.protect, AuthController.restricTO("user"));
router.post("/create-new-project", projectController.createProject);
router.get("/get-all-projects", projectController.getAllProjects);
router.post("/is-feaured-blog", projectController.isFeaturedProject);
router.patch(
  "/update-project-thumblin/:_id",
  projectThumblinMidelwear,
  projectController.UplodProjectThumblin
);

module.exports = router;
