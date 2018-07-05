const express = require('express');
const app = express();
const port = process.env.PORT || 9000;
const morgan = require('morgan')
const setting = require('./config/setting')
const mongoose = require('mongoose');
const auth = require('./api/auth');
const user = require('./api/profile');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const twitterConfig = require('./config/twitterSetting');
const path = require('path')
const TwitterTokenStrategy = require('passport-twitter-token');

//database 
mongoose
    .connect(setting.mongoURL)
    .then(() => {
        console.log(`Database connected at ${setting.mongoURL}`)
    })
    .catch(err => {
        console.log(err)
    })


//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan('dev'));

/* cors setting */

var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

//passport middleware
app.use(passport.initialize())
require('./config/passport')(passport)



twitterConfig()
//routes
app.use('/api/auth', auth);
app.use('/api/user', user);

// app.get('/', (req, res) => {
//     res.send(`Server is running on ${port}`)
// })

app.use(express.static("client/build"));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});


//server
app.listen(port, () => {
    console.log(`server running on port ${port}`)
})