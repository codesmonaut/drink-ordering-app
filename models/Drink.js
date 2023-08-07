const mongoose = require(`mongoose`);

const drinkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, `Drink must have a name.`],
        unique: true,
        minlength: [2, `Drink name must have more than 2 characters.`],
        maxlength: [70, `Drink must have less than 70 characters.`]
    },
    image: {
        type: String,
        required: true
    },
    drinkType: {
        type: String,
        required: [true, `Drink must have a type.`],
        minlength: [2, `Drink type must have more than 2 characters.`],
        maxlength: [70, `Drink type must have less than 70 characters.`]
    },
    size: {
        type: Array,
        required: [true, `Drink must have size options.`]
    },
    available: {
        type: Array,
        default: [ `no available` ]
    },
    included: {
        type: Array,
        default: [ 'nothing included' ]
    }
})

const Drink = mongoose.model(`Drink`, drinkSchema);

module.exports = Drink;