const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const userOnline = require('../models/userOnline.model');


const loginController = {
    

    async login (req, res) {
        if(req.method=="GET"){
            const payloadData = { pageTitle: 'Web Chat : Login' };
            return res.render('user/login', payloadData );
        }else{            
            const query = { 'username': req.body.username, 'password': req.body.password };
            const user =  await User.findOne( query );
            if(user ){
                const token = jwt.sign({
                        user_id: user._id,
                        username: user.username,
                        fullname: user.fullname
                    }, "jgafugy$#54%%ygfsygfff", { expiresIn: '7 days' }
                );
                //crerate Session
                req.session.set('jwtSession', token);
                return res.redirect('/conversation');
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
            return res.render('user/signup', payloadData );
        }else{
            var newUser = new User({ fullname: req.body.fullname, username: req.body.username, password: req.body.password, socketSession: '' });
            newUser.save(function(err, doc) {
                if (err) return res.send(err);
                return res.redirect("/login");
            });
        }
    },



    chat (req, res) {
        const payloadData = { pageTitle: 'Web Chat : Signup', userId: req.user.user_id, fullname: req.user.fullname };
        return res.render('chat/chat', payloadData );
    },


    logout (req, res) {
        req.session.forget('jwtSession');
        return res.redirect("/login");
    },


    conversation(req, res) {
        const payloadData = { pageTitle: 'Web Chat : Signup', userId: req.user.user_id, fullname: req.user.fullname };
        return res.render('conversation/chat', payloadData);
    }


    
};

module.exports = loginController;