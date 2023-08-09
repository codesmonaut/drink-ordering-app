const express = require(`express`);

const User = require(`../models/User`);
const ErrorResponse = require(`../utils/ErrorResponse`);
const handleError = require(`../utils/handleError`);
const protect = require(`../middlewares/protect`);
const restrict = require(`../middlewares/restrict`);

// ROUTER CONFIG
const router = express.Router();

// ROUTE PROTECTION MIDDLEWARE
router.use(protect);

// Get account
router.get(`/account`, async (req, res) => {

    try {

        const user = await User.findById(req.currentUserId);
        user.password = undefined;

        res.status(200).json({
            status: 200,
            data: {
                user: user
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Create account
router.post(`/createAccount`, (req, res) => {
    const message = `To create new account use route /api/v1/auth/register instead.`
    handleError(res, new ErrorResponse(400, message));
})

// Update account
router.patch(`/updateAccount`, async (req, res) => {

    try {

        if (req.body.password) {
            const message = `If you want to change password use /api/v1/auth/changePassword route instead.`;
            return handleError(res, new ErrorResponse(400, message));
        }

        const filteredBody = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            lat: req.body.lat,
            lon: req.body.lon
        }

        const updatedUser = await User.findByIdAndUpdate(req.currentUserId, filteredBody, {
            new: true,
            runValidators: true
        })

        updatedUser.password = undefined;

        res.status(200).json({
            status: 200,
            data: {
                user: updatedUser
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Delete account
router.delete(`/deleteAccount`, async (req, res) => {

    try {

        await User.findByIdAndDelete(req.currentUserId);

        res.cookie(`token`, `deleted`, {
            maxAge: 1,
            httpOnly: true
        })

        res.status(204).json(null);
        
    } catch (err) {
        handleError(res, err);
    }
})

// ROUTE RESTRICTION MIDDLEWARE
router.use(restrict);

// Get all users
router.get(`/`, async (req, res) => {

    try {

        const users = await User.find();

        res.status(200).json({
            status: 200,
            results: users.length,
            data: {
                users: users
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Get one user
router.get(`/:id`, async (req, res) => {

    try {

        const user = await User.findById(req.currentUserId);

        res.status(200).json({
            status: 200,
            data: {
                user: user
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Create user
router.post(`/`, (req, res) => {
    const message = `To create new user use /api/v1/auth/register route instead.`;
    handleError(res, new ErrorResponse(400, message));
})

// Update user
router.patch(`/:id`, async (req, res) => {

    try {

        const filteredBody = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            lat: req.body.lat,
            lon: req.body.lon
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, filteredBody, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: 200,
            data: {
                user: updatedUser
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Delete user
router.delete(`/:id`, async (req, res) => {

    try {

        if (req.currentUserId === req.params.id) {
            const message = `If you want to delete your account, use /api/v1/users/deleteAccount route instead`;
            return handleError(res, new ErrorResponse(400, message));
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(204).json(null);
        
    } catch (err) {
        handleError(res, err);
    }
})

module.exports = router;