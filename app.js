const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const socketio = require('socket.io');

const usersRoutes = require('./routes/users-routes');
const profilesRoutes = require('./routes/profiles-routes');
const postsRoutes = require('./routes/posts-routes');
const likesRoutes = require('./routes/likes-routes');
const concertsRoutes = require('./routes/concerts-routes');
const notificationsRoutes = require('./routes/notifications-routes');
const conversationsRoutes = require('./routes/conversations-routes');
const socketService = require('./services/socketio-service');

const HttpError = require('./models/http-error');
const cloudinary = require('./services/cloudinary');

const app = express();
let expressServer;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    next();
});

app.use('*', cloudinary.cloudinaryConfig);

app.use('/api/users', usersRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/conversations', conversationsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/songkick', concertsRoutes);

app.use((req, res, next) => {
    throw new HttpError('Could not find this route', 404);
});

mongoose
    .connect(`mongodb+srv://teo:Vincent15Vega@cluster0-rvl0b.mongodb.net/stage-buds?retryWrites=true&w=majority`, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log('good db connection');

        expressServer = app.listen(5000);
        let io = socketio(expressServer);

        io.on('connection', (socket) => {
            socketService.mainSocket(io, socket);
            socket.on('disconnect', function() {
                console.log('Sockets disconnected.');
            });
        });

        io.of('/messenger').on('connect', (socket) => {
            socketService.messengerSocket(io, socket);
            socket.on('disconnect', function() {
                console.log('Sockets disconnected.');
            });
        });

    })
    .catch(err => {
        console.log(err);
    });


