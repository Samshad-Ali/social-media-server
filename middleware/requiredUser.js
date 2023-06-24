const jwt = require('jsonwebtoken');
const {successResponse,errorResponse}=require('../utils/responseWrapper');
const Users = require('../model/Users');

const requireUser = async(req,res,next)=>{
    if(!req.headers || !req.headers.authorization || !req.headers.authorization.startsWith("Bearer"))
    {
        return res.send(errorResponse(401,"Authrization header is required...!"))
    }

        const accessToken = req.headers.authorization.split(" ")[1];
        //headers :- some data send into headers to verification to API like token etc. we should send only important data like token and all . 
        // because we get from req.headers.authorization token like this => "bearer space token" 
        // so we split the token part by doing this.
    try {
        const decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_PRIVATE_KEY)
        req._id = decoded._id;
        // console.log("header",req.headers)
        // console.log("from decoded",decoded)
        const user =await Users.findById(req._id);
        if(!user){
            res.send(errorResponse(404,"User not Found..!"))
        }
        next();
    } catch (error) {
        console.log(error);
        return res.send(errorResponse(401,"Invalid access key...!"))

    }
    // next();

}

module.exports = requireUser;