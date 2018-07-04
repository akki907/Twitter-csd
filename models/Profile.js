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
    company: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    skills: {
        type: [String],
        required: true
    },
    bio: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        trim: true
    },
    githubUserName: {
        type: String,
        trim: true
    },
    experience: [{
        title: {
            type: String,
            required: true
        },
        company: {
            type: String,
            required: true
        },
        location: {
            type: String,
        },
        from: {
            type: Date,
        },
        to: {
            type: Date,
        },
        current: {
            type: Boolean,
            default: false
        },
        description: {
            type: String,
        }
    }],
    education: [{
        school: {
            type: String,
            required: true
        },
        degree: {
            type: String,
            required: true
        },
        fieldofstudy: {
            type: String,
            required:true
        },
        from: {
            type: Date,
        },
        to: {
            type: Date,
        },
        current: {
            type: Boolean,
            default: false
        },
        description: {
            type: String,
        }
    }],
    social:{
        youtube:{type: String,trim:true},
        facebook:{type: String,trim:true},
        twitter:{type: String,trim:true},
        linkdin:{type: String,trim:true},
        instagram:{type: String,trim:true}
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date
    }

})


module.exports = mongoose.model('Profile', profileSchema);