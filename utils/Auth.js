const jwt = require('jsonwebtoken');

const auth = (req,res,next) => {    
    const token = req.session.get('jwtSession');
    if (token == null) {
        res.redirect("/login");
    }
    jwt.verify(token, "jgafugy$#54%%ygfsygfff", (err, username) => {
      if (err){
        res.redirect("/login");
      }
      next();
    });
};


module.exports = {
    auth
};