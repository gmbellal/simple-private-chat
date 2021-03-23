const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const app = express();
const server=http.createServer(app);
const io = socketio(server);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { auth } = require('./utils/Auth');
const jwt = require('jsonwebtoken');
const PORT = 3000;
const HOST_NAME = 'localhost';
const DATABASE_NAME = 'web-chat';
mongoose.connect('mongodb://' + HOST_NAME + '/' + DATABASE_NAME, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true} );


//session
var NodeSession = require('node-session');
var nodeSession = new NodeSession({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'});
function session(req, res, next){
    nodeSession.startSession(req, res, next);
}





app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname,'front')));
app.set('view engine', 'pug')
app.use(session);


//Controllers-----------------------
const loginController = require('./controllers/login.controller')



//Routers----------------------------
app.get("/",  loginController.login);
app.get("/login",  loginController.login);
app.post("/login",  loginController.login);
app.get("/sign-up",  loginController.signup);
app.post("/sign-up",  loginController.signup);
app.get("/logout",  loginController.logout);


//chat
app.get("/live-chat", auth,  loginController.chat);



//models
const User = require('./models/user.model');
const userOnline = require('./models/userOnline.model');






io.on('connection', async (socket) => {

  const userId = socket.handshake.query.userId;

    //console.log("User Connected: "+ userId);

    //io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});
    //socket.to(res.ID).emit('message',dataElement);
    //socket.emit('message',dataElement); //emits message back to the user for display

    //specific function
    // socket.on('login',(data) => { 

    // });  
    //on connection disconnect
   

    //make online------------

    jwt.verify(token, "jgafugy$#54%%ygfsygfff", (err, username) => {
      if (err){
        res.redirect("/login");
      }
      req.user = username;
      next();
    });



    const isOnline = await userOnline.findOne( {'user.id': userId } );
    if(isOnline){
      await userOnline.updateOne( {'user.id': 1 }, { socketSession: socket.id } );
      console.log("Connection Resume...");
    }else{
      var connected = new userOnline({ 
        user: { id: 1, fullname: 'Bellal Hossain', username: 'bellal' },
        socketSession: socket.id
      });
      connected.save(function(err, doc) {
        if(err)console.log("failed to connect");
        else console.log("New user connected");
      });
    }




    socket.on('disconnect', async () => {
        console.log("logout a user: "+socket.id );
        await userOnline.deleteOne( {'user.id': userId } );
    });

    
});





server.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});





