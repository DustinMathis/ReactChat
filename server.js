var express = require('express');
var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);
var path = require('path');
var bodyParser = require ('body-parser');

var PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Heroku won't actually allow us to use WebSockets
// so we have to setup polling instead.
// https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});




//Serve static assets if in production
if(process.env.NODE_ENV === 'production'){
    //SET static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))


    });
}

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(msg){
    console.log('message: ' + JSON.stringify(msg));
    io.emit('chat message', msg);
    ;
  });
});

server.listen(PORT, function(){
  console.log(`Server listening on ${PORT}`);
});