const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const propertySchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  category: {
    type: String,
    required: [true, "Please provide catgeory of property"],
    enum: {
      values: ["buy", "rent"],
      message: "category is either: sale or rent",
    },
  },
  province: {
    type: String,
    required: [true, "Please provide province in which property is located"],
    enum: {
      values: ["Punjab", "Khyberpakhtunkhwa", "Balochistan", "Sindh"],
      message:
        "Province is either: punjab, khyberpakhtunkhwa, Balochistan, Sindh",
    },
  },
  city: String,
  type: {
    type: String,
    required: [true, "Please provide type of property"],
    enum: {
      values: ["plot", "commercial", "residential"],
      message: "type is either: plot, commercial and residential",
    },
  },
  subType: {
    type: String,
    required: [true, "Please provide type of property"],
    enum: {
      values: [
        "flat",
        "house",
        "plot",
        "hostel",
        "villa",
        "apartment",
        "shop",
        "Flat",
        "House",
        "Plot",
        "Hostel",
        "Villa",
        "Apartment",
        "Shop",
      ],
      message:
        "subType is either: flat, house, plot, shop, apartment,villa and hostel",
    },
  },
  area: String,
  phoneNumber: { type: String, requied: [true, "Phone Number is required!"] },
  description: {
    type: String,
    required: [true, "Description is required"],
    minLength: [10, "Description should not be too short"],
    minLength: [20, "Description should not be too long"],
  },

  detailedAddress: {
    type: String, // Change these to the actual location coordinates
    required: [true, "address is required"],
  },
  noofbedrooms: {
    type: Number,
  },
  noofgarages: {
    type: Number,
  },
  noofwashrooms: {
    type: Number,
  },
  coverImage: String,
  images: [String],
  postedBy: { type: Schema.Types.ObjectId },
});
propertySchema.pre(/^find/, function (next) {
  this.populate({
    path: "postedBy",
    select: "-__v",
  });
  next();
});
const Property = model("Property", propertySchema);

module.exports = Property;
