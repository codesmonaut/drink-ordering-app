const mongoose = require(`mongoose`);
const bcrypt = require(`bcryptjs`);
const validator = require(`validator`);

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, `User must have a first name.`],
        minlength: [1, `First name must have more than 1 character.`],
        maxlength: [70, `First name must have less than 70 characters.`]
    },
    lastName: {
        type: String,
        required: [true, `User must have a last name.`],
        minlength: [1, `Last name must have more than 1 character.`],
        maxlength: [70, `Last name must have less than 70 characters.`]
    },
    email: {
        type: String,
        required: [true, `User must have an email.`],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, `Pleas provide an valid email.`]
    },
    password: {
        type: String,
        required: [true, `User must have a password.`],
        minlength: [6, `Password must have more than 6 characters.`],
        maxlength: [30, `Password must have less than 30 characters.`]
    },
    orders: {
        type: Number,
        default: 0
    },
    lat: {
        type: Number,
        default: null
    },
    lon: {
        type: Number,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

userSchema.pre(`save`, async function (next) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.statics.comparePasswords = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model(`User`, userSchema);

module.exports = User;