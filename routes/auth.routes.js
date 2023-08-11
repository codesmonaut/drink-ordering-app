const crypto = require(`crypto`);
const express = require(`express`);
const jwt = require(`jsonwebtoken`);
const rateLimit = require(`express-rate-limit`);

const User = require(`../models/User`);
const ErrorResponse = require(`../utils/ErrorResponse`);
const handleError = require(`../utils/handleError`);
const loginLimit = require(`../config/loginLimit`);
const protect = require(`../middlewares/protect`);
const ResetToken = require(`../models/ResetToken`);

// ROUTER CONFIG
const router = express.Router();

// Register
router.post(`/register`, async (req, res) => {

    try {

        const filteredBody = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            lat: req.body.lat,
            lon: req.body.lon
        }

        const newUser = await User.create(filteredBody);

        const token = jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE_DATE
        });

        res.cookie(`token`, token, {
            maxAge: 1000 * 60 * 60 * process.env.ACCESS_TOKEN_COOKIE_EXPIRE_DATE,
            httpOnly: true
        })

        newUser.password = undefined;

        res.status(201).json({
            status: 201,
            data: {
                user: newUser
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Login
router.post(`/login`, rateLimit(loginLimit), async (req, res) => {

    try {

        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email: email });

        if (!user) {
            const message = `Email, or password, or both are incorrect.`;
            return handleError(res, new ErrorResponse(401, message));
        }

        const match = await User.comparePasswords(password, user.password);

        if (!match) {
            const message = `Email, or password, or both are incorrect.`;
            return handleError(res, new ErrorResponse(401, message));
        }

        const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE_DATE
        })

        res.cookie(`token`, token, {
            maxAge: 1000 * 60 * 60 * process.env.ACCESS_TOKEN_COOKIE_EXPIRE_DATE,
            httpOnly: true
        })

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

// Logout
router.get(`/logout`, async (req, res) => {

    try {

        res.cookie(`token`, `loggedOut`, {
            maxAge: 1,
            httpOnly: true
        })

        res.status(204).json(null);
        
    } catch (err) {
        handleError(res, err);
    }
})

// Forgot password
router.post(`/forgotPassword`, async (req, res) => {

    try {

        const email = req.body.email;

        const user = await User.findOne({ email: email });

        if (!user) {
            const message = `Email is incorrect or the user is not registered on the app.`;
            return handleError(res, new ErrorResponse(400, message));
        }

        const resetTokenData = {
            userId: user._id,
            createdAt: Date.now()
        }

        const resetToken = await ResetToken.create(resetTokenData);

        const link = `${process.env.BASE_URL}${process.env.PORT}/api/v1/auth/resetPassword/${resetToken.token}`;

        console.log(`\nMail to: ${user.firstName} ${user.lastName}\n\nContent: ${link}`);

        res.status(200).json({
            status: 200,
            msg: 'Link should be sent to your email address.'
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Reset password
router.patch(`/resetPassword/:token`, async (req, res) => {

    try {

        const token = req.params.token;
        const encryptedToken = crypto.createHash(`sha256`).update(token).digest(`hex`);
        const resetToken = await ResetToken.findOne({ encryptedToken: encryptedToken });
        const user = await User.findById(resetToken.userId);

        if (req.body.password !== req.body.passwordConfirm) {
            const message = `Password and password confirm must match.`;
            return handleError(res, new ErrorResponse(400, message));
        }

        user.password = req.body.password;
        await user.save();

        res.status(200).json({
            status: 200,
            msg: 'Password successfully reset.'
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Change password
router.patch(`/changePassword`, protect, async (req, res) => {

    try {

        const user = await User.findById(req.currentUserId);

        user.password = req.body.password;
        await user.save();

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

module.exports = router;