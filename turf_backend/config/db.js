const { default: mongoose } = require("mongoose")
const dotenv = require("dotenv")

const connectDB = async()=>{
    try {
         await mongoose.connect(process.env.MONGODB_URI)
         
         console.log("Connected to DB running successfully");
         
    } catch (error) {
        console.log(error);
        
    }
   
}

module.exports ={connectDB}