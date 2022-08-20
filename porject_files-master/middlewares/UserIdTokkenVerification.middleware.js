const admin=require('../config/firebaseConfig');
module.exports.verifyIdTokken=(tokken)=>{
    admin.auth().verifyIdToken(tokken).then(async(decodeValue)=>{
        //console.log(decodeValue);
            return decodeValue;
        }).catch((err)=>{
            return false;
        });
}