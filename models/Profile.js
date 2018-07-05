const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    user: {
        type:  Schema.Types.ObjectId,
        ref: 'User'
    },
    handle: {
        type: String,
        required: true,
        trim: true,
        max: 40,
        unique:true
    },
    phoneNo:{type:String,trim:true},
    
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date
    }

})


module.exports = mongoose.model('Profile', profileSchema);