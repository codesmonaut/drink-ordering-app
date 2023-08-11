const express = require(`express`);

const Order = require(`../models/Order`);
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
            storeId: req.body.storeId,
            size: req.body.size,
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

        await Order.findByIdAndDelete(req.params.id);

        res.status(204).json(null);
        
    } catch (err) {
        handleError(res, err);
    }
})

module.exports = router;