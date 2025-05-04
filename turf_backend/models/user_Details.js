const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname: {type: String,required: true,},
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email']
    },
    phonenumber: {type: Number,required: true,},
    role: {
        type: String,
        required: true,
        enum: ['user']
    },
    password: {
        type: String,
        required: true
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
