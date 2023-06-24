 // the response for the frontend should not be like so difficult, we have to give response in the proper ways that is easier to handle all the things by frontend so easily.it should be in a detailed way like in an object => statuscode,errormessay,successmessage,result and all...

const successResponse=(statusCode,result)=>{
    return{
        status:'ok',
        statusCode,
        result
    }
}

const errorResponse=(statusCode,message)=>{
    return{
        status:'error',
        statusCode,
        message
    }
}


module.exports = {successResponse,errorResponse}