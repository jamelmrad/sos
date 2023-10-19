var express = require('express');
var router = express.Router();
const { Login, LogoutMobile, LoginMobile,  } = require('../controllers/authentication');
const { userVerification } = require('../middlewares/AuthMiddleware');
//auth routes
router.post('/', userVerification)
router.post('/login', Login)
router.post('/login-mobile', LoginMobile)
router.post('/logout-mobile', LogoutMobile)

module.exports = router;
