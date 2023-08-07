const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth=require('../middleware/check-auth')
const Order = require('../models/order') ;
const Product = require('../models/product');

const OrderController = require('../appController/orders');


router.get('/' ,checkAuth,OrderController.get_all_orders);

router.post('/' ,checkAuth,OrderController.create_orders);

router.get('/:orderId' ,checkAuth ,OrderController.get_single_order);

router.delete('/:orderId',checkAuth,OrderController.delete_order);

module.exports = router;