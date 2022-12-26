const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("./../models/userModel");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
//  1)Get User
exports.getUser = catchAsync(async (req, res) => {
  const user = await User.findById({ _id: req.params.id }); //find user

  await user.populate("properties"); //populate the properties field
  await user.populate("jobs");
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

//  2)Get All User
exports.getAllUser = async (req, res) => {
  res.status(200).send("Get All User from database");
};

//  3)Create User
exports.createUser = async (req, res) => {
  const user = await User.create(req.body);
  console.log(req.body);
};

//  4)Patch User
exports.deleteUser = catchAsync(async (req, res, next) => {
  // res.status(200).send('Update User in database');
  const user = await User.findByIdAndDelete(req.params.id, { new: true });

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

//  5)Delete User
// exports.updateUser = catchAsync(async (req, res) => {
//   const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//   });

//   res.status(201).json({
//     status: "success",
//     data: {
//       user,
//     },
//   });
// });
exports.getMe = catchAsync(async (req, res, next) => {
  const doc = await User.findOne({
    _id: req.user.id,
  });
  if (!doc) {
    return next(new AppError("No Document Found With That ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }
  console.log("I am in");
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    "username",
    "phone",
    "bioText",
    "email"
  );
  console.log(req.file);
  if (req.file) filteredBody.profilePic = req.file.fieldname;
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  token = req.headers.authorization.split(" ")[1];
  res.status(200).json({
    status: "success",
    user: updatedUser,
    token,
  });
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    // roles ['admin', 'lead-guide']. role='user'
    next();
  };
};
