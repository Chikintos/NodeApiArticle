const asyncHandler = require("express-async-handler")
const jwtoken = require ("jsonwebtoken")




const validateToken = asyncHandler(async(req,res,next)=>{
    let token;
    console.log(req.body)

    let authHeader = req.headers.Authorization || req.headers.authorization
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];
        jwtoken.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
            if(err){
                res.status(401)
                throw new Error("USER unauth")

            }
            req.user=decoded.user;
            next()
        });
        if(!token){
            res.status(401)
            throw new Error("BAD TOKEN")
        }
    }
    else{
        res.status(401)
        throw new Error("TOKEN NOT FOUND")}
    
});
module.exports=validateToken