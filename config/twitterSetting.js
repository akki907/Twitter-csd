'use strict';

const passport = require('passport');
const TwitterTokenStrategy = require('passport-twitter-token');

const setting = require('./setting');

module.exports = function () {

    passport.use(new TwitterTokenStrategy({
            consumerKey: setting.twitterconfig.consumer_key,
            consumerSecret: setting.twitterconfig.consumer_secret,
            includeEmail: true
        },
        function (token, tokenSecret, profile, done) {
            // User.upsertTwitterUser(token, tokenSecret, profile, function (err, user) {
            let info = {
                token,
                tokenSecret,
                profile
            }
            return done(null,info);
            // });
        }));

};