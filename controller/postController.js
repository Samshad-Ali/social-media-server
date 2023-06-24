const Posts = require("../model/Posts");
const Users = require("../model/Users");
const { successResponse, errorResponse } = require("../utils/responseWrapper");
const { mappingPostOutput } = require("../utils/utils");
const cloudinary = require('cloudinary').v2;

const CreatePostController = async (req, res) => {
  try {
    const { caption,postImg } = req.body;
    if(!caption || !postImg){
      return res.send(errorResponse(400,"Caption and image is Required..!!"))
    }
      const cloudImg = await cloudinary.uploader.upload(postImg,{
        folder:'user_post_images'
      })
    
    const owner = req._id;
    const user = await Users.findById(req._id);
    const post = await Posts.create({
      owner,
      caption,
      image:{
        publicId:cloudImg.public_id,
        url:cloudImg.url
      }
    });
    user.posts.push(post._id);
    await user.save();
    res.send(successResponse(201, {post}));
  } catch (e) {
    return res.send(errorResponse(500, e.message));
  }
};

const likeAndDislikePostController = async (req, res) => {
  try {
    const {postId} = req.body;
    const curUserId = req._id;
  
    const post = await Posts.findById(postId).populate('owner')
    if(!post){
     return res.send(errorResponse(404,"Post not found.."))
    }
  
    if(post.likes.includes(curUserId)){  // unlike the post if liked before
      const index = post.likes.indexOf(curUserId);
      post.likes.splice(index,1);
    }else{ // liked the post if unliked before
      post.likes.push(curUserId);
    }
    await post.save();
    return res.send(successResponse(200,{post:mappingPostOutput(post,req._id)}))  
  } catch (error) {
    res.send(errorResponse(500, error.message));
  }
};


const updatePostController = async (req,res) =>{
  try {
    const {postId,caption} = req.body;
    const curUserId = req._id;
    const post = await Posts.findById(postId);
    if(!post){
      return res.send(errorResponse(404,'Post not found'))
    }
    
    if(post.owner.toString() !== curUserId){ // only owner can update the post of if not same so can't allowed.
      
      return res.send(errorResponse(403,'Only owners can update their posts..!'))
   }

   if(caption){
    post.caption = caption;
   }

   await post.save();
  return res.send(successResponse(200,{post,message:'Post Updated..!'}))
  } catch (error) {
    res.send(errorResponse(500,error.message))
  }
}


const deletePostController = async (req,res)=>{
  try {
    const {postId} = req.body;
    const curUserId = req._id;
    const post = await Posts.findById(postId);
    const curUser = await Users.findById(curUserId)
    if(!post){
      return res.send(errorResponse(404,'Post not found'))
    }
    
    if(post.owner.toString() !== curUserId){ // only owner can delete the post of if not same so can't allowed.
      return res.send(errorResponse(403,'Only owners can delete their posts..!'))
   }
   const index = curUser.posts.indexOf(postId);
   curUser.posts.splice(index,1);
   await curUser.save();
   await post.deleteOne();
   return res.send(successResponse(200,'post deleted...'))
    
  } catch (error) {
    console.log(error)
    res.send(errorResponse(500,error.message))
    
  }
}

module.exports = { CreatePostController,likeAndDislikePostController,updatePostController,deletePostController };
