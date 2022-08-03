const jwt = require("jwt-simple");
const moment = require("moment");

const SECRET_KEY = "gHkb161bfHBVKh54bf";

exports.createAccesToken = function(user){
    const payload ={
        id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        dui: user.dui,
        phone: user.phone,
        role:user.role,
        createToken: moment().unix(),
        exp:moment().add(3, "hours").unix()
    };
    return jwt.encode(payload,SECRET_KEY);
}


exports.createRefreshToken=function(user){
    const payload={
        id:user._id,
        exp:moment().add(30,"days")
        .unix()
    };
    return jwt.encode(payload,SECRET_KEY);
};

   //Decodificando --------------
   exports.decodedToken=function(token){
    return jwt.decode(token,SECRET_KEY,true);
}

