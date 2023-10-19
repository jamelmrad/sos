const resetPassword = require("../controllers/resetPassword")
var express = require('express');
var router = express.Router();
//reset pwd routes
router.post("/", resetPassword.resetPassword)
router.post("/send", resetPassword.send)
router.post("/send-mobile", resetPassword.sendSMSReset)
router.post("/reset-mobile", resetPassword.resetPasswordMobile)
router.post("/verif-reset", resetPassword.verifResetPasswordMobile)


module.exports = router;