const admin =require('../config/firebaseConfig')

class UserTokenAuthMiddleware{
    async decodeToken(req,res,next){
        
        if(req.headers.authorization){
            try{
                //console.log(token)
                const decodeValue=await admin.auth().verifyIdToken(req.headers.authorization);
                //console.log(decodeValue);
                if(decodeValue){
                    return next();
                }
                return res.send({errorMessage:'Unauthorized User'});
            } catch(e){
                return res.send({errorMessage: 'Internal ERROR:'+e.message});
            }
        }else if(req.body.headers.authorization){
            try{
                //console.log(token)
                const decodeValue=await admin.auth().verifyIdToken(req.body.headers.authorization);
                //console.log(decodeValue);
                if(decodeValue){
                    return next();
                }
                return res.send({errorMessage:'Unauthorized User'});
            } catch(e){
                return res.send({errorMessage: 'Internal ERROR:'+e.message});
            }
        }
    }
}

module.exports=new UserTokenAuthMiddleware();