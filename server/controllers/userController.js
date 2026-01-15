import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// Sign up new user
export const signup =async(req,res)=>{
    const{fullName,email,password,bio}=req.body;
    try{
        if(!fullName || !email || !password || !bio){
            return res.json({success:false,message:"Missing Details"})
    }
    const user=await User.findOne({email});
    if(user){
        return res.json({success:false,message:"User already exists"});
    }
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);

    const newUser= await User.create({
        fullName,email,password:hashedPassword,bio
    });

    const token= generateToken(newUser._id);
    
    res.json({success:true,userData:newUser,token,message:"Account created successfully"});
}catch(error){
    console.log(error.message);
     res.json({success:false,message:error.message});
}}

// Controller to login a user
export const login = async(req,res)=>{
    try{
    const{email,password}=req.body;
    const userData= await User.findOne({email})

    const isPassswordCorrect = await bcrypt.compare(password,userData.password);

    if(!isPassswordCorrect){
        return res.json({success:false,message:"Invalid Credentials"});
    }
       const token= generateToken(userData._id);
    
    res.json({success:true,userData,token,message:"Login successful"});
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message}); 
    }
}

//Controller to check if user is authenticated
export const checkAuth=(req,res)=>{
    res.json({success:true,user:req.user});
}

//Controller to update user profile
export const updateProfile=async(req,res)=>{
    try {
        const {profilePic,fullName,bio}=req.body;
        const userId=req.user._id;

        // // Debug logs to help diagnose update issues
        // console.log('updateProfile called for user:', userId);
        // console.log('profilePic present:', !!profilePic);
        // if (profilePic) {
        //     console.log('profilePic size (chars):', profilePic.length);
        //     if (profilePic.length > 4 * 1024 * 1024) {
        //         console.warn('profilePic payload is large (>4MB). Consider increasing express.json limit or resizing the image before upload.');
        //     }
        // }
        // console.log('fullName:', fullName, 'bio length:', bio ? bio.length : 0);

        let updatedUser;
        if(!profilePic){
            // return the updated document
            updatedUser= await User.findByIdAndUpdate(userId,{bio,fullName},{ new:true })
        }else{
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser= await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{ new:true}); 
        }
        // return the updated user under `user` key to be consistent
        res.json({success:true,user:updatedUser,message:"Profile updated successfully"});
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}