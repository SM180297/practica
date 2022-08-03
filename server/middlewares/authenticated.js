const jwt= require("jwt-simple");
const moment = require("moment");
const SECRET_KEY = "gHkb161bfHBVKh54bf";

exports.ensureAuth=(req,res,next)=>{
    if (!req.headers.authorization) {
        return res
        .status(403)
        .send({message: "la peticion no tiene cabecera "})
        
    }
    const token = req.headers.authorization.replace(/['"]+/g, "");

try {
    var payload = jwt.decode(token, SECRET_KEY);
    if (payload.exp <= moment.unix()) {
        return res
        .status(404)
        .send({message: "eltoken ha expirado "})
        
    }
    
} catch (ex) {
    return res
    .status(404)
    .send({message: "token invalido "})
    
}
req.user = payload;
next();

};