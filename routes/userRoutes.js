const express = require("express");
const userController = require('./../controllers/userController')
const router = express.Router();
const checkUserAuth = require("../middlewares/auth-middleware")

// ROute Level Middleware - To Protect Route
router.use('/changepassword', checkUserAuth)
router.use('/loggeduser', checkUserAuth)




router.post('/register', userController.userRegistration)
router.post('/login', userController.userLogin)
router.post('/changepassword', userController.changeUserPassword)
router.get('/loggeduser', userController.loggedUser)
router.post('/send-reset-password-email', userController.sendUserPasswordResetEmail)
router.post('/reset-password/:id/:token', userController.userPasswordReset)

module.exports = router;
