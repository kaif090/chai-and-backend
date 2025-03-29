import dotenv from 'dotenv'
import connectDB from "./db/dbconnect.js";



dotenv.config({
    path: './env',
})




connectDB()
.then(()=>{

    console.log('server is not running:',err);
    
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is runing on ${process.env.PORT}`);
        
    })
    
})
.catch((err)=>{
    console.log('MONGO db connection failed !!!:',err);
    

})






























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