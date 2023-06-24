const timeAgo = require('time-ago');

const mappingPostOutput = (post,userId) =>{
    return{
        _id:post._id,
        caption : post.caption,
        image:post.image,
        owner:{
            _id:post.owner._id,
            name:post.owner.name,
            avatar:post.owner.avatar
        },
        likesCount:post.likes.length,
        isLike:post.likes.includes(userId),
        timeAgo : timeAgo.ago(post.createdAt)
    }
}

module.exports = {
    mappingPostOutput
}