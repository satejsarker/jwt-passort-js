const mongoose = require('mongoose');
const Schema = mongoose.Schema

// apartment Schema 
const apartmentSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    address: {
        type: Schema.Types.String,
        required: true
    },
    user_id: Schema.Types.String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    city: {
        type: Schema.Types.String,
        required: true
    },

    country: {
        type: Schema.Types.String,
        required: true
    },

    rooms: {
        type: Number,
        required: true
    },
    created_at: {
        type: Schema.Types.Date,
        default: Date.now
    }
}, { versionKey: false }, { autoIndex: true })
apartmentSchema.index({ rooms: 1, type: -1 })
apartmentSchema.index({ city: 1, type: -1 })
apartmentSchema.index({ country: 1, type: -1 })

class Apartment {
    getFullAddress() {
        return this.address
    }
}

module.exports = apartmentModel = mongoose.model('apartments', apartmentSchema)