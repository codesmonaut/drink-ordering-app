const mongoose = require(`mongoose`);

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, `Store must have a name.`],
        unique: true,
        minlength: 3,
        maxlength: 80
    },
    address: {
        type: String,
        required: [true `Store must have an address.`],
        unique: true,
        minlength: 3,
        maxlength: 100
    },
    businessHours: {
        type: String,
        required: [true, `Store must have defined business hours.`]
    },
    lat: {
        type: Number,
        required: [true, `Store must have latitude defined.`]
    },
    lon: {
        type: Number,
        required: [true, `Store must have longitude defined.`]
    }
})

const Store = mongoose.model(`Store`, storeSchema);

module.exports = Store;