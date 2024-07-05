const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Projects = require("../models/projectModel");
const Factory = require("../utils/handlerFactory");

// 1) Create Blog Categories
exports.createProject = Factory.createOne(Projects);

// 2) GET ALL PROJECTS
exports.getAllProjects = Factory.getAll(Projects);

//  6) Toggle Blog Features
exports.isFeaturedProject = Factory.toggleBooleanField(Projects, "featured");

// UPLOAD BLOG THUMBLIN
exports.UplodProjectThumblin = Factory.updateImageByIdAndField(
  Projects,
  "ProjectThumblin"
);
