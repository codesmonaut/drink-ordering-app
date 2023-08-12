const serverLimit = {
    windowMs: 1000 * 60 * 60,
    max: 100,
    message: 'Too many requests from same IP. Please, try again in an hour.'
}

module.exports = serverLimit;