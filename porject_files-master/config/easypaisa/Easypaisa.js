const mCrypto=require('crypto');
const {RSA_PUBLIC_KEY, BASE_URL, X_IBM_CLIENT_ID, X_IBM_CLIENT_SECRET} =require('./EasypaisaKeys');
const request=require('request');
const { default: axios } = require('axios');
const { readFileSync, readFile } = require('fs');

//Message encryption using RSA/PKCS1/PADDING suite 
module.exports.encrypt=async(req,res)=>{
    if(req.body.message){
        const binaryData = Buffer.from(JSON.stringify(req.body.message));
        readFile(__dirname+'/certificate.cer',(err,data)=>{
            if(err){
                console.log(err)
            }
            console.log('encrypted:',req.body.message);
            var publicKey = mCrypto.createPublicKey(data);
            return res.send({encrypted:mCrypto.publicEncrypt({key:publicKey,padding:mCrypto.constants.RSA_PKCS1_PADDING},binaryData).toString('base64')});
        })
    }    
}

// //Generate Login tokken
// module.exports.generateLoginToken=async(msisdn)=>{
//     const x_msisdn = this.encrypt(msisdn)
//     const url=BASE_URL+'/LoginAPI/token'
//     const options = {
//         headers: {
//           'X-IBM-Client-Id': X_IBM_CLIENT_ID,
//           'X-IBM-Client-Secret': X_IBM_CLIENT_SECRET,
//           'X-Msisdn': x_msisdn,
//           'X-Channel': ''
//         }
//       };
//       axios.post(url,options)
//       request(options,(error,response,body)=>{
//           if(error){
//               return error;
//           }else if(body){
//               return body;
//           }else{
//               return response;
//           }
//       })
      
// }
// //Generate a Login page
// module.exports.generateLogin=(msisdn)=>{
//     const x_msisdn = this.encrypt(msisdn)
//     const options = {
//         method: 'POST',
//         url: BASE_URL+'/LoginAPI/token',
//         headers: {
//           'X-IBM-Client-Id': X_IBM_CLIENT_ID,
//           'X-IBM-Client-Secret': X_IBM_CLIENT_SECRET,
//           'X-Msisdn': x_msisdn,
//           'X-Channel': ''
//         },
//         body: {Amount: '785999974105088', MSISDN: 'hiorus', ReceiverMSISDN: 'cipi'},
//         json: true
//       };
// }
