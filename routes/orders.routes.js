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

module.exports = router;