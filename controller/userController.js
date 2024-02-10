const { User } = require("../models/User.js");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const nodemailer = require("nodemailer");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const ValidateRegister = async (data) => {
  const schema = Joi.object({
    first_name: Joi.string().min(3).max(30).required(),
    last_name: Joi.string().min(3).max(30).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } })
      .required(),
    phone_number: Joi.number().min(1000000000).max(9999999999).required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    confirm_password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    user_roll: Joi.string().required(),
  });
  return schema.validateAsync(data);
};

async function AdminExists() {
  const count = await User.countDocuments({ user_roll: "Admin" });
  return count < 1;
}

const RegisterUser = async (req, res) => {
  try {
    const data = req.body;
    const result = await ValidateRegister(data);
    if (result.error) {
      const validationErrors = result.error.details.map(
        (error) => error.message
      );
      return res.status(400).json({ message: validationErrors });
    }
    const userExists = await User.findOne({
      $or: [{ email: result.email }, { phone_number: result.phone_number }],
    });
    if (!(await AdminExists()) && result.user_roll === "Admin") {
      return res.status(400).json({ message: "Cann't create Multipal Admin!" });
    }
    if (userExists && userExists.user_roll === result.user_roll) {
      return res.status(400).json({ message: "user already exists!" });
    }
    if (result.password !== result.confirm_password) {
      return res
        .status(400)
        .json({ message: "password and confirm password doesn't match!" });
    }

    const hashedpassword = await bcrypt.hash(result.password, 10);
    result.password = hashedpassword;
    const userDetail = await new User({
      ...result,
    });
    userDetail.save();

    // send mail start
    const emailTemplate = fs.readFileSync("main.html", "utf-8");
    const emailContent = emailTemplate.replace("<%= email %>", result.email);

    var transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sendmailm6@gmail.com",
        pass: "breu nlyd ztmw ujap",
      },
    });

    var mailOptions = {
      from: "sendmailm6@gmail.com",
      to: result.email,
      subject: "Sending Email using Node.js",
      html: emailContent,
    };
    await transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    // send mail end

    return res
      .status(200)
      .json({ message: "user Created successfully!", data: userDetail });
  } catch (error) {
    return res.status(500).json({
      message: "server error while registering user!",
      error: error.message,
    });
  }
};

const VerifyAccount = async (req, res) => {
  try {
    console.log("hello");
    const { email } = req.body;
    console.log("hello", email);
    const verifyEmail = await User.findOne({ email: email });
    if (!verifyEmail) {
      return res.status(400).json({ message: "Cann't verify email!" });
    }
    verifyEmail.isVerified = true;

    await verifyEmail.save();
    return res
      .status(200)
      .json({ message: "Account verified successfully", verifyEmail });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "please fill required information" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Cann't find email!" });
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: "Account is not verified!" });
    }
    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res
        .status(400)
        .json({ msg: "username or password doesn't match" });
    }
    let token = await jwt.sign({ user }, process.env.TOKEN_KEY, {
      expiresIn: "24h",
    });
    return res.status(200).json({
      msg: "Login successfully",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "not able to Login internal server error!",
      error: error,
    });
  }
};

module.exports = { RegisterUser, VerifyAccount, LoginUser };
