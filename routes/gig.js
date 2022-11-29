const express = require('express');
const authController = require('./../controllers/contractorAuthentication');
const {
  createGig,
  getGig,
  getAllGig,
  updateGig,
  deleteGig,
  searchGig,
  uploadGigImages,
  resizeGigImages,
} = require('./../controllers/gig');

const router = express.Router(); // Initialize the Router

router.route('/').get(getAllGig); // for localhost/property
router.route('/search/:key').get(searchGig); // for localhost/property/search/key


router
  .route('/:contractorId')
  .post(
    // authController.protect,
    uploadGigImages,
    resizeGigImages,
    createGig
  );


router
  .route('/:contractorId')
  .get(getGig)
  .patch(updateGig)
  .delete(deleteGig); // for localhost/property/any-id-here

module.exports = router;
