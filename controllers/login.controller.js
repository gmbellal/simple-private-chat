// const Model = require('../model');
// const {Product, Manufacturer} = Model;

const loginController = {
    
    login (req, res) {



        const payloadData = { pageTitle: 'Login', message: 'Hello there!' };
        res.render('index', payloadData );
    },


    signup (req, res) {
        res.send("signup");
    }
    
};

module.exports = loginController;