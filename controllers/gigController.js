//Property Model Object from propertyModel file
// const { findByIdAndUpdate } = require('../models/userModel');
const Contractor = require("../models/contractorModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Gig = require("../models/gigModel");
const multer = require("multer");
const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadGigImages = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 6 },
]);

exports.resizeGigImages = catchAsync(async (req, res, next) => {
  if (!req.files.coverImage || !req.files.images) return next();
  console.log("sadam ki ...........");
  // 1) Cover image
  req.body.coverImage = `gig-${
    req.params.contractorId
  }-${Date.now()}-cover.jpeg`;
  await sharp(req.files.coverImage[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/gigs/${req.body.coverImage}`);

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `gig-${req.params.contractorId}-${Date.now()}-${
        i + 1
      }.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/gigs/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.createGig = catchAsync(async (req, res) => {
  const data = { postedBy: req.params.contractorId, ...req.body };
  console.log("ye data h", data);
  const gig = await Gig.create(data);
  console.log(gig);
  const contractor = await Contractor.findByIdAndUpdate(
    { _id: req.params.contractorId },
    { $push: { gigs: gig._id } },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    data: {
      gig,
      contractor,
    },
  });
});

// Search Property
exports.searchGig = catchAsync(async (req, res) => {
  const key = req.params.key;
  // const property = await Property.find({
  //   $or: [
  //     { title: { $regex: key } },
  //     { description: { $regex: key } },
  //     { detailedAddress: { $regex: key } },
  //     { propertyType: { $regex: key } },
  //   ],
  // });
  console.log(`searched data ${req.params.key}`);

  var features;
  if (key === "all") {
    features = new APIFeatures(Gig.find({}), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
  } else {
    features = new APIFeatures(
      Gig.find({
        $or: [
          { title: { $regex: key } },
          { description: { $regex: key } },
          { types: { $regex: key } },
        ],
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
  }
  const gig = await features.query;
  // await gig.populate('postedBy')

  res.status(201).json({
    status: "success",
    data: {
      gig,
    },
  });
});

// Get property by id
exports.getGig = catchAsync(async (req, res) => {
  const gig = await Gig.findById(req.params.contractorId).select("-postedBy"); // find property in database by id

  res.status(201).json({
    status: "success",
    data: {
      gig,
    },
  });
});

// Get All Properties
exports.getAllGig = catchAsync(async (req, res) => {
  // const property = await Property.find({}); // find all properties from database

  const features = new APIFeatures(Gig.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const gig = await features.query;

  res.status(201).json({
    status: "success",
    data: {
      gig,
    },
  });
});

//Update Property by Id

exports.updateGig = catchAsync(async (req, res) => {
  const gig = await Gig.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(201).json({
    status: "success",
    data: {
      gig,
    },
  });
});

// Delete property by Id
exports.deleteGig = catchAsync(async (req, res) => {
  const gig = await Gig.findByIdAndDelete(req.params.id, {
    new: true,
  });
  //Deleting property from user refernce is pending

  res.status(201).json({
    status: "success",
    data: {
      gig,
    },
  });
});
