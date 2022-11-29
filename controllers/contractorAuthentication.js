const Contractor = require('./../models/contractors');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const Admin = require('../models/adminModel');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchAsync(async (req, res) => {
  const data = ({ username, email, password, confirmPassword } = req.body);
  console.log(data);

  const contractor = await Contractor.create(data);

  const token = signToken(contractor._id);
  res.status(201).json({
    status: 'success',
    token,
    data: contractor,
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
    return next(new AppError('Email or password is empty', 400));
  }

  // 3)Get the user
  const contractor = await Contractor.findOne({ email }).select('+password');
  console.log('this is 👤', contractor);

  await contractor.populate('gigs');

  // Check User exists or Password is incorrect
  if (!contractor || !(await contractor.correctPassword(password, contractor.password))) {
    console.log('💥app error not working');
    return next(new AppError('Password or Email incorrect', 401));
  }

  console.log('hope');
  // console.log(req.headers);

  // Assign Token Value
  const token = signToken(contractor.id);

  console.log(res, 'this is response');
  // console.log(req.headers);
  res.status(200).json({
    status: 'success',
    token,
    data: contractor,
  });
});

// Admin Login

//!--------------

exports.adminLogin = catchAsync(async (req, res, next) => {
  // 1) Get Name and password
  console.log('reaching');
  const { name, password } = req.body;

  // 2) Check if either is empty
  if (!name || !password) {
    return next(new AppError('Name or password is empty', 400));
  }

  // 3)Get the user
  const admin = await Admin.findOne({ name });
  // console.log('this is 👤', admin);
  console.log(password, 'pass1');
  console.log(admin.password, 'pass2');
  // await user.populate('properties');
  const pass = admin.password === password;
  // Check User exists or Password is incorrect
  if (!admin || !pass) {
    // console.log('💥app error not working');
    return next(new AppError('Password or Name incorrect', 401));
  }
  admin.password = null;
  // Assign Token Value
  const token = signToken(admin.id);
  const contractor = await Contractor.find({}).populate('gigs');
  res.status(200).json({
    status: 'success',
    token,
    data: { admin, contractor },
  });
});
//!--------------

// Protect
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await Contractor.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.contractor = currentUser;
  next();
});
