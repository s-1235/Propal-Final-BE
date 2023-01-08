const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const Admin = require("../models/adminModel");
const Email = require("../utils/email");
const Contractor = require("../models/contractorModel");
const Agent = require("../models/agentModel");
const Agency = require("../models/agencyModel");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
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

exports.signUp = catchAsync(async (req, res) => {
  const data = ({
    username,
    email,
    password,
    confirmPassword,
    bioText,
    userType,
  } = req.body);
  let user;
  console.log(data.userType);
  if (data.userType === "user") {
    user = await User.create(data);
  } else if (data.userType === "contractor") {
    user = await Contractor.create(data);
  } else if (data.userType === "agency") {
    user = await Agency.create(data);
  } else if (data.userType === "agent") {
    user = await Agent.create(data);
  }

  const token = signToken(user._id);
  const url = `${req.protocol}://${req.get("host")}/me`;
  console.log(url);
  await new Email(user, url).sendWelcome();

  res.status(201).json({
    status: "success",
    token,
    data: user,
  });
});

// exports.login = async (req, res, next) => {
//   try {
//     // 1) Get email and password
//     const { email, password } = req.body;

//     console.log(email, password);

//     // 2) Check if either is empty
//     if (!email || !password) {
//       return next(new AppError('Email or password is empty', 400));
//     }

//     // 3)Get the user
//     const user = await User.findOne({ email }).select('+password');
//     console.log('this is 👤', user);

//     // Check User exists or Password is incorrect
//     if (!user || !(await user.correctPassword(password, user.password))) {
//       console.log('💥app error not working');
//       return next(new AppError('Password or Email incorrect', 401));
//     }

//     // Assign Token Value
//     const token = signToken(user.id);

//     console.log(res, 'this is response');
//     // console.log(req.headers);
//     res.status(200).json({
//       status: 'success',
//       token,
//       data: user,
//     });
//   } catch (error) {
//     res
//       .status(401)
//       .json({ status: 'error', message: "can't login! TRY AGAIn" });
//   }
// };

////////////////////////////////////////////////////////////////////////////////////////////!
exports.login = catchAsync(async (req, res, next) => {
  // 1) Get email and password
  const { email, password, userType } = req.body;

  console.log(email, password);

  // 2) Check if either is empty
  if (!email || !password) {
    return next(new AppError("Email or password is empty", 400));
  }

  // 3)Get the user
  let user;
  if (userType === "user") {
    user = await User.findOne({ email }).select("+password");
    console.log("this is 👤", user);
  } else if (userType === "agent") {
    user = await Agent.findOne({ email }).select("+password");
    console.log("this is 👤", user);
  } else if (userType === "agency") {
    user = await Agency.findOne({ email }).select("+password");
    console.log("this is 👤", user);
  } else if (userType === "contractor") {
    user = await Agency.findOne({ email }).select("+password");
    console.log("this is 👤", user);
  }

  // Check User exists or Password is incorrect
  if (!user || !(await user.correctPassword(password, user.password))) {
    console.log("💥app error not working");
    return next(new AppError("Password or Email incorrect", 401));
  }

  console.log("hope");
  // console.log(req.headers);

  // Assign Token Value
  const token = signToken(user.id);

  console.log(res, "this is response");
  // console.log(req.headers);
  res.status(200).json({
    status: "success",
    token,
    data: user,
  });
});
// exports.login = catchAsync(async (req, res, next) => {
//   const { email, password } = req.body;

//   // 1) Check if email and password exist
//   if (!email || !password) {
//     return next(new AppError("Please provide email and password!", 400));
//   }
//   // 2) Check if user exists && password is correct
//   const user = await User.findOne({ email: email }).select("+password");

//   if (!user || !(await user.correctPassword(password, user.password))) {
//     return next(new AppError("Incorrect email or password", 401));
//   }
//   await user.populate("properties");
//   await user.populate("jobs");
//   // 3) If everything ok, send token to client
//   createSendToken(user, 200, req, res);
// });
// Admin Login

//!--------------

exports.adminLogin = catchAsync(async (req, res, next) => {
  // 1) Get Name and password
  console.log("reaching");
  console.log(req.body);
  const { username, password } = req.body;
  console.log("Username:" + username);
  console.log("Password:" + password);
  // 2) Check if either is empty
  if (!username || !password) {
    return next(new AppError("Name or password is empty", 400));
  }

  // 3)Get the user
  const admin = await Admin.findOne({ username });
  // console.log('this is 👤', admin);
  console.log(password, "pass1");
  console.log(admin.password, "pass2");
  // await user.populate('properties');
  const pass = admin.password === password;
  // Check User exists or Password is incorrect
  if (!admin || !pass) {
    // console.log('💥app error not working');
    return next(new AppError("Password or Name incorrect", 401));
  }
  admin.password = null;
  // Assign Token Value
  const token = signToken(admin.id);
  console.log(token);
  res.status(200).json({
    status: "success",
    token,
    data: { admin },
  });
});
//!--------------

// Protect
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  console.log("Running");
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  let currentUser;
  console.log(req.user);
  currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    currentUser = await Contractor.findById(decoded.id);
    if (!currentUser) {
      currentUser = await Agency.findById(decoded.id);
      if (!currentUser) {
        currentUser = await Agent.findById(decoded.id);
      }
    }
  }
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on Posted email
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  console.log(resetToken);
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset(resetToken);

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};
exports.getMe = catchAsync(async (req, res, next) => {
  let doc;
  console.log(req.user);
  if (req.user.userType === "user") {
    doc = await User.findOne({
      _id: req.user.id,
    });
  } else if (req.user.userType === "contractor") {
    doc = await Contractor.findOne({
      _id: req.user.id,
    });
  } else if (req.user.userType === "agency") {
    doc = await Agency.findOne({
      _id: req.user.id,
    });
  } else if (req.user.userType === "agent") {
    doc = await Agent.findOne({
      _id: req.user.id,
    });
  }
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
  if (req.user.userType === "user") {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );
  } else if (req.user.userType === "contractor") {
    const updatedUser = await Contractor.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );
  } else if (req.user.userType === "agency") {
    const updatedUser = await Agency.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );
  } else if (req.user.userType === "agent") {
    const updatedUser = await Agent.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );
  }
  token = req.headers.authorization.split(" ")[1];
  res.status(200).json({
    status: "success",
    user: updatedUser,
    token,
  });
});
