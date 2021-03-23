const User = require('../models/user.model');
const userOnline = require('../models/userOnline.model');


const loginController = {
    

    async login (req, res) {
        if(req.method=="GET"){
            const payloadData = { pageTitle: 'Web Chat : Login' };
            return res.render('user/login', payloadData );
        }else{            
            const query = { 'username': req.body.username, 'password': req.body.password };
            const user =  await User.find( query );
            if(user.length == 1 ){
                res.redirect('/live-chat');
            }else{
                //
                const payloadData = { pageTitle: 'Web Chat : Login', errorMgs: 'Invalid username or password !' };
                return res.render('user/login', payloadData );
            }
        }
    },



    signup (req, res) {
        if(req.method=="GET"){
            const payloadData = { pageTitle: 'Web Chat : Signup' };
            res.render('user/signup', payloadData );
        }else{
            var newUser = new User({ fullname: req.body.fullname, username: req.body.username, password: req.body.password, socketSession: '' });
            newUser.save(function(err, doc) {
                if (err) return res.send(err);
                res.send("Signup Done");
            });
        }
    },



    chat (req, res) {
        const payloadData = { pageTitle: 'Web Chat : Signup' };
        res.render('chat/chat', payloadData );
    }


    
};

module.exports = loginController;