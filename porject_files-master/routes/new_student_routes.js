//const {getStudentCancelledRequests,getStudentActiveRequests,getStudentPendingRequests, createStudentPendingRequest, getStudentPausedRequests, getStudentPendingRequest, removeStudentPendingRequest, createStudentPausedRequest, getStudentPausedRequest, getStudentActiveRequest, removeStudentActiveRequest, removeStudentPausedRequest, createStudentActiveRequest} = require('../models/Request.model')
const {createPendingCampaign, createActiveCampaign, createPausedCampaign, createCancelledCampaign, createFulfilledCampaign, createRejectedCampaign} = require('../models/Campaign.model');
const {createUpdateStudentProfile,getStudentProfile} =require('../models/Profile.model');
const {createStudentPendingTransaction,getStudentPendingTransactions,getStudentCompletedTransactions} =require('../models/Transactions.model');
const admin=require('../config/firebaseConfig');
const { createStudentWithdrawRequest, getStudentWithdrawRequests } = require('../models/Withdraw.model');
const { getCampaignsByStatus } = require('../models/Campaign.model');
const {CAMPAIGN_STATUS} = require('../config/constents');
module.exports=function (app) {
  
  //Creates new Request instance
  //Inputs: headers.authorization:currentUserIdTokken, Request data in body
  //Returns: status.code if successful, errorMessage if unsuccessful 
  app.post('/student/create/request',async(req,res)=>{
    if(req.body){
        admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
          if(decodeValue){
              console.log(req.body)
            const code=await createPendingCampaign(decodeValue.uid,req.body);
            console.log(code)
            return res.send(code);
          }
        }).catch((err)=>{
            return res.send(err);
        }); 
      }
  });
  
  //Reads pending Requests data
  //Inputs: headers.authorization:currentUserIdTokken
  //Returns: body.data if successful, errorMessage if unsuccessful
  app.get('/student/requests/pending',async(req,res)=>{
    admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
      if(decodeValue){
        const data =await getCampaignsByStatus(decodeValue.uid,CAMPAIGN_STATUS.PENDING);
        return res.send(data);
      }
      }).catch((err)=>{
          return false;
      });
      
  });
  
  //Reads active Requests data
  //Inputs: headers.authorization:currentUserIdTokken
  //Returns: body.data if successful, errorMessage if unsuccessful
  app.get('/student/requests/active',async(req,res)=>{
    admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
      if(decodeValue){
        const data =await getCampaignsByStatus(decodeValue.uid,CAMPAIGN_STATUS.ACTIVE);
        return res.send(data);
      }
      }).catch((err)=>{
          return false;
      });
      
  });
  
  //Reads cancelled Requests data
  //Inputs: headers.authorization:currentUserIdTokken
  //Returns: body.data if successful, errorMessage if unsuccessful
  app.get('/student/requests/cancelled',async(req,res)=>{
    admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
      if(decodeValue){
        const data=await getCampaignsByStatus(decodeValue.uid,CAMPAIGN_STATUS.CANCELLED);
        return res.send(data);
      }
      }).catch((err)=>{
          return false;
      });
      
  });

  //Reads paused Requests data
  //Inputs: headers.authorization:currentUserIdTokken
  //Returns: body.data if successful, errorMessage if unsuccessful
  app.get('/student/requests/paused',async(req,res)=>{
    admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
      if(decodeValue){
        const data =await getCampaignsByStatus(decodeValue.uid,CAMPAIGN_STATUS.PAUSED);
        return res.send(data);
      }
      }).catch((err)=>{
          return false;
      });
      
  });

  //Pauses an active Campaing(donation request)
  //Inputs: headers.authorization:currentUserIdTokken, docId of specified request in body
  //Returns: body.data if successful, errorMessage if unsuccessful
  app.post('/student/pause_campaign',async(req,res)=>{
    if(!req.body.docId){
      return res.send({errorMessage:'Server did not receive approperiate data from client!'})
    }
    
    if(req.headers.authorization){
      admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
        if(decodeValue){
          //const code=await createUpdateStudentProfile(decodeValue,data);
            const response=await createPausedCampaign(decodeValue.uid,req.body.docId);
        //   const requestTitleAndDeadline = {RequestTitle:req.body.RequestTitle,DeadlineDay:req.body.DeadlineDay}
        //   const activeRequestData= await getStudentActiveRequest(decodeValue,requestTitleAndDeadline);
        //   const requestRemoveCode=await removeStudentActiveRequest(decodeValue,requestTitleAndDeadline);
        //   const requestPausedCode=await createStudentPausedRequest(decodeValue, await activeRequestData);
           return res.status(200).send(response);
        }
        }).catch((err)=>{
            return res.status(400);
        });
      
    }
  });

  //Resume a paused Campaing(donation request)
  //Inputs: headers.authorization:currentUserIdTokken, docId of specified request in body
  //Returns: body.data if successful, errorMessage if unsuccessful
  app.post('/student/resume_campaign',async(req,res)=>{
    if(!req.body.docId){
      return res.send({errorMessage:'Server did not receive approperiate data from client!'})
    }
    
    if(req.headers.authorization){
      admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
        if(decodeValue){
          //const code=await createUpdateStudentProfile(decodeValue,data);
            const response=await createActiveCampaign(decodeValue.uid,req.body.docId);
        //   const requestTitleAndDeadline = {RequestTitle:req.body.RequestTitle,DeadlineDay:req.body.DeadlineDay}
        //   const pausedRequestData= await getStudentPausedRequest(decodeValue,requestTitleAndDeadline);
        //   const requestRemoveCode=await removeStudentPausedRequest(decodeValue,requestTitleAndDeadline);
        //   const requestPausedCode=await createStudentActiveRequest(decodeValue, await pausedRequestData);
           return res.status(200).send(response);
        }
        }).catch((err)=>{
            return res.status(400);
        });
      
    }
  });

  //Cancells a Campaing(donation request)
  //Inputs: headers.authorization:currentUserIdTokken, docId of specified request in body
  //Returns: body.data if successful, errorMessage if unsuccessful
  app.post('/student/cancel_campaign',async(req,res)=>{
    if(!req.body.docId){
      return res.send({errorMessage:'Server did not receive approperiate data from client!'})
    }
    
    if(req.headers.authorization){
      admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
        if(decodeValue){
          //const code=await createUpdateStudentProfile(decodeValue,data);
            const response=await createCancelledCampaign(decodeValue.uid,req.body.docId);
        //   const requestTitleAndDeadline = {RequestTitle:req.body.RequestTitle,DeadlineDay:req.body.DeadlineDay}
        //   const pausedRequestData= await getStudentPausedRequest(decodeValue,requestTitleAndDeadline);
        //   const requestRemoveCode=await removeStudentPausedRequest(decodeValue,requestTitleAndDeadline);
        //   const requestPausedCode=await createStudentActiveRequest(decodeValue, await pausedRequestData);
           return res.status(200).send(response);
        }
        }).catch((err)=>{
            return res.status(400);
        });
      
    }
  });

  //Creates new User(STUDENT) profile instance
  //Inputs: headers.authorization:currentUserIdTokken, user profile data in body
  //Returns: status.code if successful, errorMessage if unsuccessful
  app.post('/student/create/profile',async(req,res)=>{
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
                const code=await createUpdateStudentProfile(decodeValue,data);
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
  });

  //Reads User(STUDENT) profile data
  //Inputs: headers.authorization:currentUserIdTokken
  //Returns: body.data if successful, errorMessage if unsuccessful
  app.get('/student/profile',async(req,res)=>{
    admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
      if(decodeValue){
        const data=await getStudentProfile(decodeValue);
        return res.send(JSON.stringify(data));
      }
      }).catch((err)=>{
          return false;
      });
      
  });

  //Creates new transaction instance for student
  //Inputs: headers.authorization:currentUserIdTokken, transaction data in body
  //Returns: status.code if successful, errorMessage if unsuccessful
  app.post('/student/create/transaction',async(req,res)=>{
    if(!req.body){
        return res.send({errorMessage:'Server did not received any data.'})
    }
    console.log(req.body)
    const {amount,uid,RequestTitle,DeadlineDay,RequestUID}=req.body
    if(!amount || !uid || !RequestTitle || !DeadlineDay || !RequestUID){
        return res.status(400).send({errorMessage:'Invalid data sent to server'})
    }

    return res.send(await createDonorPendingTransaction({amount,uid,RequestTitle,DeadlineDay,RequestUID}));
    
    // if (req.method == 'POST') {
    //     var body = '';
  
    //     req.on('data', function (data) {
    //         body += data;
  
    //         // Too much POST data, kill the connection!
    //         // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
    //         if (body.length > 1e6)
    //             req.connection.destroy();
    //     });
  
    //     req.on('end', async()=>{
    //         // use post['blah'], etc.
    //         const post=JSON.parse(body);
  
    //         admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
    //           if(decodeValue){
                 const code=await createStudentPendingTransaction(decodeValue,post);
    //             res.send(()=>{
    //               res.status(code);
    //             })
    //           }
    //           }).catch((err)=>{
    //               return false;
    //           });
            
    //     });
    // }
  });

  //Reads pending transaction data
  //Inputs: headers.authorization:currentUserIdTokken
  //Returns: body.data if successful, errorMessage if unsuccessful
  app.get('/student/transactions/pending',async(req,res)=>{
    admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
      if(decodeValue){
        const data =await getStudentPendingTransactions(decodeValue)
        console.log(JSON.stringify(data))
        return res.send(JSON.stringify(data));
      }
      }).catch((err)=>{
          return false;
      });
      
  });

  //Reads completed transaction data
  //Inputs: headers.authorization:currentUserIdTokken
  //Returns: body.data if successful, errorMessage if unsuccessful
  app.get('/student/transactions/completed',async(req,res)=>{
    admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
      if(decodeValue){
        const data =await getStudentCompletedTransactions(decodeValue)
        console.log(JSON.stringify(data))
        return res.send(JSON.stringify(data));
      }
      }).catch((err)=>{
          return false;
      });
      
  });

  //Creates new Withdraw request
  //Inputs: headers.authorization:currentUserIdTokken, withdraw request data in body
  //Returns: status.code if successful, errorMessage if unsuccessful
  app.post('/student/withdraws/create',async(req,res)=>{
    if (!req.body) {
      res.send({errorMessage:'Invalid data sent to server!'})
    }
    if(req.headers.authorization){
      admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
        if(decodeValue){
          console.log(req.body)
          let {stripeKey,Amount,FullName,uid,RequestTitle,DeadlineDay,docId}=req.body
          if(!stripeKey || !Amount || !uid || !RequestTitle || !DeadlineDay){
            return {errorMessage:'Invalid data sent to server'}
          }
          if(parseInt(Amount)<1000){
            return res.send({errorMessage:'Withdraw amount must be at least 2$'})
          }
          const code=await createStudentWithdrawRequest(decodeValue,{docId,stripeKey,Amount,FullName,uid,RequestTitle,DeadlineDay});
          return res.send('success')
        }
        }).catch((err)=>{
            return res.send({errorMessage:'Unable to create withdraw request'});
        });
    }
  });

  //get Student Withdraw requests
  //Inputs: headers.authorization:currentUserIdTokken
  //Returns: status.code if successful, errorMessage if unsuccessful
  app.get('/student/withdraws',async(req,res)=>{
    if(req.headers.authorization){
      admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
        if(decodeValue){
          const withdraws=await getStudentWithdrawRequests(decodeValue);
          return res.send(withdraws)
        }
        }).catch((err)=>{
            return res.send({errorMessage:'Unable to create withdraw request'});
        });
    }
  });
}

// app.get('/requests',(req,res)=>{});
