const mongoose = require("mongoose");
const slugify = require("slugify");

const blogCategoriesSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      require: [true, "Please add category name!"],
      unique: true,
      lowercase: true,
    },
    slug: {
      type: String,
      require: [true, "slug didn't work"],
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

blogCategoriesSchema.pre("save", function (next) {
  this.slug = slugify(this.categoryName, {
    lower: true,
  });
  next();
});

const BlogCategories = mongoose.model("BlogCategories", blogCategoriesSchema);

module.exports = BlogCategories;
