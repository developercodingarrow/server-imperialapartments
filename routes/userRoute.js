const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const userController = require("../controllers/userController");

router.use(AuthController.protect, AuthController.restricTO("user"));

router.get("/all-users", userController.allUsers);
router.patch("/update-user-name", userController.updateUserName);

module.exports = router;
