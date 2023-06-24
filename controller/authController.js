const User = require('../model/Users')
const bcrypt = require('bcrypt') // it is the modules which helps to secure/encrypted the password is hashedform.
const jwt = require('jsonwebtoken');
// generated the jsonwebtoken (jwt) => 
// when we log in some web like instagram and etc. then we have able to access our feed/post/data without login again.this features exactly give the same service.
// one more feature that it give the expiry time too to keep your id and credentials secure

const {successResponse,errorResponse} = require('../utils/responseWrapper')

const signUpController = async (req,res)=>{
    try{
        const {email,password,name} = req.body;
        const oldUser = await User.findOne({email})
        if(oldUser){
            // res.status(201).send("this user is already exist..!")
            // return; 
            return res.send(errorResponse(201,"User already exist..."))
        }
        const hashedPassword = await bcrypt.hash(password,10)
       const user =  await User.create({
        name,
        email,
        password:hashedPassword})
     res.send(successResponse(200,{success:true,message:"user created successfully..!"}))
    }catch(e){
        console.log(e)
    }
}

const loginController = async (req,res)=>{
   try {
        const {email,password} = req.body;
        const userExist = await User.findOne({email}).select('+password')
        // because we are hiding the password from showing bt for matched password we need that so this is the method .select('+password') to add password to . we can add + or - minus to show or not.
        if(!userExist){
            return res.send( errorResponse(201,"User is not registered...!"));
        }
        const matchedPassword = await bcrypt.compare(password,userExist.password)
        if(!matchedPassword){
            return res.send( errorResponse( 403,"Incorrect Password..!"));
        }
        const accessToken = generateAccessToken({_id:userExist._id,email:userExist.email})
        const refreshToken = generateRefreshToken({_id:userExist._id})

        // cookie('cookie name','data',{and multiple term like httpOnly:true (means frontend can't be access this cookie),and more})
        res.cookie('jwt_cookie',refreshToken,{
            httpOnly:true,
            secure:true
        })
        
         res.send(successResponse(200,{accessToken}))
   } catch (error) {
    console.log(error)
   }
}

const logoutController = async(req,res)=>{
    // for this just delete the cookies which have refresh token key so and frontend should delete the accesstoken from the local storage too. for logout.
    try {
        // this method delete the cookies which have refresh token for generatin the access token
        res.clearCookie('jwt_cookie',{
            httpOnly:true,
            secure:true
        })
    return res.send(successResponse(200,'user logged out...!'));
    } catch (error) {
        return res.send(errorResponse(500,error.message))
    }
}

// this api will check the refreshToken validity and generate a new Access Token
const refreshAccessTokenController = async(req,res)=>{
    const cookies = req.cookies;
    console.log("cookies is : ",cookies)
    if(!cookies.jwt_cookie){
        res.send(errorResponse(401,"Refresh token in cookie is Required...!"))
    }

    const refreshToken = cookies.jwt_cookie;

    try {
        const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_PRIVATE_KEY)
        const _id = decoded._id;
        const accessToken = generateAccessToken({_id})
       
        return res.json(successResponse(200,{accessToken}))
    } catch (error) {
        console.log(error)
        return res.send(errorResponse(401,'Invalid refresh token..!'))
    }
}


//----------------- Internal Functions-----------------------
//---------- function to generate the access token
const generateAccessToken = (data)=>{
    try {
        // it have two parameter first data which you give and second is should be `secret key of this token we can also add the expiry time`
        // const token = jwt.sign(data,process.env.ACCESS_TOKEN_PRIVATE_KEY,{expiresIn:'60s'})
        const token = jwt.sign(data,process.env.ACCESS_TOKEN_PRIVATE_KEY,{expiresIn:'1d'})
        // console.log(token);
        return token;
    } catch (error) {
        console.log(error)
    }
}

// function to generate the refresh token-----------------
const generateRefreshToken = (data)=>{
    try{
        const refreshToken = jwt.sign(data,process.env.REFRESH_TOKEN_PRIVATE_KEY,{expiresIn:'1y'})
        // console.log(refreshToken)
        return refreshToken;
    }catch(e){
        console.log(e)
    }
}


module.exports ={ signUpController,loginController,logoutController,refreshAccessTokenController}