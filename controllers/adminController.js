const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const Contractor = require('../models/contractorModel');
const Agency = require('../models/agencyModel');
exports.adminData = catchAsync(async (req, res, next) => {
  const users = await User.find({}).populate('properties');
  const contractors = await Contractor.find({});
  const agencies = await Agency.find({});
  res.status(200).json({
    status: 'success',
    adminData: { users, contractors, agencies },
  });
});
