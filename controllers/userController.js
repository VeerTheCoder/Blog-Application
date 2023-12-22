const userModel=require("../models/userModel");
const bcrypt=require('bcrypt');

exports.getAllUsers=async(req,resp)=>{
    try {
        const user=await userModel.find({});
        return resp.status(200).send({
            userCount:user.length,
            message:"Users are",
            success:true,
            user
        })
    } catch (error) {
        return resp.status(500).send({
            message:"Error in Get All User",
            success:false
        })
    }
};

exports.registerController = async(req,resp) =>{
    try {
        const {username,email,password}= req.body;
        if(!username || !email || !password){
            return resp.status(400).send({
                success:false,
                message:"Every Field is required"
            });
        }
        const existingUser=await userModel.findOne({email})
        if(existingUser){
            return resp.status(401).send({
                success:false,
                message:"User already exist",
                error
            })
        }
        else{
            const hashPassword=await bcrypt.hash(password,10);    
            const user=new userModel({username,email,password:hashPassword});
            await user.save();
            return resp.status(201).send({
                message:"User Created Successfully",
                success:true,
                user
            })
        }
        
    } catch (error) {
        console.log(error);
        return resp.status(500).send({
            success:false,
            message:"User not Created",
            error
        });
    }
};

exports.loginController =async(req,resp)=>{
    try {
        const {email,password}=req.body;
        if(!email && !password){
            return resp.status(400).send({
                message:"Can't leave any field empty",
                success:false
            });
        }
        const userExist=await userModel.findOne({email});
        if(!userExist){
            return resp.status(200).send({
                message:"User Not exist",
                success:false
            })
        }
        const matchPassword=await bcrypt.compare(password,userExist.password);
        if(!matchPassword){
            return resp.status(401).send({
                message:"Invalid User or Password",
                success:false
            })
        }
        return resp.status(200).send({
            message:"Login Successful",
            success:true,
            userExist
        })

    } catch (error) {
        return resp.status(500).send({
            message:"Error at Login",
            success:false
        })
    }
};