const express = require("express");
const {
  getAllDeals,
  getDeal,
  deleteDeal,
  createDeal,
  updateDeal,
} = require("../controllers/dealController");
const { protect } = require("../controllers/authController");
const router = express.Router(); //Initialize Router
router.use(protect);
router.route("/").get(getAllDeals).post(createDeal); // Routing for user/

router.route("/:id").get(getDeal).delete(deleteDeal).patch(updateDeal); // Routing for user/any-id-here

module.exports = router;
