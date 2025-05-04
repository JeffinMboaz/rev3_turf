const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema({
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
    role: { type: String, required: true, enum: ['manager'] },
    password: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // 👈 Added
}, { timestamps: true });

module.exports = mongoose.model("Manager", managerSchema);
