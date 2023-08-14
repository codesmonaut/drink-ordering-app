const ErrorResponse = require(`./ErrorResponse`);

const handleError = (res, err) => {
    let error = {...err};
    error.message = err.message;

    if (err.name === `CastError`) {
        const message = `Resource with given ID not found.`;
        error = new ErrorResponse(404, message);
    }

    if (err.code === 11000) {
        const message = `There is resource with same field/s, that should be unique, already in database.`;
        error = new ErrorResponse(400, message);
    }

    if (err.name === `ValidationError`) {
        const message = Object.values(err.errors).map(value => value.message);
        error = new ErrorResponse(400, message);
    }

    res.status(error.statusCode || 500).json({
        status: error.statusCode || 500,
        error: error.message || 'It looks like there is an error on the server.'
    })
}

module.exports = handleError;