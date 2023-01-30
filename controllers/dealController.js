const catchAsync = require("../utils/catchAsync");
const Deal = require("./../models/dealModel");

//  1)Get Agent
exports.getDeal = catchAsync(async (req, res) => {
  const deal = await Deal.findById({ _id: req.params.id }); //find agent

  res.status(200).json({
    status: "success",
    data: {
      deal,
    },
  });
});

//  2)Get All agents
exports.getAllDeals = async (req, res) => {
  const deals = await Deal.find(); //find user
  console.log(deals);
  console.log("In Agent");
  // await contractors.populate('gigs') //populate the properties field

  res.status(200).json({
    status: "success",
    data: {
      deals,
    },
  });
};

//  2)Get All agents
exports.getMyDeals = async (req, res) => {
  let deals;
  console.log(req.user);
  if (req.user.userType === "user") {
    deals = await Deal.find({ client: { $eq: req.user._id } }); //find user
  } else {
    console.log("here checking");
    deals = await Deal.find({ client: { $eq: req.user._id } });
  }
  console.log(deals);

  res.status(200).json({
    status: "success",
    data: {
      deals,
    },
  });
};

//  3)Create Deal
exports.createDeal = async (req, res) => {
  const deal = await Deal.create(req.body);
  console.log(req.body);
  res.status(200).json({
    status: "success",
    data: {
      deal,
    },
  });
};

//  4)Patch Deal
exports.deleteDeal = catchAsync(async (req, res, next) => {
  // res.status(200).send('Update User in database');
  const deal = await Deal.findByIdAndDelete(req.params.id, { new: true });

  res.status(201).json({
    status: "success",
    data: {
      deal,
    },
  });
});

//  5)Delete Agent
exports.updateDeal = catchAsync(async (req, res) => {
  const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(201).json({
    status: "success",
    data: {
      deal,
    },
  });
});

exports.ApproveDeal = catchAsync(async (req, res) => {
  const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(201).json({
    status: "success",
    data: {
      deal,
    },
  });
});
