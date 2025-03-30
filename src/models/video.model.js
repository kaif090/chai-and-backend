import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoschema=new Schema({
    videofile:{
        type:String,//cloudinary url
        required:true
    },
    thubnail:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,//cloudinary url
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    ispublished:{
        type:Boolean,
        default:true

    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User',
    }

},{timestamps:true})

videoschema.plugin(mongooseAggregatePaginate)

export const Video=mongoose.model("Video",videoschema)