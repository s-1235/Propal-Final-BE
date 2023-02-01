const express = require("express");
const {
  getUser,
  getAllUser,
  createUser,
  deleteUser,
  searchUser,
} = require("./../controllers/userController");
const { protect } = require("./../controllers/authController");
const {
  signUp,
  login,
  getMe,
  updateMe,
} = require("./../controllers/authController");

const router = express.Router(); //Initialize Router
router.route("/login").post(login);
router.route("/signup").post(signUp);
router.route("/search").get(searchUser);
router.use(protect);
router.route("/").get(getAllUser).post(createUser); // Routing for user/
router.route("/me").get(getMe);
router.route("/:id").get(getUser);
router.route("/updateMe").patch(updateMe);
router.route("/:id").patch().delete(deleteUser); // Routing for user/any-id-here

module.exports = router;
