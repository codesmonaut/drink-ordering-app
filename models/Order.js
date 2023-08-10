const mongoose = require(`mongoose`);

const orderSchema = new mongoose.Schema({
    drinkId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    sizeOption: {
        type: String,
        required: [true, `User must define size option.`]
    },
    store: {
        type: String,
        required: [true, `User must pick a store.`]
    },
    flavours: {
        type: Object,
        default: {
            syrup: 0,
            ice: true
        }
    }
})

const Order = mongoose.model(`Order`, orderSchema);

module.exports = Order;