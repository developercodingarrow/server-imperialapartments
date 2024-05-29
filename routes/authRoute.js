const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");

router.post("/sing-up", AuthController.userRegisteraion);
router.post("/verify-otp/:token", AuthController.verifyOtp);
router.post("/forgot-password", AuthController.forgatePassword);
router.post("/reset-password/:token", AuthController.resetPassword);

module.exports = router;
