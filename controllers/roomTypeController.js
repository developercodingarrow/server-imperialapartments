const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const RoomTypes = require("../models/roomTypeModel");
const Factory = require("../utils/handlerFactory");

// 1) Create Blog Categories
exports.createRoomType = Factory.createOne(RoomTypes);
// 2) GET ALL CATEGORIES
exports.allRoomType = Factory.getAll(RoomTypes);

// 3) DELETE ONE CATEGORIES
exports.deleteOneRoomType = Factory.deleteOneByBody(RoomTypes);

// 3) Update Categories
exports.updateOneRoomType = Factory.updateOneByBody(RoomTypes);
