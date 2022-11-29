//Property Model Object from propertyModel file
// const { findByIdAndUpdate } = require('../models/userModel');
const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Job = require('./../models/job');
const multer = require('multer');
const sharp = require('sharp');


const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadJobImages = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'images', maxCount: 6 },
]);

exports.resizeJobImages = catchAsync(async (req, res, next) => {
  if (!req.files.coverImage || !req.files.images) return next();

  // 1) Cover image
  req.body.coverImage = `job-${
    req.params.userId
  }-${Date.now()}-cover.jpeg`;
  await sharp(req.files.coverImage[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/job/${req.body.coverImage}`);

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `job-${req.params.userId}-${Date.now()}-${
        i + 1
      }.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/job/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.createJob = async (req, res) => {
  const data = { postedBy: req.params.userId, ...req.body };
  // console.log(data);
  const job = await Job.create(data);

  const user = await User.findByIdAndUpdate(
    { _id: req.params.userId },
    { $push: { jobs: job._id } },
    { new: true }
  );

  res.status(201).json({
    status: 'success',
    data: {
        job,
        user,
    },
  });
};

// Search Property
exports.searchJob = catchAsync(async (req, res) => {
  const key = req.params.key;
  // const property = await Property.find({
  //   $or: [
  //     { title: { $regex: key } },
  //     { description: { $regex: key } },
  //     { detailedAddress: { $regex: key } },
  //     { propertyType: { $regex: key } },
  //   ],
  // });

  var features;
  if (key === 'all') {
    features = new APIFeatures(Job.find({}), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
  } else {
    features = new APIFeatures(
      Job.find({
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
  const job = await features.query;
  // await gig.populate('postedBy')

  res.status(201).json({
    status: 'success',
    data: {
      job,
    },
  });
});

// Get property by id
exports.getJob = catchAsync(async (req, res) => {
  const job = await Job.findById(req.params.id); // find property in database by id

  res.status(201).json({
    status: 'success',
    data: {
      job,
    },
  });
});

// Get All Properties
// exports.getAllGig = catchAsync(async (req, res) => {
//   // const property = await Property.find({}); // find all properties from database

//   const features = new APIFeatures(Gig.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   const gig = await features.query;

//   res.status(201).json({
//     status: 'success',
//     data: {
//       gig,
//     },
//   });
// });

//Update Property by Id

exports.updateJob = catchAsync(async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(201).json({
    status: 'success',
    data: {
      job,
    },
  });
});



// Delete property by Id
exports.deleteJob = catchAsync(async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id, {
    new: true,
  });
  //Deleting property from user refernce is pending

  res.status(201).json({
    status: 'success',
    data: {
      job,
    },
  });
});

