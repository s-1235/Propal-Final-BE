const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Contractor = require("../models/contractorModel");

//  1)Get User
exports.getContractor = catchAsync(async (req, res) => {
  const user = await Contractor.findById({ _id: req.params.id }); //find user

  await user.populate("gigs"); //populate the properties field
  await user.populate("jobs");
  console.log(user);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

//  2)Get All User
exports.getAllContractors = catchAsync(async (req, res) => {
  const users = await Contractor.find().select([
    "-properties",
    "-gigs",
    "-jobs",
  ]); //find user
  console.log(users);
  // await contractors.populate('gigs') //populate the properties field

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

//  3)Create User
exports.createContractor = async (req, res) => {
  const contractors = await Contractor.create(req.body);
  console.log(req.body);
};

//  4)Patch User
exports.deleteContractor = catchAsync(async (req, res, next) => {
  // res.status(200).send('Update User in database');
  const contractor = await Contractor.findByIdAndDelete(req.params.id, {
    new: true,
  });

  res.status(201).json({
    status: "success",
    data: {
      contractor,
    },
  });
});

//  5)Delete User
// exports.updateContractor = catchAsync(async (req, res) => {
//   const contractor = await Contractor.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     {
//       new: true,
//     }
//   );

//   res.status(201).json({
//     status: "success",
//     data: {
//       contractor,
//     },
//   });
// });
