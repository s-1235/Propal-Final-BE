const express = require("express");
const {
  getAllAgencies,
  getAgency,
  deleteAgency,
  updateAgency,
} = require("../controllers/agencyController");
// const { protect } = require("../controllers/authController");
const router = express.Router(); //Initialize Router
router.route("/").get(getAllAgencies); // Routing for user/

router.route("/:id").get(getAgency).delete(deleteAgency); // Routing for user/any-id-here

module.exports = router;
