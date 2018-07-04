const express = require('express')
const router = express.Router();
const User = require('./../models/User')
const Profile = require('./../models/Profile')
const passport = require('passport')
const validProfile = require('./../validators/profile')
const mongoose = require('mongoose');
const validateExperienceInput = require('./../validators/validateExperience')
const validateEducationInput = require('./../validators/validateEducation')
// @protected
router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    User.findOne({
            _id: req.user._id
        })
        .select('-password')
        .exec(function (err, profile) {
            console.log('err profile',err,profile)
            if (err) return res.json({
                success: false,
                message: err
            })
            if (!profile) return res.status(404).json({
                success: false,
                noprofile: true,
                message: 'You have not created your profile yet!'
            });
            res.json({
                success: true,
                data: profile,
                noprofile: false
            })
        })
})

router.post('/addTwitterHandle',passport.authenticate('jwt', {
    session: false
}),(req,res)=>{

})

router.post('/createProfile', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        errors,
        isValid
    } = validProfile(req.body);
    if (!isValid) return res.status(400).json({
        success: false,
        message: errors.name
    })

    const profileFields = {}
    profileFields.user = req.user._id
    if (req.body.handle) profileFields.handle = req.body.handle
    if (req.body.company) profileFields.company = req.body.company
    if (req.body.website) profileFields.website = req.body.website
    if (req.body.location) profileFields.location = req.body.location
    if (req.body.bio) profileFields.bio = req.body.bio
    if (req.body.status) profileFields.status = req.body.status
    if (req.body.githunusername) profileFields.githunusername = req.body.githunusername

    if (typeof req.body.skills !== undefined) {
        profileFields.skills = req.body.skills.split(',')
    }
    profileFields.social = {}
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook
    if (req.body.linkdin) profileFields.social.linkdin = req.body.linkdin
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter

    Profile.findOne({
            user: req.user._id
        })
        .exec(function (err, profile) {
            if (err) return res.json({
                success: false,
                message: err
            })
            if (profile) {

                Profile.findOneAndUpdate({
                    user: req.user._id
                }, {
                    $set: profileFields
                }, {
                    new: true
                }).then(profile => res.json(profile)).catch(err => res.json({
                    success: false,
                    message: err
                }))
            } else {
                Profile.findOne({
                        handle: req.body.handle
                    })
                    .exec((err, profile) => {
                        if (err) return res.json({
                            success: false,
                            message: err
                        })
                        if (profile) return res.json({
                            success: false,
                            message: 'Thar handle already exists'
                        })
                        let newProfile = new Profile(profileFields)
                        newProfile.save((err, done) => {
                            if (err) return res.json({
                                success: false,
                                message: err
                            })
                            res.json({
                                success: true,
                                message: 'profile created.'
                            })
                        })
                    })
            }
        })
})






// @by id
router.get('/user/:id', (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) return res.json({
        success: false,
        message: 'Id InValid.'
    })
    Profile.findOne({
            user: req.params.id
        })
        .populate('user', ['name', 'avatar'])
        .exec(function (err, profile) {
            if (err) return res.json({
                success: false,
                message: err
            })
            if (!profile) return res.status(404).json({
                success: false,
                message: 'There is no such id.'
            });
            res.json({
                success: true,
                data: profile
            })
        })
})



module.exports = router;