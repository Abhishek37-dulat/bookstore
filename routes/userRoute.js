const express = require("express");
const {
  RegisterUser,
  VerifyAccount,
  LoginUser,
} = require("../controller/userController.js");

const router = express.Router();

router.post("/", RegisterUser);
router.post("/login", LoginUser);
router.post("/verify-account", VerifyAccount);

module.exports = router;
