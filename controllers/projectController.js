const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Projects = require("../models/projectModel");
const Factory = require("../utils/handlerFactory");

// 1) Create Project for Client (SSR Rendering)
exports.allListing = Factory.getAll(Projects);

// 2) Create Blog Categories
exports.createProject = Factory.createOne(Projects);

// 3) GET ALL PROJECTS
exports.getAllProjects = Factory.getAll(Projects);

//  4) Toggle Blog Features
exports.isFeaturedProject = Factory.toggleBooleanField(Projects, "featured");

// UPLOAD BLOG THUMBLIN
exports.UplodProjectThumblin = Factory.updateImageByIdAndField(
  Projects,
  "ProjectThumblin"
);

function buildFilter(queryObj) {
  let filter = {};

  for (const key in queryObj) {
    if (Object.hasOwnProperty.call(queryObj, key)) {
      const value = queryObj[key];
      console.log(value);
      // Check each query parameter and construct the filter accordingly
      switch (key) {
        case "searchTerm":
          // Construct a $or query to search in multiple fields
          filter.$or = [{ projectTitle: { $regex: new RegExp(value, "i") } }];
          break;
        case "minPrice":
          // Construct a filter for projects with price greater than the provided value
          filter.price = { $gt: parseFloat(value) };
          break;
        case "roomTypes":
          // Construct a filter to match projects with types of units specified
          const roomTypesArray = value
            .split(",")
            .map((room) => room.trim().toLowerCase());
          filter.roomTypes = {
            $in: roomTypesArray.map((unit) => new RegExp(unit, "i")),
          };
          break;

        default:
          // Handle other query parameters if necessary
          break;
      }
    }
  }

  return { filter };
}

exports.fillterProjects = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "filed", "order", "search"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // Build the filter object
  const { filter } = buildFilter(queryObj);
  // Add an additional condition to filter only isActive projects
  filter.isActive = { $ne: false };

  // Execute the query
  console.log(filter);

  const sortOptions = { updatedAt: -1 };
  const data = await Projects.find(filter).sort(sortOptions);

  res.status(200).json({
    total: data.length,
    status: "success",
    result: data,
  });
});
