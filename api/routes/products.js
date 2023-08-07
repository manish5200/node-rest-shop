const express = require('express');
const router = express.Router(); 
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ProductController = require('../appController/products');
const Product = require('../models/product');

const storage =multer.diskStorage({
    destination: function(req,file,cb)   // cb -->call back
    {
       cb(null ,'uploads/');  // Directory where the uploaded files will be stored
    },
     filename:function(req,file,cb)
     {  
     // Generate a date string without colons
   const dateWithoutColons = new Date().toISOString().replace(/:/g, '');
  // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
   cb(null, dateWithoutColons + '-' + file.originalname);
     }
   });

const fileFilter = (req,file,cb) => 
{
   if(file.mimetype =='image/jpeg' || file.mimetype =='image/png')
   {
   //accept
   cb(null,true);
   }
   else
   {
   //reject
   cb(null,false);
   }
  
};

const upload = multer({
   storage:storage, 
   limits:{
   fileSize: 1024 * 1024 * 5  // can uploadm upto 5 MB
} ,
fileFilter :fileFilter
});


router.get("/" ,ProductController.get_all_products); 

router.post("/",checkAuth,upload.single('productImage'),ProductController.add_new_products);  

router.get('/:productId', ProductController.get_single_product);

router.patch('/:productId',checkAuth, ProductController.update_product);

router.delete("/:productId",checkAuth,ProductController.delete_product);
module.exports = router;