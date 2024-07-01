const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const BlogCategories = require("../models/BlogCategoriesModel");
const Factory = require("../utils/handlerFactory");

// 1) Create Blog Categories
exports.createCategorie = Factory.createOne(BlogCategories);
// 2) GET ALL CATEGORIES
exports.allCategories = Factory.getAll(BlogCategories);

// 3) DELETE ONE CATEGORIES
exports.deleteOneCategories = Factory.deleteOneByBody(BlogCategories);

// 3) Update Categories
exports.updateOneCategories = Factory.updateOneByBody(BlogCategories);
