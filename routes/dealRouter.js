const express = require("express");
const {
  getAllDeals,
  getDeal,
  deleteDeal,
  createDeal,
  updateDeal,
  getMyDeals,
  ApproveDeal,
} = require("../controllers/dealController");
const { protect } = require("../controllers/authController");
const router = express.Router(); //Initialize Router
router.use(protect);
router.route("/mydeals").get(getMyDeals);
router.route("/").get(getAllDeals).post(createDeal); // Routing for user/
router.route("/approvedeal/:id").patch(ApproveDeal);
router.route("/:id").get(getDeal).delete(deleteDeal).patch(updateDeal); // Routing for user/any-id-here
module.exports = router;
