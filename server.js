const { configDotenv } = require("dotenv");
configDotenv();
const app=require("./src/AppSetup/appSetup")




app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});