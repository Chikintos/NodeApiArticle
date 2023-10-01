const asyncHandler = require("express-async-handler")
const jwtoken = require ("jsonwebtoken")



const softValidateToken = asyncHandler(async(req,res,next)=>{
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];
        jwtoken.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
            if(err){
                req.auth=false
                return
            }
            else{
                req.auth=true
                req.user=decoded.user;
            }
        });
        if(!token){
            req.auth=false
        }
    }
    else{
        req.auth=false
    }
    next()
});
module.exports=softValidateToken