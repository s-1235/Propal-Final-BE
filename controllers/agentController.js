const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Agency = require("./../models/agencyModel");
const Agent = require("./../models/agentModel");

//  1)Get Agent
exports.getAgent = catchAsync(async (req, res) => {
  const agent = await Agent.findById({ _id: req.params.id }); //find agent

  await agent.populate("properties"); //populate the properties field
  await agent.populate("jobs");
  res.status(200).json({
    status: "success",
    data: {
      agent,
    },
  });
});

//  2)Get All agents
exports.getAllAgents = async (req, res) => {
  const users = await Agent.find(); //find user
  console.log(users);
  console.log("In Agent");
  // await contractors.populate('gigs') //populate the properties field

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
};

//  3)Create Agent
exports.createAgent = async (req, res) => {
  const agent = await Agent.create(req.body);
  console.log(req.body);
};

//  4)Patch Agent
exports.deleteAgent = catchAsync(async (req, res, next) => {
  // res.status(200).send('Update User in database');
  const agent = await Agent.findByIdAndDelete(req.params.id, { new: true });

  res.status(201).json({
    status: "success",
    data: {
      agent,
    },
  });
});

//  5)Delete Agent
exports.updateagent = catchAsync(async (req, res) => {
  const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(201).json({
    status: "success",
    data: {
      agent,
    },
  });
});
