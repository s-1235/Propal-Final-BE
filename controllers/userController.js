const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const User = require("./../models/userModel");
const Agent = require("./../models/agentModel");
const Agency = require("./../models/agencyModel");
const Contractor = require("./../models/contractorModel");
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
  let user;
  // if (req.user.userType === "user") {
  //   user = await User.findById({ _id: req.params.id }); //find user
  //   await user.populate("properties");
  // } else if (req.user.userType === "agent") {
  //   user = await Agent.findById({ _id: req.params.id });
  //   // await user.populate("properties");
  // } else if (req.user.userType === "agency") {
  //   user = await Agency.findById({ _id: req.params.id });
  // } else if (req.user.userType === "contractor") {
  //   user = await Contractor.findById({ _id: req.params.id });
  // }
  user = await User.findById({ _id: req.params.id });
  user ? await user.populate("properties") : undefined;
  if (!user) {
    user = await Contractor.findById({ _id: req.params.id });
    
    // user ? await user.populate('jobs') : undefined;
    if (!user) {
      user = await Agency.findById({ _id: req.params.id });
      if (!user) {
        user = await Agent.findById({ _id: req.params.id });
        user ? await user.populate("properties") : undefined;
      }
    }
  }

  // console.log("Hello");
  //populate the properties field
  // req.user.userType !== "agency" ? await user.populate("jobs") : undefined;
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
exports.searchUser = catchAsync(async (req, res) => {
  console.log("In Search Users");
  const key = JSON.parse(req.query.searchdata);
  console.log(key);
  // const property = await Property.find({
  //   $or: [
  //     { title: { $regex: key } },
  //     { description: { $regex: key } },
  //     { detailedAddress: { $regex: key } },
  //     { propertyType: { $regex: key } },
  //   ],
  // });

  let features;
  let users;
  if (key.userType === "contractor") {
    features = new APIFeatures(
      Contractor.find({
        $or: [{ username: { $regex: key.username, $options: "i" } }],
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    users = await features.query;
  } else if (key.userType === "agent") {
    features = new APIFeatures(
      Agent.find({
        $or: [{ username: { $regex: key.username, $options: "i" } }],
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    users = await features.query;
  } else if (key.userType === "agency") {
    features = new APIFeatures(
      Agent.find({
        $or: [{ username: { $regex: key.username, $options: "i" } }],
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    users = await features.query;
  }
  res.status(201).json({
    status: "success",
    data: {
      users,
    },
  });
});
