const express = require(`express`);

const Order = require(`../models/Order`);
const Drink = require(`../models/Drink`);
const User = require(`../models/User`);
const ErrorResponse = require(`../utils/ErrorResponse`);
const handleError = require(`../utils/handleError`);
const protect = require(`../middlewares/protect`);
const restrict = require(`../middlewares/restrict`);

// ROUTER CONFIG
const router = express.Router();

// ROUTE PROTECTION
router.use(protect);

// Create order
router.post(`/`, async (req, res) => {
    
    try {

        const filteredBody = {
            drinkId: req.body.drinkId,
            userId: req.currentUserId,
            sizeOption: req.body.sizeOption,
            store: req.body.store,
            flavours: req.body.flavours
        }

        const newOrder = await Order.create(filteredBody);

        res.status(201).json({
            status: 201,
            data: {
                order: newOrder
            }
        })
        
    } catch (err) {
        handleError(res, err);    
    }
})

// Update order
router.patch(`/:id`, (req, res) => {
    const message = `Once order is created, it cannot be updated.`;
    handleError(res, new ErrorResponse(400, message));
})

// ROUTE RESTRICTION
router.use(restrict);

// Get all orders
router.get(`/`, async (req, res) => {

    try {

        const orders = await Order.find();

        res.status(200).json({
            status: 200,
            results: orders.length,
            data: {
                orders: orders
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Get one order
router.get(`/:id`, async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);

        res.status(200).json({
            status: 200,
            data: {
                order: order
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Delete order
router.delete(`/:id`, async (req, res) => {

    try {
        
    } catch (err) {
        handleError(res, err);
    }
})

module.exports = router;