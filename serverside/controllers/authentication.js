const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const sendMail = require("../utils/sendMail");
const OtpModel = require("../models/Otp");

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //  email format validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    if (password.length < 5) {
      return res
        .status(400)
        .json({ message: "Password must be at least 5 characters long." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already Exist", status: "no" });
    } else {
      const otp = generateOtp();
      const otpPayload = {
        email: email,
        otp: otp,
      };

      const newOtp = await OtpModel.create(otpPayload);

      await newOtp.save();

      await sendMail(
        email,
        "Verification Email",
        `<h1>Please confirm your OTP</h1>
       <p>Here is your OTP code: <span style="color:blue">${otp}</span> </p>`
      );

      res
        .status(200)
        .send({ message: "OTP is sent to your account please verify" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const email = req.body.email.trim();
    const password = req.body.password.trim();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res.status(400).json({ message: "Password doesn't Matched...!" });
    }

    const authToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      msg: "Login Successful...",
      username: user.username,
      token: authToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const generateOtp = () => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  return otp;
};

const getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  if (user) {
    return res.status(200).json(user);
  }
  return res.status(500).json({ message: "Internal server error" });
};

const verifyOtpToRegister = async (req, res) => {
  const { otp, email, username, password } = req.body;
  // password minimum length validation

  const response = await OtpModel.find({ email })
    .sort({ createdAt: -1 })
    .limit(1);
  if (response.length === 0 || otp !== response[0].otp) {
    return res.status(400).json({
      success: false,
      message: "The OTP is not valid",
    });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Generate a unique verification token

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  const authToken = jwt.sign(
    {
      userId: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return res.status(200).json({
    message: "User Registered Successfully",
    user: newUser,
    token: authToken,
  });
};

const resendOtpToRegister = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOtp();
    const otpPayload = {
      email: email,
      otp: otp,
    };

    const newOtp = await OtpModel.create(otpPayload);

    await newOtp.save();

    await sendMail(
      email,
      "Verification Email",
      `<h1>Please confirm your OTP</h1>
       <p>Here is your OTP code: <span style="color:blue">${otp}</span> </p>`
    );

    res
      .status(200)
      .send({ message: "OTP is sent to your account please verify" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

const user_forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not exists!" });
  }
  const otp = generateOtp();
  const otpPayload = {
    email: email,
    otp: otp,
  };

  const newOtp = await OtpModel.create(otpPayload);

  await newOtp.save();

  await sendMail(
    email,
    "Otp to Reset password.",
    `<h1>Please confirm your OTP to reset the password</h1>
       <p>Here is your OTP code: <span style="color:blue">${otp}</span> </p>`
  );

  res.status(200).send({ message: "OTP is sent to your email account." });
};

const user_resetPassword = async (req, res) => {
  try {
    const { otp, email, newPassword } = req.body;
    // password minimum length validation

    const response = await OtpModel.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }
    if (newPassword.length < 5) {
      return res
        .status(400)
        .json({ message: "Password must be at least 5 characters long." });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const updatedUser = await User.updateOne(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );
    res
      .status(201)
      .json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  generateOtp,
  verifyOtpToRegister,
  resendOtpToRegister,
  user_forgotPassword,
  user_resetPassword,
  getUser,
};
