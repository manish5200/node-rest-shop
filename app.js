const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser=require("body-parser");
const mongoose = require('mongoose');


const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const usersRoutes =require("./api/routes/users")


mongoose.connect("mongodb+srv://node-shop:"+ 
 process.env.MONGO_ATLAS_PW +  
"@node-rest-shop.yrafhdb.mongodb.net/");

mongoose.Promise=global.Promise;

app.use(morgan("dev"));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false})); //suppoort simple body to encoded data because extended is set to false
app.use(bodyParser.json());

app.use((req,res,next) => {
       res.header('Access-Control-Allow-Origin',"*");
       res.header('Access-Control-Allow-Headers',
       "Origin,X-Requested-With,Content-TypeError,Accept,Authorization");
    if(req.method=='OPTIONS') {
       res.header('Access-Control-Allow-Methods','PUT,POST,PATCH ,DELETE,GET');
       return req.status(200).json({});
    }
    next();
});

//Routes which should handle requests
app.use('/products', productRoutes)
app.use('/orders', ordersRoutes);
app.use('/users', usersRoutes);

app.use((req,res,next) => {
       const error = new Error('Not Found');  // Error availble by default
       error.status=404;
       next(error);
})

app.use((error ,req, res ,next) =>{
       res.status(error.status || 500 );
       res.json({
          error :{
            message: error.message
          }
       });
});

module.exports = app;