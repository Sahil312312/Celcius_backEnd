const express = require("express");
const userController = require('./../controllers/userController')
const router = express.Router();
const checkUserAuth = require("../middlewares/auth-middleware")
const otpAuth = require("../middlewares/otpAuth")
const emailAuth = require("../middlewares/verifyAuth")

// ROute Level Middleware - To Protect Route
router.use('/changepassword', checkUserAuth)
router.use('/loggeduser', checkUserAuth)


router.use('/checkOtp', otpAuth )

router.use('/register', emailAuth )
////Harsh 



router.post('/register', userController.userRegistration)
router.post('/login', userController.userLogin)
router.post('/changepassword', userController.changeUserPassword)
router.get('/loggeduser', userController.loggedUser)
router.post('/send-reset-password-email', userController.sendUserPasswordResetEmail)
router.post('/reset-password/:id/:token', userController.userPasswordReset)
router.post('/sendOtp',userController.OtpsenderAndpassobjects)
router.post('/checkOtp',userController.checkotp)

module.exports = router;
