const express = require("express");
const authController = require("./../controllers/authController");
const {
  createProperty,
  getProperty,
  getAllProperty,
  updateProperty,
  updateProperty_,
  deleteProperty,
  unApprovedProperties,
  aliasLatestBuy,
  aliasLatestRent,
  searchProperty,
  approveProperty,
  uploadPropertyImages,
  resizePropertyImages,
  getAUserProperties,
} = require("./../controllers/propertyController.js");

const router = express.Router(); // Initialize the Router

router.route("/").get(getAllProperty); // for localhost/property
router.route("/search").get(searchProperty); // for localhost/property/search/key
router.route("/latest-property-buy").get(aliasLatestBuy, getAllProperty);
router.route("/latest-property-rent").get(aliasLatestRent, getAllProperty);

router.route("/:userId").post(
  // authController.protect,
  uploadPropertyImages,
  resizePropertyImages,
  createProperty
);

router.route("/approve/:id").patch(approveProperty);
router.get("/userproperties/:id", getAUserProperties);

router.route("/unApprovedProperties").get(unApprovedProperties);
router
  .route("/:id")
  .get(getProperty)
  .patch(updateProperty_)
  .delete(deleteProperty); // for localhost/property/any-id-here

module.exports = router;
