const express = require('express')
const router = express.Router();
const User = require('./../models/User')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken');
const setting = require('./../config/setting')
const passport = require('passport');
const request = require('request');
const validationRegistration = require('./../validators/registration')
const validateLogin = require('./../validators/login')
const TwitterTokenStrategy = require('passport-twitter-token');
var userData = null
// @route GET api/auth/register
// @desc Register user
// @access public
router.post('/register', (req, res) => {
    const {
        errors,
        isValid
    } = validationRegistration(req.body);
    if (!isValid) return res.status(400).json({
        success: false,
        message: errors
    })

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
                return res.status(400).json({
                    success: false,
                    message: errors
                });
            }

            const avatar = gravatar.url(req.body.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });
            new User({
                name: req.body.name,
                password: req.body.password,
                avatar: avatar,
                email: req.body.email
            }).save(function (err, user) {
                console.log(err)
                if (err) {
                    if (err.code == 11000) {
                        return res.status(204).json({
                            success: false,
                            message: 'Username or email already exists.'
                        })
                    } else {
                        return res.json({
                            success: false,
                            message: err
                        })
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
    const {
        errors,
        isValid
    } = validateLogin(req.body);
    if (!isValid) return res.status(400).json({
        success: false,
        message: errors
    })
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
                return res.status(404).json({
                    success: false,
                    message: errors
                });
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
                    avatar: user.avatar,
                    name: user.name
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
                        token: 'Bearer ' + token
                    })
                })

            }
        })
})

router.post('/twitter', passport.authenticate('jwt', {
        session: false
    }), (req, res, next) => {
        userData = req.user;
        request.post({
            url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
            oauth: {
                consumer_key: setting.twitterconfig.consumer_key,
                consumer_secret: setting.twitterconfig.consumer_secret,
                token: req.query.oauth_token
            },
            form: {
                oauth_verifier: req.query.oauth_verifier
            }
        }, function (err, r, body) {
            if (err) {
                return res.send(500, {
                    message: err.message
                });
            }

            const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
            const parsedBody = JSON.parse(bodyString);

            req.body['oauth_token'] = parsedBody.oauth_token;
            req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
            req.body['user_id'] = parsedBody.user_id;

            next();

        });


    }, passport.authenticate('twitter-token', {
        session: false
    }),
    function (req, res) {
        console.log(userData)
        if (!req.user) {
            return res.send(401, 'User Not Authenticated');
        }
        User.findOneAndUpdate({
            _id: userData._id
        }, {
            twitterHandle: {
                token: req.user.token,
                tokenSecret: req.user.tokenSecret,
                email: req.user.profile.emails[0].value,
                displayName: req.user.profile.displayName
            }
        }).then(user=>{
            res.json({success:true,message:'user configured!'})
        }).catch(err=>{
            res.json({success:false,message:err})
        })
        /* for api call */

        // // prepare token for API
        // req.auth = {
        //     id: req.user.id
        // };


        // return next();
    }

)


router.post('/twitterCallback', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    console.log('in callback')
    request.post({
        url: 'https://api.twitter.com/oauth/request_token',
        oauth: {
            oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
            consumer_key: setting.twitterconfig.consumer_key,
            consumer_secret: setting.twitterconfig.consumer_secret,
        }
    }, function (err, r, body) {
        if (err) {
            return res.send(500, {
                message: err.message
            });
        }
        var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        res.send(JSON.parse(jsonStr));
    });
})

var generateToken = function (req, res, next) {
    req.token = createToken(req.auth);
    return next();
};

var sendToken = function (req, res) {
    res.setHeader('x-auth-token', req.token);
    return res.status(200).send(JSON.stringify(req.user));
};


var createToken = function (auth) {
    return jwt.sign({
        id: auth.id
    }, 'my-secret', {
        expiresIn: 60 * 120
    });
};


module.exports = router;