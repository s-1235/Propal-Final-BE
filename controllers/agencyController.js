const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Agency = require("./../models/agencyModel");

//  1)Get agency
exports.getAgency = catchAsync(async (req, res) => {
  const agency = await Agency.findById({ _id: req.params.id }); //find agency

  await agency.populate("properties"); //populate the properties field
  res.status(200).json({
    status: "success",
    data: {
      agency,
    },
  });
});

//  2)Get All agency
exports.getAllAgencies = async (req, res) => {
  const users = await Agency.find(); //find user
  console.log(users);
  // await contractors.populate('gigs') //populate the properties field

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
};

//  3)Create agency
exports.createAgency = async (req, res) => {
  const agency = await Agency.create(req.body);
  console.log(req.body);
};

//  4)Patch Agency
exports.deleteAgency = catchAsync(async (req, res, next) => {
  // res.status(200).send('Update User in database');
  const user = await Agency.findByIdAndDelete(req.params.id, { new: true });

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

//  5)Delete User
exports.updateAgency = catchAsync(async (req, res) => {
  const agency = await Agency.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(201).json({
    status: "success",
    data: {
      agency,
    },
  });
});
