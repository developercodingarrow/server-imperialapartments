const mongoose = require("mongoose");
const slugify = require("slugify");

const roomTypeSchema = new mongoose.Schema(
  {
    name: {
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

roomTypeSchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    lower: true,
  });
  next();
});

const RoomTypes = mongoose.model("RoomTypes", roomTypeSchema);

module.exports = RoomTypes;
