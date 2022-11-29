const express = require('express');
// const authController = require('./../controllers/contractorAuthentication');
const {
  createJob,
  getJob,
//   getAllJo,
  updateJob,
  deleteJob,
  searchJob,
  uploadJobImages,
  resizeJobImages,
} = require('./../controllers/job');

const router = express.Router(); // Initialize the Router

// router.route('/').get(getAllGig); // for localhost/property
router.route('/search/:key').get(searchJob); // for localhost/property/search/key


router
  .route('/:userId')
  .post(
    // authController.protect,
    uploadJobImages,
    resizeJobImages,
    createJob
  );


router
  .route('/:userId')
  .get(getJob)
  .patch(updateJob)
  .delete(deleteJob); // for localhost/property/any-id-here

module.exports = router;
