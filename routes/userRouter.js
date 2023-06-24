const userRouter = require('express').Router();
const { followOrUnfollowUserController, getPostsOfFollowingUserController, getMyPostsController, getSelectedUserPostController, deleteMyProfileController, getMyInfoController,updateMyProfileController,getUserProfileController } = require('../controller/userController');
const requiredUser  = require('../middleware/requiredUser');
userRouter.post('/follow',requiredUser,followOrUnfollowUserController);
userRouter.get('/getPostsOfFollowing',requiredUser,getPostsOfFollowingUserController);
userRouter.get('/getSelfPosts',requiredUser,getMyPostsController);
userRouter.post('/getSelectedUserPost',requiredUser,getSelectedUserPostController);
userRouter.delete('/deleteProfile',requiredUser,deleteMyProfileController)
userRouter.get('/getMyinfo',requiredUser,getMyInfoController);
userRouter.put('/updateProfile',requiredUser,updateMyProfileController)
userRouter.post('/getUserProfle',requiredUser,getUserProfileController)
module.exports = userRouter;