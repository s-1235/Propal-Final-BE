const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema, model } = mongoose;

const { isEmail } = require("validator");

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "can't be blank"],
  },
  bioText: {
    type: String,
  },
  about: {
    type: String,
  },
  email: { type: String, validate: isEmail },
  password: { type: String, required: true, select: false },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  phone: {
    type: String,
    unique: true,
    required: [true, "Please enter your phone number"],
  },
  userType: {
    type: String,
    required: [true, "Usertype must not be empty!!"],
  },
  properties: [{ type: Schema.Types.ObjectId, ref: "Property" }],
  jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
});

//Password Hashing
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.confirmPassword = undefined;
  next();
});
// userSchema.virtual("userproperties", {
//   ref: "Property",
//   foreignField: "postedBy",
//   localField: "_id",
// });
// userSchema.virtual("userjobs", {
//   ref: "Job",
//   foreignField: "postedBy",
//   localField: "_id",
// });
// userSchema.virtual("usergigs", {
//   ref: "Gig",
//   foreignField: "postedBy",
//   localField: "_id",
// });
// userSchema.virtual("properties", {
//   ref: "Property",
//   foreignField: "postedBy",
//   localField: "_id",
// });
userSchema.methods.correctPassword = async function (
  enteredPassword,
  password
) {
  return await bcrypt.compare(enteredPassword, password);
};

const User = model("User", userSchema);

module.exports = User;
