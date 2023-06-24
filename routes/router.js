const mainRouter = require('express').Router();
const authRouter = require('./authRouter');
const postRouter = require('./postRouter');
const userRouter = require('./userRouter')
mainRouter.use('/auth',authRouter);
mainRouter.use('/post',postRouter)
mainRouter.use('/user',userRouter)
module.exports = mainRouter;