var express = require('express');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require ('body-parser');

var PORT = process.env.PORT || 3001;
var app = express();
app.use(bodyParser.json());

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
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

app.listen(PORT, function(){
  console.log(`Server listening on ${PORT}`);
});