const { default: mongoose } = require('mongoose');
const blogModel=require('../models/blogModel');
const userModel = require('../models/userModel');

exports.getAllBlogController=async(req,resp)=>{
    try {
        const blog=await blogModel.find({}).populate("user");
        if(!blog){
            return resp.status(200).send({
                message:"No Blog Exists",
                success:false
            })
        }
        return resp.status(200).send({
            message:"The Blogs list are",
            success:true,
            blogCount:blog.length,
            blog
        });
    } catch (error) {
        return resp.status(500).send({
            message:"Error while get all Blog",
            success:false,
            error
        })
    }
};

exports.createBlogController=async(req,resp)=>{
    try {
        const {title,description,image ,user}= req.body;
        if(!title || !description || !image || !user){
            return resp.status(400).send({
                success:false,
                message:"Please provide all fields"
            });
        }
        const existingUser=await userModel.findById(user);
        if(!existingUser){
            return resp.status(400).send({
                success:false,
                message:"unable to find user"
            })
        }

        const blogData=new blogModel({title,description,image,user});

        const session= await mongoose.startSession();
        session.startTransaction()
        await blogData.save({session})
        existingUser.blogs.push(blogData)
        await existingUser.save({session})
        await session.commitTransaction()

        await blogData.save();
        return resp.status(200).send({
            message:"Blog Created Successfully",
            success:true,
            blogData
        });
    } catch (error) {
        return resp.status(400).send({
            success:false,
            message:"Error while creating blog",
            error
        })
    }
};

exports.updateBlogController=async(req,resp)=>{
    try {
        const {id}= req.params;
        const blog=await blogModel.findByIdAndUpdate(id,{...req.body},{new:true});
        return resp.status(200).send({
            message:"Blog Updated",
            success:true,
            blog
        })
    } catch (error) {
        return resp.status(500).send({
            message:"Error while updating",
            success:false,
            error
        })
    }
};

exports.getBlogByIdController=async(req,resp)=>{
    try {
        const {id}=req.params;
        const blog=await blogModel.findById(id);
        if(!blog){
            return resp.status(400).send({
                message:"Blog not found",
                success:false,
            })
        }
        return resp.status(200).send({
            message:"Blogs is",
            success:true,
            blog
        })
    } catch (error) {
        return resp.status(500).send({
            message:"error while getting blog",
            success:false,
            error,
        })
    }
};

exports.deleteBlogController=async(req,resp)=>{
    try {
        const {id}=req.params;
        const blog=await blogModel.findByIdAndDelete(id).populate("user");
        await blog.user.blogs.pull(blog)
        await blog.user.save()
        if(!blog){
            return resp.status(400).send({
                message:"Blog Not exist",
                success:false
            })
        }
        return resp.status(200).send({
            message:"Deleted Successfully",
            success:false,
            blog
        })
    } catch (error) {
        console.log(error)
        return resp.status(500).send({
            message:"Error while deteting",
            success:false,
            error
        })
    }
};

exports.userBlogController=async(req,resp)=>{
    try {
        const userblog=await userModel.findById(req.params.id).populate('blogs');
        if(!userblog){
            return resp.status(400).send({
                message:"Blog not found",
                success:false
            })
        }
        return resp.status(200).send({
            message:"Blog Found",
            success:true,
            userblog
        })
    } catch (error) {
        return resp.status(400).send({
            message:"Error while getting blog",
            success:false,
            error
        })
    }

}