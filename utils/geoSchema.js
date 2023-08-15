const mongoose = require(`mongoose`);

// "geometry": {
//     "type": "Point",
//     "coordinates": [125.6, 10.1]
//  }

const geoSchema = new mongoose.Schema({
    type: {
        type: String,
        default: "Point"
    },
    coordinates: {
        type: [Number],
        index: "2dsphere"
    }
})

module.exports = geoSchema;