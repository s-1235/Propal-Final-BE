const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const Admin = require("../models/adminModel");
const Email = require("../utils/email");

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

exports.signUp = catchAsync(async (req, res) => {
  const data = ({
    username,
    email,
    password,
    confirmPassword,
    bioText,
    userType,
  } = req.body);
  console.log(data);

  const user = await User.create(data);

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
  const { email, password } = req.body;

  console.log(email, password);

  // 2) Check if either is empty
  if (!email || !password) {
    return next(new AppError("Email or password is empty", 400));
  }

  // 3)Get the user
  const user = await User.findOne({ email }).select("+password");
  console.log("this is 👤", user);

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
  const currentUser = await User.findById(decoded.id);
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
