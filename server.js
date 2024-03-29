const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const app = express();
const server=http.createServer(app);
const io = socketio(server);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { auth, redirecUser } = require('./utils/Auth');
const jwt = require('jsonwebtoken');
const PORT = 3010;
const HOST_NAME = 'localhost';
const DATABASE_NAME = 'web-chat';
const moment = require('moment');
mongoose.connect('mongodb://' + HOST_NAME + '/' + DATABASE_NAME, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true} );


//session
var NodeSession = require('node-session');
var nodeSession = new NodeSession({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD', 'lifetime': 84000000, 'expireOnClose': false, 'cookie': 'my_node_session', });
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
app.get("/", redirecUser, loginController.login);
app.get("/login", redirecUser,  loginController.login);
app.post("/login", redirecUser,  loginController.login);
app.get("/sign-up", redirecUser, loginController.signup);
app.post("/sign-up", redirecUser,  loginController.signup);
app.get("/logout",  loginController.logout);

//conversation
app.get("/conversation", auth, loginController.conversation);
app.get("/live-chat", auth, loginController.conversation);


//chat
app.get("/old-chat", auth,  loginController.chat);



//models
const User = require('./models/user.model');
const userOnline = require('./models/userOnline.model');
const Chat = require('./models/chat.model');






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




    //send private message
    socket.on('sendMessage', async (messageObject) => { 
      const toOnline = await userOnline.findOne({'user.id': messageObject.to.id });
      if(toOnline){
        console.log("Send Direct online mgs");
        messageObject.date = moment().format('LLLL');
        socket.to(toOnline.socketSession).emit('instantMessage', { messageObject });
      }

      socket.emit('displaySentMessage', { messageObject });

      var newMessage = new Chat({ 
          from: {id: messageObject.from.id, fullname: messageObject.from.fullname },
          to:   {id: messageObject.to.id, fullname: messageObject.to.fullname },
          message: messageObject.message,
          date: moment().format('LLLL')
      });
      newMessage.save(function(err, doc) {
        if(err)console.log(err);
        else console.log("Message send done"); 
      });
    }); 


    //load private chat
    socket.on('loadPrivateChatHistory', async (data) => { 
      const chatHistory = await Chat.find({ 
        "from.id" : { "$in": [data.from, data.user] },
        "to.id" : { "$in": [data.from, data.user] }
      });
      socket.emit('privateChatHistory', { chatHistory });
    });



    //make user online or offline----------------------------------------------------------
    const userInfo = await User.findById(userId);
    const isOnline = await userOnline.findOne({'user.id': userInfo.id });
    if(isOnline){
      await userOnline.updateOne( {'user.id': userId }, { socketSession: socket.id, isOnline: true } );
      //console.log("Connection Resume...");
      broadCastOnlineUser();
    }else{
      var connected = new userOnline({ 
        user: { id: userInfo.id, fullname: userInfo.fullname, username: userInfo.username },
        socketSession: socket.id,
        isOnline: true,
      });
      connected.save(function(err, doc) {
        if(err){
          console.log("failed to connect");
        }else {
          console.log("New user connected");
          broadCastOnlineUser();
        }
      });
    }
    //make user online of offline----------------------//--------------------------------






    //Typeing----------------------------------------------------------------------------
    socket.on('messageTypeing', async (data) => {
      const isOnline = await userOnline.findOne({'user.id': data.to.id, isOnline: true });
      if(isOnline){
        socket.to(isOnline.socketSession).emit('PlayMessageTypeing', { data });
      }
    }); 
    //-----------------------------------------------------------------------------------






    //on disconnect event----------------------------------------------------------------
    socket.on('disconnect', async () => {
        console.log("Disconnect a user: "+socket.id );
        //await userOnline.deleteOne( {'user.id': userId } );
        await userOnline.updateOne( {'user.id': userId }, { isOnline: false } );
        broadCastOnlineUser();
    });

    

    async function broadCastOnlineUser(){
      //const onlineUserList = await userOnline.find().sort({isOnline: -1});
      const onlineUserList = await userOnline.find();
      io.sockets.emit('broadcast', { onlineUserList });
    }

    
});





server.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});





