const express = require('express');
const router = express.Router(); 
const mongoose =require('mongoose');

const Product = require('../models/product');

router.get("/" , (req, res,next) => {   // Only / not /products beacause  that will be /products/products when called from app.js
       
       Product.find()
       .select('name price _id') // controlling which data you want to fetch
       .exec()
       .then(docs => {
        // console.log(docs);
       const response ={
       count : docs.length,
       products: docs.map(doc =>{
        return {
        name:doc.name,
        price:doc.price,
        _id:doc._id,
        request: {
            type :'GET',
            url:'http://localhost:3000/products/' + doc._id
          }
         }
       })
        };
        // if(docs.length>=0){
        res.status(200).json(response);
        // }else{
        //     res.status(404).json({
        //         message: 'No entries found'
        //     });
        // }
       })
       .catch(err => {
        console.log(err);
        res.status(500).json({
         error:err
        });
       });
}); 
router.post("/" , (req, res,next) => {
    
    const product = new Product({
          _id : new mongoose.Types.ObjectId(),
          name :req.body.name,
          price:req.body.price 
    });
    product.save()
    .then(result => { //store in the database
        console.log(result);
        res.status(201).json({
            massege: 'Created Product =>Done' ,
            createdProduct: {
                name : result.name,
                price:result.price,
                _id:result._id,
                request: {
                    type: 'GET',
                    url:"http://localhost:3000/products/" + result._id
                }
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
         error:err
        });
    });
  
});  

router.get('/:productId', (req,res,next) => {
    const id =req.params.productId;
    Product.findById(id)
    .select('name price _id')
    .exec()
    .then(doc =>{
        console.log("From Database",doc);
        if(doc){
            res.status(200).json({
                product:doc,
                request:{
                    type:'GET',
                    Details:'Something Interesting',
                    url:'http://localhost:3000/products'
                }
            });
        }else{
            res.status(404).json({message : "No Valid Entry Found for the Provided ID"});
        }
    })
    .catch(err =>{ 
    console.log(err);
    res.status(500).json({
        error:err
       });
    });
});

router.patch('/:productId', (req,res,next) => { //Update Product
      const id =req.params.productId;
      //const updateProd ={};
    //   for(const upds of req.body)
    //   {
    //     updateProd[upds.propName] = upds.value;
    //   }
      Product.findByIdAndUpdate(id, {$set:req.body},{new:true})
      .exec()
      .then(result =>{
        console.log(result);
        res.status(200).json({
            message : 'Product Updated !',
            type :'GET',
            url:"http://localhost:3000/products/" + id
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ 
            error:err
        });
      }); 
});

router.delete("/:productId", (req,res,next) => {
     const id = req.params.productId;
     Product.deleteOne({ _id:id })
     .exec()
     .then( result => {
        res.status(200).json({
            message : "Product Removed !",
           request:{
            type:'POST',
            url: "http://localhost:3000/products/",
            body:{name:'String', price: 'Number'}
           }
        });
     })
     .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
     });
});
module.exports = router;