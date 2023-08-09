const express = require(`express`);

const User = require(`../models/User`);
const ErrorResponse = require(`../utils/ErrorResponse`);
const handleError = require(`../utils/handleError`);
const protect = require(`../middlewares/protect`);

// ROUTER CONFIG
const router = express.Router();

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

module.exports = router;