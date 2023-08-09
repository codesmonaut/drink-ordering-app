const User = require(`../models/User`);

const ErrorResponse = require(`../utils/ErrorResponse`);
const handleError = require(`../utils/handleError`);

const restrict = async (req, res, next) => {
    
    try {

        const user = await User.findById(req.currentUserId);

        if (!user.isAdmin) {
            const message = `You must be authorized to perform this action.`;
            return handleError(res, new ErrorResponse(401, message));
        }

        next();
        
    } catch (err) {
        handleError(res, err);
    }
}

module.exports = restrict;