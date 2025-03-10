// app.post('/create/profile',(req,res)=>{});
// app.post('/create/transaction',(req,res)=>{});
// app.get('/profile',(req,res)=>{});
// app.get('/requests',(req,res)=>{});
// app.get('/transactions',(req,res)=>{});
// app.get('/transactions/pending',(req,res)=>{});
// app.get('/transactions/success',(req,res)=>{});

// app.get('/pending',(req,res)=>{});
// app.get('/pending/transactions',(req,res)=>{});
// app.get('/pending/requests',(req,res)=>{});
const {getAllActiveRequests } = require('../models/Request.model')
const admin=require('../config/firebaseConfig');
const { encrypt } = require('../config/easypaisa/Easypaisa');
const { createDonorPendingTransaction, getDonorPendingTransactions } = require('../models/Transactions.model');
const { createUpdateDonorProfile, getDonorProfile } = require('../models/Profile.model');

module.exports=function (app) {
    
    //fetches all active requests data
    //Inputs: headers.authorization:currentUserIdTokken
    //Returns: body.data if successful, errorMessage if unsuccessful
    // app.get('/requests/active',async(req,res)=>{
    //     admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
    //         if(decodeValue){
    //             const data=await getAllActiveRequests();
    //             return res.send(data);
    //         }
    //         }).catch((err)=>{
    //             return false;
    //         });
    // });

    //Creates a new transaction.
    //Inputs: headers.authorization:currentUserIdTokken; transaction data in req.body
    //Returns: body.data if successful, errorMessage if unsuccessful
    app.post('/donor/transaction/create',async(req,res)=>{
        if(!req.body){
            return res.send({errorMessage:'Server did not received any data.'})
        }
        console.log(req.body)
        const {docId, amount,uid,RequestTitle,DeadlineDay,RequestUID}=req.body
        if(!docId || !amount || !uid || !RequestTitle || !DeadlineDay || !RequestUID){
            return res.status(400).send({errorMessage:'Invalid data sent to server'})
        }

        return res.send(await createDonorPendingTransaction({docId, amount, uid, RequestTitle, DeadlineDay, RequestUID}));
    })
    
    //fetches all donor transactions.
    //Inputs: headers.authorization:currentUserIdTokken;
    //Returns: body.data if successful, errorMessage if unsuccessful
    app.get('/donor/transactions',(req,res)=>{
        admin.auth().verifyIdToken(req.headers.authorization)
        .then(async(decodeValue)=>{
            if(decodeValue){
              return res.status(200).send(await getDonorPendingTransactions(decodeValue));
            }
        }).catch((err)=>{
            return res.status(500).send(err);
        });
    })

    //Creates a new donor profile.
    //Inputs: headers.authorization:currentUserIdTokken; profile data in req.body
    //Returns: body.data if successful, errorMessage if unsuccessful
    app.post('/donor/profile/create',(req,res)=>{
        if (req.method == 'POST') {
            var body = '';
      
            req.on('data', function (data) {
                body += data;
      
                // Too much POST data, kill the connection!
                // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                if (body.length > 1e6)
                    req.connection.destroy();
            });
      
            req.on('end', async()=>{
                // use post['blah'], etc.
                const data=JSON.parse(body);
                
                if(req.headers.authorization){
                  admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
                    if(decodeValue){
                      const code=await createUpdateDonorProfile(decodeValue,data);
                      res.send(()=>{
                        res.status(code);
                      })
                    }
                    }).catch((err)=>{
                        return false;
                    });
                  
                }
            });
        }
    })

    //fetches donor profile data.
    //Inputs: headers.authorization:currentUserIdTokken;
    //Returns: body.data if successful, errorMessage if unsuccessful
    app.get('/donor/profile',(req,res)=>{
        admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
            if(decodeValue){
              const data=await getDonorProfile(decodeValue);
              return res.send(JSON.stringify(data));
            }
            }).catch((err)=>{
                return false;
            });
    })

    //
}
