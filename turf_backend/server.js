const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser")
const {connectDB} = require('./config/db')
const userAuthRoutes = require("./routes/userroutes");

dotenv.config();
const app =express();
const PORT =process.env.PORT || 5009;

app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        origin: ["http://localhost:5173","https://rev3-turf.vercel.app/"],
        methods:["GET","POST","DELETE","PUT","OPTIONS"],
        credentials: true,
      }
));
connectDB();

app.use("/api/auth", userAuthRoutes);

// start server
app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT} `);
});