const crypto = require(`crypto`);
const mongoose = require(`mongoose`);

const resetTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        required: [true, `Reset token must have user ID.`]
    },
    token: {
        type: String
    },
    encryptedToken: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 1000 * 60 * 10
    }
})

resetTokenSchema.pre(`save`, function (next) {
    const resetToken = crypto.randomBytes(32).toString(`hex`);
    const encryptedResetToken = crypto.createHash(`sha256`).update(resetToken).digest(`hex`);
    this.token = resetToken;
    this.encryptedToken = encryptedResetToken;
    next();
})

const ResetToken = mongoose.model(`ResetToken`, resetTokenSchema);

module.exports = ResetToken;