const mongoose = require('mongoose');

const express = require('express');
const router = express.Router();

const Order= require('../models/order');
const Product= require('../models/product');


//Get All Orders

exports.get_all_orders = (req,res,next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product')
    .exec()
    .then(docs => {
         res.status(200).json({
            count : docs.length,
            orders:docs.map(doc =>{
                 return {
                    _id : doc._id,
                    product: doc.product,
                    quantity:doc.quantity,
                    request : {
                         type:'GET',
                         url:'http://localhost:3000/orders/' + doc._id
                    }
                 }
            })
         });
    })
    .catch(err => {
         res.status(500).json({
            error:err
         });
    });
}

// Post OR Create Orders 
exports.create_orders = (req,res,next) => {
    Product.findById(req.body.productId)
    .then(product => {
       if(!product)
       {
           return res.status(404).json({
               message : "Product Not Found"
           });
       }
       const order = new  Order({
           _id: new mongoose.Types.ObjectId(),
           quantity: req.body.quantity,
           product: req.body.productId
       });
       return order.save();
    })
    .then( result => {
       console.log(result);
       res.status(201).json({
           message : "Order Stored ",
           createdOrder : {
                _id : result._id,
                product : result.product,
                quantity:result.quantity
           },
           request : {
               type:'GET',
               url :'http://localhost:3000/orders' + result._id
           }
       });
  })
  .catch(err =>{
      console.log(err);  
      res.status(500).json({
          error:err
      });
  });
}

// Order Single Product 

exports.get_single_order = (req,res,next) => {
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
       if(!order){
           return res.status(404).json({
               message:"No Order Found",
           });
       }
        res.status(200).json({
           order:order,
           request:{
               type : 'GET',
               url : 'http://localhost:3000/orders'
           }
        });
    })
    .catch(err =>{
       res.status(500).json({
           error:err
       });
    });
}

// Delete Orders By Order Id

exports.delete_order = (req,res,next) => {
    Order.deleteOne({_id: req.params.orderId})
    .exec()
    .then(result => {
      res.status(200).json({
      message : "Oeder Removed !",
         request:{
          type:'POST',
          url: "http://localhost:3000/orders/",
          body:{productId:'ID', quantity: 'Number'}
         }
      });
    })
    .catch(err => {
        res.status(500).json({
             error:err
        });
    });
}