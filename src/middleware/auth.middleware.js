import { apierrors } from "../utils/apierrors.js";
import {asynchandler} from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asynchandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            throw new apierrors(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new apierrors(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new apierrors(401, error?.message || "Invalid access token")
    }
    
})