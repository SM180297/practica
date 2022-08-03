const jwt = require('../services/jwt');
const moment = require('moment');
const User = require('../models/user');

//coprob../services/jwto si el toque ha expirado del lado del servidor, para mas seguridad
function willExpiredToken(token){
    const{exp}=jwt.decodedToken(token);
    const currentDate=moment().unix();

    if (currentDate>exp) {
        return true;
        
    } 
    return false;
}

//refresca el acces token
function refreshAccessToken(req,res){

    const{refreshToken}=req.body;
    const isTokenExpired=willExpiredToken(refreshToken);
    if (isTokenExpired) {
        res.status(404).send({message:"El refreshTken ha expirado"});   
    } else {
        const{id}=jwt.decodedToken(refreshToken);

        User.findOne({_id:id},(err,userStored)=>{
            if (err) {
                res.status(500).send({message:"Error del servidor."});  
            } else {
                if (!userStored) {
                    res.status(404).send({message:"Usuario no encontrado."});
                }else{
                    res.status(200).send({
                        accessToken:jwt.createAccesToken(userStored),
                        refreshToken:refreshToken
                    });
                }
                
            }
        });
        
    }
}

module.exports={
    refreshAccessToken
};