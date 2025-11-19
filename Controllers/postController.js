import { Post } from "../Models/usersPost.js";
import {User} from '../Models/userModel.js';
import getDataUri from "../utils/dataUri.js";
import cloudinary from 'cloudinary';
export const createpost= async (req,res,next)=>{
    try{
        const image=req.file;
        const {description,name,email,profilepic}=req.body;
        
        const fileUri=getDataUri(image);
        
        const mycloud= await cloudinary.v2.uploader.upload(fileUri?.content);
        const post=await Post.create({
            image:{
                public_id:mycloud?.public_id,
                url:mycloud?.secure_url,
            },
            name,
            email,
            description,
            profilepic,
        });
        let user;
        await User.findOneAndUpdate(
            { email: email },
            { $push: {posts:post._id} },
            { returnOriginal: false }
          )
            .then((value) => {
              user=value;
            })
            .catch((error) => {
              console.log(error);
            });
        
        return res.status(200).json({status:true,user,msg:'Post created successfully'});
    }
    catch(error){
        res.status(400).json({status:false,msg:error.message});
    }
}


export const getAllPosts=async (req,res,next)=>{
    try{
        const pageSize = req.body.pagesize;
        const pageIndex = req.body.pageindex;
        const post=await Post.find()
        .skip((pageIndex) * pageSize)
        .limit(pageSize)
        .sort({createdAt:-1});
        res.status(200).json({status:true,post});

    }
    catch(error){
        res.status(400).json({status:false,msg:error.message});
    }
}

export const like= async (req,res,next)=>{
try{
    var post = await Post.findOne({_id : req.body.postId});
        if(!post.likes.includes(req.user._id)){
    await Post.findByIdAndUpdate(req.body.postId,{
       $push:{likes:req.user._id}, 
    },{
        new:true,
    }
    ).then((value)=>{
        var likes=value.likes;
        res.status(200).json({status:true,likes});
    }).catch((error)=>{
        res.status(400).json({status:false,msg:error.message});
    })
}
else{
    res.status(400).json({status:false,msg:"User already liked this post"});
}

}
catch(error){
    res.status(400).json({status:false,msg:error.message});
}
}

export const unlike= async (req,res,next)=>{
    try{
        var post = await Post.findOne({_id : req.body.postId});
        if(post.likes.includes(req.user._id)){
            await Post.findByIdAndUpdate(req.body.postId,{
           $pull:{likes:req.user._id}, 
        },{
            new:true,
        }
        ).then((value)=>{
            var likes=value.likes;
            res.status(200).json({status:true,likes});
        }).catch((error)=>{
            res.status(400).json({status:false,msg:error.message});
        })

        }
        else{
            res.status(400).json({status:false,msg:"User never liked this post."});
        }
        
    
    }
    catch(error){
        res.status(400).json({status:false,msg:error.message});
    }
    }


    export const GetPostsByIds=async (req,res)=>{
  try{
    const ids=req.body.ids;
    const result = await Post.find({
  _id: { $in: ids }
});
    res.status(200).json({status:true,data:result});
    
  }
  catch(error){
    res.status(400).json({status:false,msg:error.message});
  }
}