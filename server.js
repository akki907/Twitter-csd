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
app.use(bodyParser.urlencoded({ extended : true }));
app.use(morgan('dev'));

//passport middleware
app.use(passport.initialize())
require('./config/passport')(passport)

//routes
app.use('/api/auth',auth);
app.use('/api/user',user);

app.get('/', (req, res) => {
    res.send(`Server is running on ${port}`)
})


//server
app.listen(port, () => {
    console.log(`server running on port ${port}`)
})