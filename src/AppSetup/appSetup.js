require("dotenv").config()
const express = require('express')
const connectDB = require("../Database/connectDB")
const cors = require('cors')
const compression = require("compression");
const authRoutes = require("../Routes/auth.routes")
const userRoutes = require("../Routes/user.routes")
const adminRoutes = require("../Routes/admin.routes")
const caregiverRoutes = require("../Routes/caregiver.routes")
const commonRoutes = require("../Routes/common.route");
// const sendMail = require("../utils/sendMail");

// setup express app
const app = express()

// database connection
connectDB();

// cors
app.use(cors({
    origin: "https://carely-sage.vercel.app",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(compression({
    threshold: 1024, // only compress responses > 1KB
    level: 6,        // balanced CPU vs compression
}));

// routes
// test route
// app.use("/test",(req,res)=>{
//     res.json({message:"API is working fine"})
// })
// protected route testing
// app.get('/protected', verifyclient, (req, res) => {
//     res.json({ message: `Hello ${req.client.name}, you have accessed a protected route!` });
// });
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/caregiver", caregiverRoutes)
app.use("/api/common", commonRoutes)
// app.get("/test-mail", async (req, res) => {
//     await sendMail({ to: process.env.MAIL_FROM, subject: "TESTING", text: "TESTING" })
//     return res.status(200)
// })
router.get("/keep-alive", (req, res) => {
    console.log("Keep alive ping:", new Date().toISOString());
    res.status(200).json({
        success: true,
        message: "Server is alive"
    });
});



// export app
module.exports = app;