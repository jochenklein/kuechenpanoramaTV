var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var crawler = require('./public/crawler.js');

app.use(express.static('public'));

// var path = require('path');
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(__dirname + '/public'));
app.get('/', function(request, response) {
    // response.render('index')
    response.sendFile(__dirname + '/index.html');
});

app.get('/remote', function(request, response) {
    response.sendFile(__dirname + '/public/remote.html');
});

io.on('connection', function(socket) {
    socket.on('toggleMuteRequest', function(data) {
        console.log(data);
        io.sockets.emit('toggleMute', 'Toggle mute audio.');
    });

    socket.on('playNextAudioRequest', function(data) {
        console.log(data);
        io.sockets.emit('playNextAudio', 'Play next audio track.');
    });

    socket.on('playNextVideoRequest', function(data) {
        console.log(data);
        io.sockets.emit('playNextVideo', 'Switch to next web camera stream.');
    });

    socket.on('setNextResortRequest', function(data) {
        console.log(data);
        io.sockets.emit('setNextResort', 'Switch to next resort.');
    });

    socket.on('updateWebcamStreamsRequest2', function(data) {
        console.log(data);
        crawler.parse(function(returnValue) {
            io.sockets.emit('updateWebcamStreams', returnValue);
        });
    });
});

// app.listen(port)
http.listen(port = 8000, function() {
    console.log(`Server running at http://localhost:${port}/`);
});
