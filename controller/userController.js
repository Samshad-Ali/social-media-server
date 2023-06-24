const Posts = require("../model/Posts");
const Users = require("../model/Users");
const { errorResponse, successResponse } = require("../utils/responseWrapper");
const { mappingPostOutput } = require("../utils/utils.js");
const cloudinary = require("cloudinary").v2;
const followOrUnfollowUserController = async (req, res) => {
  try {
    const { userIdToFollow } = req.body;
    const curUserId = req._id;
    const userToFollow = await Users.findById(userIdToFollow);
    const curUser = await Users.findById(curUserId);
    if (userIdToFollow === curUserId) {
      res.send(errorResponse(409, "User Cannot follow themeselves"));
    }
    if (!userToFollow) {
      return res.send(errorResponse(404, "User to follow not found.."));
    }
    if (curUser.followings.includes(userIdToFollow)) {
      //unfollowing if user followed already and vice versa.
      // if someone follow the user then it show in follower list of the user and user show in following list.
      const followingIndex = curUser.followings.indexOf(userIdToFollow);
      curUser.followings.splice(followingIndex, 1);

      const follwerIndex = userToFollow.followers.indexOf(curUserId);
      userToFollow.followers.splice(follwerIndex, 1);
    } else {
      // following if not following the user and vice versa
      curUser.followings.push(userIdToFollow);
      userToFollow.followers.push(curUserId);
    }
    await userToFollow.save();
    await curUser.save();
    return res.send(successResponse(200,{user:userToFollow}))
  } catch (error) {
    return res.send(errorResponse(500, error.message));
  }
};

const getPostsOfFollowingUserController = async (req, res) => {
  // it get all the post of which this user follow (his following users post)
  try {
    const curUserId = req._id;
    const curUser = await Users.findById(curUserId).populate('followings');
    const fullPosts = await Posts.find({
      owner: {
        // it means that jis jis post ke owner mere current following ke andar aa rhe , just give me their all posts
        $in: curUser.followings,
      },
    }).populate('owner');

    const posts = fullPosts
    .map((item) => mappingPostOutput(item, req._id))
    .reverse();
    const followingIds = curUser.followings.map(item => item._id);
    followingIds.push(req._id);
    const suggestions = await Users.find({
      _id:{
        '$nin':followingIds
        // means that is brought all the id in which this followingIds is not present
      }
    })

    res.send(successResponse(200, {...curUser._doc,suggestions,posts}));
  } catch (error) {
    return res.send(errorResponse(500, error.message));
  }
};

const getMyPostsController = async (req, res) => {
  try {
    const userId = req._id;
    // const allPosts = await Posts.find({
    //   owner: {
    //     $in: userId,
    //   },
    // });
    // ------------or----------------
    const allPosts = await Posts.find({
      owner: userId,
    }).populate("likes");
    // .populate('reference) -> it gives the full detail of people who likes the post
    if (!allPosts) {
      return res.send(errorResponse(404, "Post not Found"));
    }
    return res.send(successResponse(200, allPosts));
  } catch (error) {
    return res.send(errorResponse(500, error.message));
  }
};

const getSelectedUserPostController = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.send(errorResponse(400, "User_id is required.."));
    }
    const post = await Posts.find({
      owner: {
        $in: userId,
      },
    }).populate("likes");

    if (!post) {
      return res.send(errorResponse(404, "Post not Found"));
    }
    return res.send(successResponse(200, post));
  } catch (error) {
    return res.send(errorResponse(500, error.message));
  }
};

const deleteMyProfileController = async (req, res) => {
  try {
    const userId = req._id;
    const curUser = await Users.findById(userId);
    if (!curUser) {
      return res.send(errorResponse(404, "User not found..!"));
    }
    // if want to delete our profile then it should be deleted after deleting all the things related to this profile so we have to delete all his/her post, followers ,following and further.

    // delete all user's post
    await Posts.deleteMany({
      owner: userId,
    });

    // remove myself from the follower's following. means jitne mere followers hai unke following list me se delete hona
    curUser.followers.forEach(async (followerId) => {
      const follower = await Users.findById(followerId);
      const index = follower.followings.indexOf(userId);
      follower.followings.splice(index, 1);
      await follower.save();
    });

    // remove myself from my following's followers. means jitne logo ko maine follow kiya hai unke follwer list me se delete hona;
    curUser.followings.forEach(async (followingId) => {
      const followingUser = await Users.findById(followingId);
      const index = followingUser.followers.indexOf(userId);
      followingUser.followers.splice(index, 1);
      await followingUser.save();
    });

    // remove myself from all likes, that i liked
    const allPosts = await Posts.find();
    allPosts.forEach(async (post) => {
      const index = post.likes.indexOf(userId);
      post.likes.splice(index, 1);
      await post.save();
    });

    // now delete the user
    await curUser.deleteOne();

    // delete the cookies to because this user is no longer exist...!
    res.clearCookie("jwt_cookie", {
      httpOnly: true,
      secure: true,
    });
    return res.send(successResponse(200, "User deleted successfully..!"));
  } catch (error) {
    console.log(error);
    return res.send(errorResponse(500, error.message));
  }
};

const getMyInfoController = async (req, res) => {
  try {
    const userId = req._id;
    const user = await Users.findById(userId);
    return res.send(successResponse(200, { user }));
  } catch (error) {
    return res.send(errorResponse(500, error.message));
  }
};

const updateMyProfileController = async (req, res) => {
  try {
    const { name, bio, img } = req.body;
    const user = await Users.findById(req._id);
    if (name) {
      user.name = name;
    }
    if (bio) {
      user.bio = bio;
    }
    if (img) {
      const cloudImg = await cloudinary.uploader.upload(img, {
        folder: "user_profile_images",
      });
      user.avatar = {
        url: cloudImg.secure_url,
        publicId: cloudImg.public_id,
      };
    }
    await user.save();
    return res.send(successResponse(200, { user }));
  } catch (error) {
    return res.send(errorResponse(500, error.message));
  }
};



const getUserProfileController = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await Users.findById(userId).populate({
      path: "posts",
      populate: {
        path: "owner",
      },
    });
    const fullPosts = user.posts;
    const posts = fullPosts
      .map((item) => mappingPostOutput(item, req._id))
      .reverse();
     // we get the post in order like first second and so on bt we want recent post up so we put reverse.
    return res.send(successResponse(200, { ...user._doc, posts }));
     // user._doc give the relevant information. and upate this with posts.
  } catch (e) {
    console.log("error put", e);
    return res.send(errorResponse(500, e.message));
  }
};

module.exports = {
  followOrUnfollowUserController,
  getPostsOfFollowingUserController,
  getMyPostsController,
  getSelectedUserPostController,
  deleteMyProfileController,
  getMyInfoController,
  updateMyProfileController,
  getUserProfileController,
};
// make getmyposts , getuserpost , delete account with from likes following and follower to .
