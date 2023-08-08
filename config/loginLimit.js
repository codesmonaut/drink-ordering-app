const loginLimit = {
    windowMs: 1000 * 60 * 60,
    max: 3,
    message: 'Too many login attempts from the same IP and with incorrect credentials. Try again in an hour or go to /forgotPassword route.'
}

module.exports = loginLimit;