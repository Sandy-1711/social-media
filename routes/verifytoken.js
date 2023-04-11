const jwt=require('jsonwebtoken');
const verifyToken=function(req, res, next) {
    const authHeader=req.headers.token;
    if(authHeader)
    {
        const token=authHeader.split(' ')[1];
        jwt.verify(token,process.env.JWT_SEC,function(err,user){
            if(err){
                return res.status(401).json({message:'Invalid Token'});
            }
            req.user=user;
            console.log("reached here")
            next();
        });
    }
    else
    {
        return res.status(401).json("Not authenticated");
    }
}
const verifyTokenAndAuthorization=function(req,res,next){
    verifyToken(req,res,function(){
        console.log(req.user.id+"\n"+req.params.id+"\n"+req.user.isAdmin);
        console.log(req.user.id===req.params.id);
        if(req.user.id===req.params.id){
            console.log("reaching here")
            next();

        }
        else
        {
            return res.status(403).json("You are not authorized to do that");


        }
    })
};
const verifyTokenAndAdmin=function(req,res,next){
    verifyToken(req,res,function(){
        if(req.user.isAdmin){
            next();
        }
        else
        {
            return res.status(403).json("You are not authorized to do that");
        }
    })
}
module.exports={verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin};