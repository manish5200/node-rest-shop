const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
//console.log('JWT Secret Key:', process.env.JWT_KEY);

const User = require("../models/user");

exports.user_signup =async (req, res, next) => {
    try {
      const existingUser = await User.findOne({ email: req.body.email });
  
      if (existingUser) {
        return res.status(409).json({ 
            message: "Mail Exists" 
        });
      }else {
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash,
        });
        const result = await user.save();
        console.log(result);
        res.status(201).json({ message: 'User Created' });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
  }

exports.user_login = async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email }).exec();
  
      if (!user) {
        return res.status(401).json({
          message: 'Authentication Failed: Enter a valid email & password',
        });
      }
  
      const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({
          message: 'Authentication Failed: Enter a valid email & password',
        });
      }
  
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        process.env.JWT_KEY, // Use the JWT secret key from environment variable
        {
          expiresIn: '1h', // The token will expire in 1 hour
        }
      );
  
      console.log('Generated Token:', token); // Log the generated token for debugging purposes
  
      return res.status(200).json({
        message: 'Authentication Successful',
        token: token, // Commented out token for debugging, not sending it in the response
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: err,
      });
    }
  }

exports.delete_account = (req,res,next) => {
    User.deleteOne({_id : req.params.userId}) 
   .exec()
   .then(result => {
        res.status(200).json({
            message:"User Deleted"
        });
   })
   .catch( err => {
         console.log(err);
         res.status(500).json({
            error:err
         });
   });     
}