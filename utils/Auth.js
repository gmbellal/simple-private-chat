const jwt = require('jsonwebtoken');

const auth = (req,res,next) => {    
    const token = req.session.get('jwtSession');
    if (token == null) {
      return res.redirect("/login");
    }
    jwt.verify(token, "jgafugy$#54%%ygfsygfff", (err, username) => {
      if (err){
        return res.redirect("/login");
        
      }
      req.user = username;
      next();
    });
};



const redirecUser = (req,res,next) => {    
  const token = req.session.get('jwtSession');
  if (token == null) {
    next();
  }else{
    jwt.verify(token, "jgafugy$#54%%ygfsygfff", (err, username) => {
      if (err){
        next();
      }else{
        return res.redirect("/live-chat");
      }
    });
  }
};


module.exports = {
    auth,
    redirecUser
};