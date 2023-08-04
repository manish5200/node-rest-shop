const express = require('express');
const router = express.Router(); //
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require("../models/user");

router.post("/signup", async (req, res, next) => {
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
  });

  router.delete('/:userId',(req,res,next) => {
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
  });

module.exports = router; 