const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const GigSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  types: {
    type: String,
    required: true,
    enum: {
      values: [
        "wiring",
        "paint",
        "lenter",
        "woodwork",
        "construction",
        "interiordesign",
        "exteriordesign",
        "plumbing",
      ],
      message: "Gig must be of given types",
    },
  },
  price: {
    type: String,
    required: [true, "Price is required"],
  },
  typicallyCharge: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  city: String,
  address: String,
  phoneNumber: { type: String, requied: [true, "Phone Number is required!"] },
  description: {
    type: String,
    required: [true, "Description is required"],
    minLength: [10, "Description should not be too short"],
    maxLength: [100, "Description should not be too long"],
  },
  availability: {
    type: String,
  },
  coverImage: String,
  images: [String],
  postedBy: { type: Schema.Types.ObjectId, ref: "Contractor" },
});

const Gig = model("Gig", GigSchema);

module.exports = Gig;
