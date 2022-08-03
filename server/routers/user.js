const express =require("express");
const UserController = require("../controllers/user");
const multipart = require("connect-multiparty");
const md_auth = require("../middlewares/authenticated")
const md_upload_avatar = multipart({uploadDir: "./uploads/avatar"});

const api  = express.Router();
//RUTA DE INSERTAR--------------------------
api.post("/sign-up",UserController.signUp);

//RUTA DE LOGIN--------------------------
api.post("/sign-in",UserController.signIn);

//RUTA DE usuarios--------------------------
api.get("/users",[md_auth.ensureAuth],UserController.getUser);

api.get("/users-active",[md_auth.ensureAuth],UserController.getUserActive);

api.put("/upload-avatar/:id",[md_auth.ensureAuth,md_upload_avatar],UserController.uploadAvatar);

api.get("/get-avatar/:avatarName",UserController.getAvatar);

api.put("/update-user/:id",[md_auth.ensureAuth],UserController.updateUser);

api.put("/activate-user/:id",[md_auth.ensureAuth],UserController.activateUser);

api.delete("/delete-user/:id",[md_auth.ensureAuth],UserController.deleteUser);

module.exports=api;