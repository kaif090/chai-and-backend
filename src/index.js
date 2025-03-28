import dotenv from 'dotenv'
import connectDB from "./db/dbconnect.js";



dotenv.config({
    path: './env',
})




connectDB()






























// import express from 'express'

// const app=express()

// ;(async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("errror",(error)=>{
//             console.log("ERROR:",error);

//             app.listen(process.env.PORT,()=>{`app is listen on port ${process.env.PORT}`})
            
//         })
        
//     } catch (error) {
//         console.error("ERROR:",error);
//         throw err
        
//     }
// })()