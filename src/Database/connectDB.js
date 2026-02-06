require("dotenv").config()
const mongoose=require('mongoose')
const dbURI=process.env.MONGODB_URI

const connectDB=async()=>{
    try{
        await mongoose.connect(dbURI, {})
        console.log("Database connected successfully");
    }catch(err){
        console.log("Database connection failed", err);
        process.exit(1);
    }
}


module.exports=connectDB;