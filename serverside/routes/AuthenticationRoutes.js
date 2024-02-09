const { Router } = require("express");
const { Auth } = require("../middlewares/auth");
const {
  registerUser,
  loginUser,
  verifyOtpToRegister,
  resendOtpToRegister,
  user_forgotPassword,
  user_resetPassword,
  getUser,
} = require("../controllers/authentication");
const router = Router();

router.route("/register").post(registerUser); // register user
router.route("/verifyOtp").post(verifyOtpToRegister);
router.route("/getUser").get(Auth, getUser);
router.route("/resendOtp").post(resendOtpToRegister);
router.route("/login").post(loginUser); // login user
router.route("/forgotPassword").post(user_forgotPassword);
router.route("/resetPassword").post(user_resetPassword);

module.exports = router;
