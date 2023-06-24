const postRouter = require('express').Router();
const {CreatePostController, likeAndDislikePostController,updatePostController, deletePostController} = require('../controller/postController')
const requireUserMiddleware = require('../middleware/requiredUser')


postRouter.post('/create',requireUserMiddleware,CreatePostController)
postRouter.post('/like',requireUserMiddleware,likeAndDislikePostController)
postRouter.put('/update',requireUserMiddleware,updatePostController)
postRouter.delete('/delete',requireUserMiddleware,deletePostController)
module.exports = postRouter;