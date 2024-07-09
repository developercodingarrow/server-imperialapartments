const fs = require("fs").promises;
const path = require("path");
const catchAsync = require("./catchAsync");
const AppError = require("./appError");

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
