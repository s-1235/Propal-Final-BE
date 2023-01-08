const express = require("express");
const {
  getAgent,
  getAllAgents,
  createAgent,
  deleteAgent,
  getMe,
  updateMe,
} = require("./../controllers/agentController");
// const { protect } = require("./../controllers/authController");
const propertyRouter = require("./propertyRouter");
const { signUp, login, protect } = require("./../controllers/authController");

const router = express.Router(); //Initialize Router
router.route("/login").post(login);
router.route("/signup").post(signUp);
router.use(protect);
router.use("/:userId/properties", propertyRouter);
router.route("/").get(getAllUser).post(createUser); // Routing for user/
router.route("/me").get(getMe);
router.route("/updateMe").patch(updateMe);
router.route("/:id").get(getUser).patch().delete(deleteUser); // Routing for user/any-id-here

module.exports = router;
