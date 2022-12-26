//Property Model Object from propertyModel file
const { findByIdAndUpdate } = require("../models/userModel");
const User = require("../models/userModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Property = require("./../models/propertyModel");
const multer = require("multer");
const sharp = require("sharp");
//Create Property

// exports.createProperty = catchAsync(async (req, res) => {
//   const property = await Property.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       property,
//     },
//   });
// });

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

exports.uploadPropertyImages = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 6 },
]);

exports.resizePropertyImages = catchAsync(async (req, res, next) => {
  console.log(req.files.images);
  if (!req.files.coverImage || !req.files.images) return next();

  // 1) Cover image
  req.body.coverImage = `property-${
    req.params.userId
  }-${Date.now()}-cover.jpeg`;
  await sharp(req.files.coverImage[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/properties/${req.body.coverImage}`);

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `property-${req.params.userId}-${Date.now()}-${
        i + 1
      }.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/properties/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});
//!==========Property Image Uploads
exports.aliasLatestBuy = (req, res, next) => {
  req.query.limit = "2";
  req.query.sort = "-createdAt,-price";
  // req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  req.query.propertyFor = "buy";
  next();
};
exports.aliasLatestRent = (req, res, next) => {
  req.query.limit = "2";
  req.query.sort = "-createdAt,-price";
  // req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  req.query.propertyFor = "rent";
  next();
};

exports.createProperty = catchAsync(async (req, res) => {
  // console.log(req.body);

  const data = { postedBy: req.params.userId, ...req.body };
  // console.log(data);
  const property = await Property.create(data);

  const user = await User.findByIdAndUpdate(
    { _id: req.params.userId },
    { $push: { properties: property._id } },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    data: {
      property,
      user,
    },
  });
});

// Search Property
// exports.searchProperty = catchAsync(async (req, res) => {
//   const key = req.params.key;
//   // const property = await Property.find({
//   //   $or: [
//   //     { title: { $regex: key } },
//   //     { description: { $regex: key } },
//   //     { detailedAddress: { $regex: key } },
//   //     { propertyType: { $regex: key } },
//   //   ],
//   // });

//   var features;
//   if (key === 'all') {
//     features = new APIFeatures(Property.find({}), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();
//   } else {
//     features = new APIFeatures(
//       Property.find({
//         $or: [
//           { title: { $regex: key } },
//           { description: { $regex: key } },
//           { detailedAddress: { $regex: key } },
//           { propertyType: { $regex: key } },
//         ],
//       }),
//       req.query
//     )
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();
//   }
//   const property = await features.query;

//   res.status(201).json({
//     status: 'success',
//     data: {
//       property,
//     },
//   });
// });
exports.searchProperty = catchAsync(async (req, res) => {
  console.log("In Search Properties");
  const key = JSON.parse(req.query.searchdata);
  console.log(key);
  // const property = await Property.find({
  //   $or: [
  //     { title: { $regex: key } },
  //     { description: { $regex: key } },
  //     { detailedAddress: { $regex: key } },
  //     { propertyType: { $regex: key } },
  //   ],
  // });

  let features;
  if (key === "all") {
    features = new APIFeatures(Property.find({}), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
  } else {
    features = new APIFeatures(
      Property.find({
        $or: [
          { subCategory: { $regex: key.subCategory } },
          { province: { $regex: key.province, $options: "i" } },
          { city: { $regex: key.city, $options: "i" } },
          { area: { $regex: key.area, $options: "i" } },
        ],
        category: { $eq: key.category },
        subCategory: { $eq: key.subCategory },
        active: { $ne: false },
      }),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
  }
  const properties = await features.query;

  res.status(201).json({
    status: "success",
    data: {
      properties,
    },
  });
});
// Get property by id
exports.getProperty = catchAsync(async (req, res) => {
  const property = await Property.findById(req.params.id); // find property in database by id
  console.log(property);
  res.status(201).json({
    status: "success",
    data: {
      property,
    },
  });
});

// Get All Properties
exports.getAllProperty = catchAsync(async (req, res) => {
  // const property = await Property.find({}); // find all properties from database

  const features = new APIFeatures(Property.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const property = await features.query;

  res.status(201).json({
    status: "success",
    data: {
      property,
    },
  });
});

//Update Property by Id

exports.updateProperty = catchAsync(async (req, res) => {
  const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(201).json({
    status: "success",
    data: {
      property,
    },
  });
});

//Approve Property by Id
exports.approveProperty = catchAsync(async (req, res) => {
  const property = await Property.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "success",
    data: {
      property,
    },
  });
});

// Delete property by Id
exports.deleteProperty = catchAsync(async (req, res) => {
  const property = await Property.findByIdAndDelete(req.params.id, {
    new: true,
  });
  //Deleting property from user refernce is pending

  res.status(201).json({
    status: "success",
    data: {
      property,
    },
  });
});

///API Features

exports.unApprovedProperties = catchAsync(async (req, res) => {
  const properties = await Property.aggregate([
    {
      $match: { isApproved: false },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      properties,
    },
  });
});
