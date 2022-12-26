const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");
exports.adminData = catchAsync(async (req, res, next) => {
  const users = await User.find({}).populate("properties");
  res.status(200).json({
    status: "success",
    adminData: { users },
  });
});
