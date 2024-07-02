const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Blogs = require("../models/blogModel");
const Factory = require("../utils/handlerFactory");

// 1) Create new Blog
exports.createBlog = Factory.createOne(Blogs);

// 2) UPDATE new Blog
exports.updateSingleBolg = Factory.updateOneByParam(Blogs);

// 3) GET ALL BLOGS
exports.allBlog = Factory.getAll(Blogs);

// 4) GET BLOG BY ID
exports.getSingleBlog = Factory.getOneByID(Blogs);

exports.updateBlogTag = catchAsync(async (req, res, next) => {
  const { _id } = req.params;
  console.log(req.body);
  const { tagName } = req.body;

  console.log("tags");

  const blog = await Blogs.findById(_id);

  if (!blog) {
    return next(new AppError("Blog post not found"));
  }

  if (!Array.isArray(tagName)) {
    return next(new AppError("tagName must be an array"));
  }

  const existingTags = blog.blogTags.map((tag) => tag.tagName);

  const newTags = [];

  for (let name of tagName) {
    if (!existingTags.includes(name)) {
      newTags.push(name);
    }
  }

  newTags.forEach((name) => {
    blog.blogTags.push({ tagName: name });
  });

  await blog.save();

  res.status(200).json({
    status: "success",
    result: blog,
  });
});

exports.updateBlogCategories = catchAsync(async (req, res, next) => {
  const { _id } = req.params;
  console.log(req.body);
  const { category } = req.body;

  console.log("category");

  const blog = await Blogs.findById(_id);

  if (!blog) {
    return next(new AppError("Blog post not found"));
  }

  if (!Array.isArray(category)) {
    return next(new AppError("Categories must be an array"));
  }

  const existingcategory = blog.blogCategories.map((tag) => tag.category);

  const newCategories = [];

  for (let name of category) {
    if (!existingcategory.includes(name)) {
      newCategories.push(name);
    }
  }

  newCategories.forEach((name) => {
    blog.blogCategories.push({ category: name });
  });

  await blog.save();

  res.status(200).json({
    status: "success",
    result: blog,
  });
});

// UPLOAD BLOG THUMBLIN
exports.UplodblogThumblin = Factory.updateImageByIdAndField(
  Blogs,
  "blogThumblin"
);
