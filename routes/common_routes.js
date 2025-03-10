const verifyIdTokken=require('../middlewares/UserIdTokkenVerification.middleware');

module.exports=function (app) {
    
    //Verifies whether the current user is available in specified role
    //Inputs: headers.authorization:role currentUserIdTokken
    //Returns: successMessage if identified successfully, errorMessage if unsuccessful
    app.get('/login',(req,res)=>{
        if(req.headers.authorization.split(' ')[0]=='afs'){
          return res.json({errorMessage:'Internal Server ERROR: Role is not set'});
        }
        const currentRole=req.headers.authorization.split(' ')[0];
        //try{
        const decodeValue=await verifyIdTokken(req.headers.authorization.split(' ')[1]);
        if(decodeValue){
        const ref=admin.database().ref("roles/"+currentRole+"/"+decodeValue.uid);
    
        ref.once('value', (snapshot) => {
            if(snapshot.hasChildren()){
            return res.json({successMessage:"User Exists in selected role"+JSON.stringify(snapshot.val())});
            }
            else{
            return res.json({errorMessage:"User DOES NOT exists in selected role"+JSON.stringify(snapshot.val())});
            }
        }, (errorObject) => {
            return res.json({errorMessage:"User DOES NOT exists in selected role"});
        }); 
        }
          
          //return res.json({errorMessage:'Unauthorized User'});
      //} catch(e){
       //   return res.json({errorMessage: 'Internal ERROR'});
      //}
        
    });
    
}
