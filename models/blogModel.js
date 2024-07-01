const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
  {
    blogTitle: {
      type: String,
    },
    slug: {
      type: String,
      require: [true, "slug didn't work"],
      unique: true,
    },

    metaDescription: {
      type: String,
    },

    blogDescreption: {
      type: String,
    },
    BlogThumblin: {
      url: {
        type: String,
        // default: "project-dummy-image.jpg",
      },
      altText: {
        type: String,
      },
    },

    blogTags: [
      {
        tagName: { type: String },
        tagSlug: { type: String },
      },
    ],

    blogCategories: [
      {
        category: {
          type: String,
        },
        slug: {
          type: String,
        },
      },
    ],
    keywords: {
      type: String,
    },
  },
  { timestamps: true }
);

blogSchema.pre("save", function (next) {
  // Check if blogTitle is provided before generating the slug
  if (this.blogTitle) {
    // Generate slug from blogTitle
    const baseSlug = slugify(this.blogTitle, {
      lower: true,
    });

    // Generate a random string with timestamp
    const randomString = new Date().getTime().toString(36).substring(7);

    // Combine baseSlug with random string
    this.slug = `${baseSlug}-${randomString}`;
  } else {
    // Generate a random default slug with timestamp when blogTitle is not provided
    this.slug = slugify(new Date().getTime().toString(36).substring(7), {
      lower: true,
    });
  }

  next();
});

blogSchema.pre("save", function (next) {
  // Check if blogCategories array is empty
  if (!this.blogCategories || this.blogCategories.length === 0) {
    this.blogCategories = [
      {
        category: "uncategorized",
        slug: slugify("uncategorized", { lower: true }),
      },
    ];
  }

  this.blogCategories.forEach((categoryObject, index) => {
    categoryObject.slug = slugify(categoryObject.category, { lower: true });
  });

  next();
});

const Blogs = mongoose.model("Blogs", blogSchema);

module.exports = Blogs;
