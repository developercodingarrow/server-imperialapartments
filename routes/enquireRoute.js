const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const enquireformController = require("../controllers/enquireformController");

router.post("/create-new-enquire", enquireformController.createEnquire);

// Authicanted User Api
router.use(AuthController.protect, AuthController.restricTO("user"));
router.get("/all-enquire", enquireformController.allEnquire);
router.delete("/delete-enquire", enquireformController.deleteOneEnquire);

module.exports = router;
