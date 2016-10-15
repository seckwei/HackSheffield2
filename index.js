'use strict';

const app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    bodyParser = require('body-parser'),
    fs = require('fs');

const PORT = process.env.PORT || '8080',
    ENV = (process.env.NODE_ENV)? 'prod' : 'dev';

server.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});

app.use(bodyParser.json());

// Home page
app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    fs.readFile(__dirname + '/index.html', (err, data) => {
        if(!process.env.NODE_ENV){
            data = data.toString().replace(/https/gi, 'http');
        }
        res.send(data);
    });
});

// Ignore favicon
app.get('/favicon.ico', (req, res) => {
    res.sendStatus(200);
});

const DEFAULT = {
    ID: 'defaultID',
    WIDTH: 100,
    HEIGHT: 100,
    BG: 'black'
};

// API - Receive POST data
app.post('/data', (req, res) => {
    console.log('Data posted', req.body);

    let {
        action,
        id = DEFAULT.ID, 
        element = 'div', 
        width = DEFAULT.WIDTH, 
        height = DEFAULT.HEIGHT, 
        bg = DEFAULT.BG
    } = req.body;
    let message = {};

    console.log(action);
    switch(action){
        case 'create': {
            message = {
                id: id,
                element: element,
                width: width,
                height: height,
                bg: bg
            };
            break;
        }
        case 'edit': {
            message = {
                id: id
            };
            break;
        }
        case 'delete': {
            message = {
                id: id
            };
            break;
        }
    }
    message.action = action;
    io.emit('message', message);

    res.send('OK');
});

// Server-side Sockets
io.on('connection', function (socket) {
    console.log('Client connected');
});