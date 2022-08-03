
const mongoose= require("mongoose");
const Schema = mongoose.Schema;

//aca agregamos los capos que mandaremos a mongo-----------
const UserSchema = Schema({
    name:String,
    lastname:String,
    phone:Number,
    dui:{
        type:Number,
        unique:true
    },
    email:{
        type:String,
        unique:true
    },
    password:String,
    role:String,
    active:Boolean,
    avatar: String

});

//aca agregamos los capos que mandaremos a mongo-----------

module.exports=mongoose.model("User",UserSchema);