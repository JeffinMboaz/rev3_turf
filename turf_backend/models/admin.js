const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email'],
    },
    phonenumber:{
        type:Number,
        required: true,
    },
    role:{
        type:String,
        required: true,
    },
    password:{
        type:String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);
