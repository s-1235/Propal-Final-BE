const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');

//  1)Get User
exports.getUser = catchAsync(async (req, res) => {
  const user = await User.findById({ _id: req.params.id }); //find user

  await user.populate('properties'); //populate the properties field
  await user.populate('jobs')
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

//  2)Get All User
exports.getAllUser = async (req, res) => {
  res.status(200).send('Get All User from database');
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
    status: 'success',
    data: {
      user,
    },
  });
});

//  5)Delete User
exports.updateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});
