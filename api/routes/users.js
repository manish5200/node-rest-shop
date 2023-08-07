const express = require('express');
const router = express.Router(); 
const checkAuth = require('../middleware/check-auth');
const User = require("../models/user");

const UserContoroller = require('../appController/users');

//SignUp
router.post("/signup",UserContoroller.user_signup );
//LogIn
router.post('/login', UserContoroller.user_login);
//Delete Account
router.delete('/:userId',checkAuth,UserContoroller.delete_account);

module.exports = router;