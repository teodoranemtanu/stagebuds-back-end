const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');
const cloudinary = require('./services/cloudinary');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('*', cloudinary.cloudinaryConfig);

app.use('/api/users', usersRoutes);
// app.use('/api/profiles', profileRoutes);

app.use((req, res, next) => {
    throw new HttpError('Could not find this route', 404);
});

mongoose
    .connect(`mongodb+srv://teo:Vincent15Vega@cluster0-rvl0b.mongodb.net/stage-buds?retryWrites=true&w=majority`, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log('good db connection');
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });

