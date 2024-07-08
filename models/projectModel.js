const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectTitle: {
      type: String,
      require: [true, "Project Title is Required!"],
    },

    metadescription: {
      type: String,
      require: [true, "Meta Description is Required !"],
    },

    price: {
      type: Number,
      require: [true, "price is Required!"],
    },

    roomTypes: {
      type: String,
    },

    overview: {
      type: String,
    },

    projectContent: {
      type: String,
    },

    ProjectThumblin: {
      url: {
        type: String,
        // default: "project-dummy-image.jpg",
      },
      altText: {
        type: String,
      },
      alternativeText: {
        type: String,
      },
      title: {
        type: String,
      },
      caption: {
        type: String,
      },
      description: {
        type: String,
      },
    },
    featured: {
      type: Boolean,
      enum: [false, true],
      default: false,
    },
  },
  { timestamps: true }
);

const Projects = mongoose.model("Projects", projectSchema);

module.exports = Projects;
