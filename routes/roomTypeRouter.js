const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const roomTypeController = require("../controllers/roomTypeController");

// 1) GET ALL Categories
router.get("/get-all-room-type", roomTypeController.allRoomType);

// Authicanted User Api
router.use(AuthController.protect, AuthController.restricTO("user"));

// 2) Create New Categorie
router.post("/create-new-room-type", roomTypeController.createRoomType);
// 3) DELETE SINGLE CATEGORIES
router.delete("/delete-one-room-type", roomTypeController.deleteOneRoomType);

router.patch("/update-one-room-type", roomTypeController.updateOneRoomType);

module.exports = router;
