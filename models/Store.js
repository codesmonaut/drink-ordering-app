const mongoose = require(`mongoose`);

const geoSchema = require(`../utils/geoSchema`);

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
        required: [true, `Store must have an address.`],
        unique: true,
        minlength: 3,
        maxlength: 100
    },
    phone: {
        type: String,
        required: [true, `Store must have a phone number.`]
    },
    businessHours: {
        type: String,
        required: [true, `Store must have defined business hours.`]
    },
    geometry: geoSchema
})

const Store = mongoose.model(`Store`, storeSchema);

module.exports = Store;