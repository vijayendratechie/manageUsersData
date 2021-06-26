var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    name: {
        type: String
    },
    mobile: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        street: {
            type: String
        },
        locality: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        pincode: {
            type: String
        },
        location: {
            type: {
                type: String
            },
            coordinates: {
                type: [Number]
            }            
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.index({"createdAt": -1})
module.exports = mongoose.model('users', userSchema)