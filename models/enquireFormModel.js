const mongoose = require("mongoose");

const enquireFormSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      require: [true, "Your Name is required!"],
    },

    email: {
      type: String,
      require: [true, "Email is Required for contact!"],
    },

    mobileNumber: {
      type: String,
      require: [true, "Mobile Number is Required for Contact!"],
    },

    message: {
      type: String,
    },

    userIP: {
      type: String,
    },
  },
  { timestamps: true }
);

const EnquireForm = mongoose.model("EnquireForm", enquireFormSchema);

module.exports = EnquireForm;
