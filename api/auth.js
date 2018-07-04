const express = require('express')
const router = express.Router();
const User = require('./../models/User')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken');
const setting = require('./../config/setting')
const passport = require('passport');

const validationRegistration = require('./../validators/registration')
const validateLogin = require('./../validators/login')
// @route GET api/auth/register
// @desc Register user
// @access public
router.post('/register', (req, res) => {
    const {errors, isValid} = validationRegistration(req.body);
    if(!isValid) return res.status(400).json({success:false,message:errors})

    User.findOne({
            email: req.body.email
        })
        .exec((err, user) => {
            if (err) return res.json({
                success: false,
                message: err
            })
            
            if (user) {
                errors.email = 'Email Already Exists.';
                return res.status(400).json({success:false,message:errors});
              }

            const avatar = gravatar.url(req.body.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });
        new User({
                name: req.body.name,
                password: req.body.password,
                avatar:avatar,
                email: req.body.email
            }).save(function (err, user) {
                console.log(err)
                if (err) {
                    if(err.code == 11000){
                        return  res.status(204).json({success:false,message:'Username or email already exists.'})
                     }
                     else{
                        return res.json({success:false,message:err})
                     }
                } else {
                    res.json({
                        success: true,
                        message: 'User created'
                    })
                }
            })
        })
})

router.post('/login', (req, res) => {
    const {errors, isValid} = validateLogin(req.body);
    if(!isValid) return res.status(400).json({success:false,message:errors})
    User.findOne({
            email: req.body.email
        })
        .exec((err, user) => {
            if (err) return res.json({
                success: false,
                message: err
            })
            if (!user) {
                errors.email = 'User not found';
                return res.status(404).json({success:false,message:errors});
              }
            //check password
            const validPassword = user.comparePassword(req.body.password)
            if (!validPassword) {
                errors.password = 'Incorrect Password.'
                res.status(400).json({
                    success: false,
                    message: errors
                })
            } else {
                jwt.sign({
                    _id: user._id,
                    email: user.email,
                    avatar:user.avatar,
                    name:user.name
                }, setting.secret, {
                    expiresIn: '24h'
                }, (err, token) => {
                    if (err) return res.json({
                        success: false,
                        message: err
                    })
                    res.json({
                        success: true,
                        message: 'Login SuccessFull',
                        token: 'Bearer '+token
                    })
                })

            }
        })
})

router.post('/auth/twitter',passport.authenticate('jwt', {
    session: false
}),(req,res)=>{
    request.post({
        url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
        oauth: {
          consumer_key: 'KEY',
          consumer_secret: 'SECRET',
          token: req.query.oauth_token
        },
        form: { oauth_verifier: req.query.oauth_verifier }
      }, function (err, r, body) {
        console.log(err,body)
      })

})


module.exports = router;