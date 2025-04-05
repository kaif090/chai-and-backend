import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'


cloudinary.config({
    cloud_name:process.env.CLOUDINERY_CLOUD_NAME,
    api_key: process.env.CLOUDINERY_API_KEY,
    api_secret:process.env.CLOUDINERY_API_SECRET

})

const uploadoncloudinary=async (filepath)=>{
    try {

        //upload the file
        if (! filepath) return null
        const uploadResponse = await cloudinary.uploader.upload(filepath, {
            resource_type: "auto",
        })
        //File has been uploaded
        // console.log("file is uploaded in cloudinary",uploadResponse.url);
        fs.unlinkSync(filepath)
        return uploadResponse
        
     
    } catch (error) {
        fs.unlinkSync(filepath) //remove the local save temporary file as the opreation is failed.
        return null
        
    }
    

}

export  {uploadoncloudinary};










// const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResult);