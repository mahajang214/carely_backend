require("dotenv").config()
const express=require('express')
const connectDB = require("../Database/connectDB")
const cors = require('cors')
// setup express app
const app=express()

// database connection
connectDB();

// cors
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    preflightContinue: false,
    optionsSuccessStatus: 204   
}));

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// routes
// test route
app.use("/test",(req,res)=>{
    res.json({message:"API is working fine"})
})


// export app
module.exports=app;