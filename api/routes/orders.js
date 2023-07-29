const express = require('express');
const router = express.Router(); //

//Handle incoming GET request to /order
router.get('/' ,(req,res,next) => {
     res.status(200).json({
        message: 'Orders were fetched' 
     });
});

router.post('/' ,(req,res,next) => {
    const order ={
        productId : req.body.productId,
        quantity:req.body.quantity
    };
    res.status(201).json({
       message: 'Orders were Created',
       orderCreated : order
    });
});

router.get('/:ordersId' ,(req,res,next) => {
    res.status(201).json({
       message: 'Orders Details' ,
       ordersId: req.params.ordersId
    });
});

router.delete('/:ordersId' ,(req,res,next) => {
    res.status(200).json({
       message: 'Orders Deleted' ,
       ordersId: req.params.ordersId
    });
});

module.exports = router;