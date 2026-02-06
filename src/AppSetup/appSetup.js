require("dotenv").config()
const express=require('express')
const connectDB = require("../Database/connectDB")

// setup express app
const app=express()

// database connection
connectDB();

// cors

// middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// routes


// export app
module.exports=app;