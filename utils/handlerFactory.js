const fs = require("fs").promises;
const path = require("path");
const catchAsync = require("./catchAsync");
const AppError = require("./appError");
const { Module } = require("module");

// This function for CRETE one
exports.createOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    console.log(req.body);
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      result: doc,
    });
  });
};

// This function for GET ALL
exports.getAll = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.find();
    res.status(200).json({
      status: "success",
      total: doc.length,
      result: doc,
    });
  });
};

// This function for Delete one
exports.deleteOneByBody = (Model) => {
  return catchAsync(async (req, res, next) => {
    console.log(req.body);
    const doc = await Model.findByIdAndDelete(req.body.id);

    if (!doc) {
      return next(new AppError("NO Document found with this ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });
};

// This function for Update one
exports.updateOneByParam = (Model) => {
  return catchAsync(async (req, res, next) => {
    console.log(req.body);
    const updateData = req.body.data || req.body;
    const doc = await Model.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("NO Document found with this ID", 404));
    }

    res.status(204).json({
      status: "success",
      result: doc,
    });
  });
};

// This function for Update one
exports.updateOneByBody = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.body._id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("NO Document found with this ID", 404));
    }

    res.status(201).json({
      status: "success",
      result: doc,
    });
  });
};

// GET ONE BY SLUG
exports.getOneBySlug = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findOne({ slug: req.params.slug });
    res.status(200).json({
      status: "success",
      total: doc.length,
      result: doc,
    });
  });
};

// GET ONE BY SLUG
exports.getOneByID = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findOne({ _id: req.params.slug });
    res.status(200).json({
      status: "success",
      total: doc.length,
      result: doc,
    });
  });
};

// This function for Delete one
exports.deleteOneByBody = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.body._id);

    if (!doc) {
      return next(new AppError("NO Document found with this ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });
};

// Togle Blooen filed
exports.toggleBooleanField = (Model, fieldName) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.body._id);

    if (!doc) {
      return next(new AppError("No document found with this ID", 404));
    }

    // Toggle the boolean field
    doc[fieldName] = !doc[fieldName];

    // Save the updated document
    await doc.save();

    res.status(200).json({
      status: "success",
      data: {
        [fieldName]: doc[fieldName],
      },
    });
  });
};

// Generic function to update a document's thumbnail image by slug for any model and field name
exports.updateImageByIdAndField = (Model, fieldName) => {
  return catchAsync(async (req, res, next) => {
    const { alternativeText, title, caption, description } = req.body;
    const image = req.files[0].filename;
    console.log(req.files);
    const id = req.params._id;
    // Create an object with the dynamically provided field name
    const updateObject = {
      [fieldName]: {
        url: image,
        altText: req.files[0].originalname,
        alternativeText,
        title,
        caption,
        description,
      },
    };
    // Find and update the document based on the provided slug
    const data = await Model.findByIdAndUpdate(id, updateObject, {
      new: true,
      upsert: true,
    });

    // Respond with a success message and the updated data
    return res.status(200).json({
      status: "success",
      message: `${fieldName} updated successfully`,
      data,
    });
  });
};

// Generic function to update a document's Gallery
exports.updateGalleyByIdAndField = (Model, fieldName) => {
  return catchAsync(async (req, res, next) => {
    const { alternativeText, title, caption, description } = req.body;
    const images = req.files;

    const id = req.params._id;
    console.log(images);
    console.log("alternativeText---", alternativeText);
    console.log("title---", title);
    console.log("caption---", caption);
    console.log("description---", description);

    const project = await Model.findById(id);

    if (!project) {
      return res
        .status(404)
        .json({ status: "error", message: "Project not found" });
    }

    // Prepare image data to push into ProjectGallery array
    const imageDataArray = images.map((image, index) => {
      const imageData = {
        url: image.filename,
        altText: image.originalname,
        alternativeText: alternativeText[index], // Assuming alternativeText is an array
        title: title[index],
        caption: caption[index],
        description: description[index],
      };
      console.log("Image Data:", imageData); // Console log each image data
      return imageData;
    });

    // Push all images into ProjectGallery
    project[fieldName].push(...imageDataArray);

    // Save updated project
    const updatedProject = await project.save();

    // Find and update the document based on the provided slug
    const data = await Model.findByIdAndUpdate(id, updatedProject, {
      new: true,
      upsert: true,
    });

    // Respond with a success message and the updated data
    return res.status(200).json({
      status: "success",
      message: `${fieldName} updated successfully`,
      data,
    });
  });
};

exports.updateSingleImageDataGallery = (Model) => {
  return catchAsync(async (req, res, next) => {
    const { alternativeText, title, caption, description, imageId } = req.body;
    const id = req.params._id;
    const project = await Model.findById(id);

    if (!project) {
      return res
        .status(404)
        .json({ status: "error", message: "Project not found" });
    }

    const imageIndex = project.ProjectGallery.findIndex(
      (image) => image._id.toString() === imageId
    );

    if (imageIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "Image not found in project gallery",
      });
    }

    // Update only the necessary fields
    if (alternativeText)
      project.ProjectGallery[imageIndex].alternativeText = alternativeText;
    if (title) project.ProjectGallery[imageIndex].title = title;
    if (caption) project.ProjectGallery[imageIndex].caption = caption;
    if (description)
      project.ProjectGallery[imageIndex].description = description;

    await project.save();

    res.status(200).json({
      status: "success",
      message: "Image updated successfully",
      data: project.ProjectGallery[imageIndex],
    });
  });
};

exports.deleteImageFromGallery = (Model) => {
  return catchAsync(async (req, res, next) => {
    const { _id } = req.params;
    const { imageId } = req.body;
    console.log(imageId);

    const project = await Model.findById(_id);

    if (!project) {
      return res
        .status(404)
        .json({ status: "error", message: "Project not found" });
    }

    const imageIndex = project.ProjectGallery.findIndex(
      (image) => image._id.toString() === imageId
    );

    if (imageIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "Image not found in project gallery",
      });
    }

    // Remove the image from the gallery array
    project.ProjectGallery.splice(imageIndex, 1);

    await project.save();

    res.status(200).json({
      status: "success",
      message: "Image deleted successfully",
    });
  });
};

// This function for CRETE one
exports.creatchildreferencing = (ReferenceModel, Model, filed) => {
  return catchAsync(async (req, res, next) => {
    console.log(req.body);
    const _id = req.params._id;
    const data = req.body;
    console.log(data);

    // Check if faqData is an array, if not, make it an array
    const faqs = Array.isArray(data) ? data : [data];

    // Create and save all FAQ documents
    const createdFAQs = await Model.insertMany(faqs);

    // Get the IDs of the created FAQs
    const faqIds = createdFAQs.map((faq) => faq._id);

    // Find the reference model document by ID and update the reference field
    const doc = await ReferenceModel.findById(_id);

    if (!doc) {
      return next(new Error("Reference document not found"));
    }

    // Update the reference field by pushing the new FAQ IDs into the array
    doc[filed].push(...faqIds);
    await doc.save();

    res.status(201).json({
      status: "success",
      result: doc,
    });
  });
};
