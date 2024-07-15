const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      enum: [false, true],
      default: false,
    },
  },
  { timestamps: true }
);

const FAQ = mongoose.model("FAQ", faqSchema);

module.exports = FAQ;
