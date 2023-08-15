const express = require(`express`);

const Store = require(`../models/Store`);
const ErrorResponse = require(`../utils/ErrorResponse`);
const handleError = require(`../utils/handleError`);
const protect = require(`../middlewares/protect`);
const restrict = require(`../middlewares/restrict`);

// ROUTER CONFIG
const router = express.Router();

// Get all stores
router.get(`/`, async (req, res) => {

    try {

        const stores = await Store.find();

        res.status(200).json({
            status: 200,
            results: stores.length,
            data: {
                stores: stores
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Get one store
router.get(`/:id`, async (req, res) => {

    try {

        const store = await Store.findById(req.params.id);

        res.status(200).json({
            status: 200,
            data: {
                store: store
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// ROUTE PROTECTION MIDDLEWARE
router.use(protect);

// ROUTE RESTRICTION MIDDLEWARE
router.use(restrict);

// Create store
router.post(`/`, async (req, res) => {

    try {

        const filteredBody = {
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            businessHours: req.body.businessHours,
            geometry: req.body.geometry
        }

        const newStore = await Store.create(filteredBody);

        res.status(201).json({
            status: 201,
            data: {
                store: newStore
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Update store
router.patch(`/:id`, async (req, res) => {

    try {

        if (req.body.address || req.body.geometry) {
            const message = `This route is only for updating name and business hours. If you want to change location create new store.`;
            return handleError(res, new ErrorResponse(400, message));
        }
    
        const filteredBody = {
            name: req.body.name,
            phone: req.body.phone,
            businessHours: req.body.businessHours
        }

        const updatedStore = await Store.findByIdAndUpdate(req.params.id, filteredBody, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: 200,
            data: {
                store: updatedStore
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Delete store
router.delete(`/:id`, async (req, res) => {

    try {

        await Store.findByIdAndDelete(req.params.id);

        res.status(204).json(null)
        
    } catch (err) {
        handleError(res, err);
    }
})

// Find nearest store
router.post(`/nearestStore`, async (req, res) => {

    try {

        const lat = req.body.lat;
        const lon = req.body.lon;

        const nearestStore = await Store.aggregate([{
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [lat, lon]
                },
                distanceField: `distance`
            }
        },
        { $limit: 1 }
        ])

        res.status(200).json({
            status: 200,
            data: {
                store: nearestStore
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

module.exports = router;