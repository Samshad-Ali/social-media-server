const auth = require('express').Router();
const {signUpController,refreshAccessTokenController,loginController, logoutController} = require('../controller/authController')
const authMiddlerware = require('../middleware/authMiddleware')
auth.post('/signup',authMiddlerware,signUpController);
auth.post('/login',authMiddlerware,loginController)
auth.get('/refresh',refreshAccessTokenController)
auth.post('/logout',logoutController)
module.exports = auth;