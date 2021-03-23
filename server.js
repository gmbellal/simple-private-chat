const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const app = express();
const server=http.createServer(app);
const io = socketio(server);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const PORT = 3000;
const HOST_NAME = 'localhost';
const DATABASE_NAME = 'web-chat';
mongoose.connect('mongodb://' + HOST_NAME + '/' + DATABASE_NAME, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true} );


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname,'front')));
app.set('view engine', 'pug')



//Controllers-----------------------
const loginController = require('./controllers/login.controller')



//Routers----------------------------
app.get("/",  loginController.login);
app.get("/sign-up",  loginController.signup);








io.on('connection', (socket) => {
    console.log('New User Logged In with ID '+socket.id);

    //io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});
    //socket.to(res.ID).emit('message',dataElement);
    //socket.emit('message',dataElement); //emits message back to the user for display


    //specific function
    socket.on('login',(data) => { 

    });  


    //on connection disconnect
    socket.on('disconnect', () => {
      
    });
    
});





server.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});





