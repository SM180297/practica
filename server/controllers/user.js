const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const { exists } = require("../models/user");

// FUNCION DE INSERTAR--------------------------
function signUp(req, res) {
    const user = new User();
    const { name, lastname, email, phone, dui, password, repeatPassword } = req.body;
    user.name = name;
    user.lastname = lastname;
    user.phone = phone;
    user.dui = dui;
    user.email = email.toLowerCase();
    user.role = "admin";
    user.active = false;

    if (!password || !repeatPassword) {
        res.status(404).send({ message: "las contraseñas son obligatorias" })

    }
    else {

        if (password !== repeatPassword) {
            res.status(404).send({ message: "las contraseñas no son iguales" })

        }
        else {
            bcrypt.hash(password, null, null, function (err, hash) {
                if (err) {
                    res.status(500).send({ message: "error al incriptar la contraseña" })

                }
                else {
                    user.password = hash;

                    user.save((err, userStored) => {

                        if (err) {
                            res.status(500).send({ message: "el usuario ya existe o esta mandando letras en el dui y telefono" });
                        }
                        else {


                            if (!userStored) {
                                res.status(404).send({ message: "error al crear usuarios" });
                            }
                            else {
                                res.status(200).send({ user: userStored });

                            }
                        }


                    })

                }

            })
            //res.status(200).send({message:"Usuario creado"})
        }
    }
}
// FUNCION DE INSERTAR--------------------------


// FUNCION DE LOGIN--------------------------
function signIn(req, res) {
    const params = req.body;
    const email = params.email.toLowerCase();
    const password = params.password;

    User.findOne({ email }, (err, userStored) => {
        if (err) {
            res.status(500).send({ message: "Error del servidor." });
        }
        else {
            if (!userStored) {
                res.status(404).send({ message: "Usuario no encontrado." });
            } else {
                bcrypt.compare(password, userStored.password, (error, check) => {
                    if (err) {
                        res.status(500).send({ message: "Error del servidor." })
                    } else if (!check) {
                        res.status(404).send({ message: "La contraseña es incorrecta." })

                    }
                    else {
                        if (!userStored.active) {
                            res.status(200).send({
                                code: 200,
                                message: "El usuario no se ha activado."
                            });
                        }
                        else {
                            res.status(200).send({
                                accessToken: jwt.createAccesToken(userStored),
                                refreshToken: jwt.createRefreshToken(userStored)
                            })
                        }
                    }

                })

            }
        }

    });
}
// FUNCION DE LOGIN--------------------------

//mostrando user----------------------------
function getUser(req, res) {
    User.find().then(users => {
        if (!users) {
            res.status(404).send({ message: "No hay usuarios" });

        }
        else {
            res.status(200).send({ users });
        }
    });

}


//mostrando user activos----------------------------
function getUserActive(req, res) {
    const query = req.query;
    User.find({ active: query.active }).then(users => {
        if (!users) {
            res.status(404).send({ message: "No hay usuarios activos" });

        }
        else {
            res.status(200).send({ users });
        }
    });

}

//funcion de actualizar avatar  
function uploadAvatar(req, res) {
    const params = req.params;
    //console.log("actualizando avatar");
    User.findById({ _id: params.id }, (err, userData) => {
        if (err) {
            res.status(500).send({ message: "error del servidor" });

        }
        else {
            if (!userData) {
                res.status(404).send({ message: "No hay usuario encontrado" });

            }
            else {
                let user = userData;
                //console.log(user);
                //console.log(req.files);
                if (req.files) {
                    console.log(req.files);
                    let filePath = req.files.avatar.path;
                    let fileSplit = filePath.split("\\");
                    let flleName = fileSplit[2];
                    console.log(flleName);
                    let extSplit = flleName.split(".");
                    let fileExit = extSplit[1];
                    console.log(fileExit);
                    if (fileExit !== "png" && fileExit !== "jpg" && fileExit !== "jpeg") {
                        res.status(404).send({ message: "laextensiondelaimagen no esvalidad" });
                    }
                    else {
                        user.avatar = flleName;
                        User.findByIdAndUpdate({ _id: params.id }, user,
                            (err, userResult) => {
                                if (err) {
                                    res.status(500).send({ message: "error del servidor" });

                                }
                                else {
                                    if (!userResult) {
                                        res.status(404).send({ message: "nose ha encontrado ningun usuario" });

                                    }
                                    else {
                                        res.status(200).send({ user: userResult });
                                    }
                                }
                            })

                    }

                }

            }
        }

    });

}

//obtener la imagen -----------------------
function getAvatar(req, res) {
    const avatarName = req.params.avatarName;
    const filePath = "./uploads/avatar/"+avatarName;
    console.log(filePath);
    fs.exists(filePath,exists =>{
        if (!exists) {
            res.status(404).send({ message: "el avatar que buscas no existe" });

        }
        else {
          res.sendFile(path.resolve(filePath));
        }

    })
}

//funcion de actualizar avatar  
async function updateUser(req, res) {
    let userData = req.body;
    userData.email = req.body.email.toLowerCase()
    const params = req.params;

    if (userData.password) {
       await bcrypt.hash(userData.password,null,null,(err,hash)=>{
            if (err) {
            
                res.status(500).send({ message: "error al encriptar" });
            }
            else{
                userData.password=hash;
            }
        });
        
    }
    User.findByIdAndUpdate({_id: params.id},userData, (err,userUpdate)=>{
        if (err) {
            
            res.status(500).send({ message: "error del servidor" });
        }
        else{
            if (!userUpdate) {
            
                res.status(404).send({ message: "no se encontro ningun usuario" });
            }
            else{
                res.status(200).send({ message: "usuario actualizado correctamente" });
            }

        }
    })
   

}


//funcion de activar ususarios 
async function activateUser(req, res) {
    
    const {id} = req.params;
    const {active} = req.body;

 
    User.findByIdAndUpdate(id,{active}, (err,userStored)=>{
        if (err) {
            
            res.status(500).send({ message: "error del servidor" });
        }
        else{
            if (!userStored) {
            
                res.status(404).send({ message: "no se encontro ningun usuario" });
            }
            else{
                if (active===true) {
            
                    res.status(200).send({ message: "usuario activado" });
                }
                else{
                    res.status(200).send({ message: "usuario desactivado" });
                }
            }

        }
    });
}

//funcion de activar ususarios 
async function deleteUser(req, res) {
    
    const {id} = req.params;

 
    User.findByIdAndRemove(id, (err,userDelete)=>{
        if (err) {
            
            res.status(500).send({ message: "error del servidor" });
        }
        else{
            if (!userDelete) {
            
                res.status(404).send({ message: "no se encontro ningun usuario" });
            }
            else{
                    res.status(200).send({ message: "usuario eliminado correctamente" });

            }

        }
    });
}

module.exports = {
    signUp,
    signIn,
    getUser,
    getUserActive,
    uploadAvatar,
    getAvatar,
    updateUser,
    activateUser,
    deleteUser
};