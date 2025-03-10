// app.get('/pending',(req,res)=>{});
// app.get('/pending/transactions',(req,res)=>{});
// app.get('/pending/requests',(req,res)=>{});
const {getAllActiveRequests ,getAllPendingRequests, getAllCancelledRequests, getAllFulfilledRequests, getAllRequests, getAndRemovePendingRequest, createActiveRequest, getAllPausedRequests, createStudentRejectedRequest, getAllRejectedRequests} = require('../models/Request.model')
const admin=require('../config/firebaseConfig');
const { getUserRole, getAllUsersCount, getAllUserEmailsAndNames } = require('../models/User.model');
const { ROLES, CAMPAIGN_STATUS } = require('../config/constents');
const { getStudentProfile, getStudentProfileWithUID, getDonorProfileWithUID, approveStudentProfile, getAllSudentUnapprovedProfiles, rejectStudentProfile, getAllSudentApprovedProfiles } = require('../models/Profile.model');
const { getAllWithdrawRequests, approveStudentWithdraw, rejectStudentWithdraw, getAllAvailableWithdrawRequests } = require('../models/Withdraw.model');
const { getAllDonorTransactions,getName } = require('../models/Transactions.model');
const { getAllFooterLinks, createFooterLink, updateFooterLink } = require('../models/Footer.model');
const { getCampaignsByStatus, createActiveCampaign, createRejectedCampaign, getCampaignsByStatusForAdmin } = require('../models/Campaign.model');

module.exports=function (app) {
    
    //Reads all cancelled requests data
    //Inputs: headers.authorization:currentUserIdTokken
    //Returns: body.data if successful, errorMessage if unsuccessful
    app.get('/requests/cancelled',async(req,res)=>{
        admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
            if(decodeValue){
                const data=await getCampaignsByStatusForAdmin(CAMPAIGN_STATUS.CANCELLED);
                return res.send(data);
            }
            }).catch((err)=>{
                return false;
            });
        
    });

    //Reads all fulfilled requests data
    //Inputs: headers.authorization:currentUserIdTokken
    //Returns: body.data if successful, errorMessage if unsuccessful
    app.get('/requests/fulfilled',async(req,res)=>{
        admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
            if(decodeValue){
                const data=await getCampaignsByStatusForAdmin(CAMPAIGN_STATUS.FULFILLED);
                return res.send(data);
            }
            }).catch((err)=>{
                return false;
            });
        
    });

    //Reads all rejected requests data
    //Inputs: headers.authorization:currentUserIdTokken
    //Returns: body.data if successful, errorMessage if unsuccessful
    app.get('/requests/rejected',async(req,res)=>{
        admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
            if(decodeValue){
                const data=await getCampaignsByStatusForAdmin(CAMPAIGN_STATUS.REJECTED);
                return res.send(data);
            }
            }).catch((err)=>{
                return false;
            });
        
    });

    //Reads all pending requests data
    //Inputs: headers.authorization:currentUserIdTokken
    //Returns: body.data if successful, errorMessage if unsuccessful
    app.get('/requests/pending',async(req,res)=>{
        admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
            if(decodeValue){
                const data=await getCampaignsByStatusForAdmin(CAMPAIGN_STATUS.PENDING);
                return res.send(data);
            }
            }).catch((err)=>{
                return false;
            });
        
    });

    //Reads all active requests data
    //Inputs: headers.authorization:currentUserIdTokken
    //Returns: body.data if successful, errorMessage if unsuccessful
    app.get('/requests/active',async(req,res)=>{
        admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
            if(decodeValue){
                const data=await getCampaignsByStatusForAdmin(CAMPAIGN_STATUS.ACTIVE);
                return res.send(data);
            }
            }).catch((err)=>{
                return false;
            });
    });

    //Reads all paused requests data
    //Inputs: headers.authorization:currentUserIdTokken
    //Returns: body.data if successful, errorMessage if unsuccessful
    app.get('/requests/paused',async(req,res)=>{
        admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
            if(decodeValue){
                const data=await getCampaignsByStatusForAdmin(CAMPAIGN_STATUS.PAUSED);
                return res.send(data);
            }
            }).catch((err)=>{
                return false;
            });
    });

    ///requests/approved
    //Reads all paused requests data
    //Inputs: headers.authorization:currentUserIdTokken
    //Returns: body.data if successful, errorMessage if unsuccessful
    app.get('/requests/approved',async(req,res)=>{
        admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
            if(decodeValue){
                const paused=await getCampaignsByStatusForAdmin(CAMPAIGN_STATUS.PAUSED);
                const fulfilled=await getCampaignsByStatusForAdmin(CAMPAIGN_STATUS.FULFILLED);
                const active=await getCampaignsByStatusForAdmin(CAMPAIGN_STATUS.ACTIVE);
                const data=[paused,fulfilled,active];

                return res.send(data);
            }
            }).catch((err)=>{
                return false;
            });
    });

    //Accepts OR Approves pending campaign(donation requests)
    //Inputs: headers.authorization:currentUserIdTokken, (RequestTitle|DeadlineDay|uid) of selected request in body
    //Returns: accepted request details in body.data if successful, errorMessage if unsuccessful
    app.post('/requests/pending/approve',async(req,res)=>{
        if(!req.headers.docid){
            return res.send({errorMessage:'Server did not receive approperiate data from client'});
        }
        admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
            if(decodeValue){
                // //getting pending request data and removing it from pending_requests
                // const data=await getAndRemovePendingRequest(req.body.uid,req.body.RequestTitle,req.body.DeadlineDay);
                // //Changing status and saving request to active requests
                // //console.log(data);
                //  const createdRequest=await createActiveRequest(req.body);
                const response = await createActiveCampaign(req.body,req.headers.docid);
                 return res.send(response);
                
            }
            }).catch((err)=>{
                return console.log(err);
            });
    });

    //Rejects pending campaign(donation requests)
    //Inputs: headers.authorization:currentUserIdTokken, request data of selected request in body
    //Returns: rejected request details in body.data if successful, errorMessage if unsuccessful
    app.post('/requests/pending/reject',async(req,res)=>{
        if(!req.body.docid){
            return res.send({errorMessage:'Server did not receive approperiate data from client'});
        }
        admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
            if(decodeValue){
                // console.log(req.body)
                // //getting pending request data and removing it from pending_requests
                // const data=await getAndRemovePendingRequest(req.body.uid,req.body.RequestTitle,req.body.DeadlineDay);
                // //Changing status and saving request to active requests
                // //console.log(data);
                const response = await createRejectedCampaign(req.body,req.headers.docid);
                return res.send(response);
            }
            }).catch((err)=>{
                return console.log(err);
            });
    });

    //Reads all donation transactions data
    //Inputs: headers.authorization:currentUserIdTokken
    //Returns: body.data if successful, errorMessage if unsuccessful
    app.get('/transactions/donation',async(req,res)=>{
        admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
            if(decodeValue){
                const data=await getAllDonorTransactions();
                return res.send(data);
            }
            }).catch((err)=>{
                return false;
            });
        
    });

    //Reads all pending transactions data
    //Inputs: headers.authorization:currentUserIdTokken
    //Returns: body.data if successful, errorMessage if unsuccessful
    app.get('/transactions/pending',async(req,res)=>{
        admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
            if(decodeValue){
                const data=await getAllPendingRequests();
                return res.send(data);
            }
            }).catch((err)=>{
                return false;
            });
        
    });

    //Fetches the profile data of a user including pictures
    //Input: headers.authorization:currentUserIdTokken (of admin) ; userId in body (user id of user whos data you want to fetch)
    //Output: body.data containing all textual data if successful, errorMessage if unsuccessful
    app.post('/profile/data',async(req,res)=>{
        if(!req.body.userId){
            res.send({errorMessage:'Invalid data send to server'});
            return;
        }
        admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
            if(decodeValue){
                //getTextual data
                const userId=req.body.userId;
                console.log(userId)
                const role=await getUserRole(userId);
                console.log('role is: '+role);
                if(role==ROLES.STUDENT){
                    const data=await getStudentProfileWithUID(userId);
                    return res.send(data);
                }else if(role==ROLES.DONOR){
                    const data=await getDonorProfileWithUID(userId);
                    return res.send(data);
                }else if(role==ROLES.ADMIN){
                    //To be implemented
                }else{
                    return res.send('Undefined role');
                }
                //getPictures

                //send Response

                return res.send(data);
            }
            }).catch((err)=>{
                return false;
            });
    })

    //Approves the profile of student
    //Input: headers.authorization:currentUserIdTokken (of admin) ; userId in body (user id of student whos profile you want to approve)
    //Output: body.data containing data if successful, errorMessage if unsuccessful
    app.post('/profile/approve',async(req,res)=>{
        if(!req.body.userId){
            res.send({errorMessage:'Invalid data send to server'});
            return;
        }

        admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
            if(decodeValue){
                //getTextual data
                const userId=req.body.userId;
                const role=await getUserRole(userId);
                if(role==ROLES.STUDENT){
                    console.log('role is: '+role);
                    const data=await approveStudentProfile(userId);
                    return res.send(data);
                }else{
                    return res.send('Only student profiles can be approved');
                }
            }
            }).catch((err)=>{
                return false;
            });
    })

    //Fetches the student profiles to be approved 
    //Input: headers.authorization:currentUserIdTokken (of admin)
    //Output: body.data containing all textual data if successful, errorMessage if unsuccessful
    app.get('/profile/unapproved',async(req,res)=>{
        admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
                if(decodeValue){
                    let profiles=await getAllSudentUnapprovedProfiles();
                    res.send(profiles);
                }
            }).catch((err)=>{
                return false;
            });
    })

    //Fetches all student approved profiles
    //Input: headers.authorization:currentUserIdTokken (of admin)
    //Output: body.data containing all textual data if successful, errorMessage if unsuccessful
    app.get('/profile/approved',async(req,res)=>{
        admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
                if(decodeValue){
                    let profiles=await getAllSudentApprovedProfiles();
                    res.send(profiles);
                }
            }).catch((err)=>{
                return false;
            });
    })

    //Rejects the profile of student
    //Input: headers.authorization:currentUserIdTokken (of admin) ; userId in body (user id of student whos profile you want to reject)
    //Output: body.data containing data if successful, errorMessage if unsuccessful
    app.post('/profile/reject',async(req,res)=>{
        if(!req.body.userId){
            res.send({errorMessage:'Invalid data send to server'});
            return;
        }

        admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
            if(decodeValue){
                //getTextual data
                const userId=req.body.userId;
                const role=await getUserRole(userId);
                if(role==ROLES.STUDENT){
                    console.log('role is: '+role);
                    const data=await rejectStudentProfile(userId);
                    return res.send(data);
                }else{
                    return res.send('Only student profiles can be rejected');
                }
            }
            }).catch((err)=>{
                return false;
            });
    })

    //Fetches the student withdraw requests to be approved 
    //Input: headers.authorization:currentUserIdTokken (of admin)
    //Output: body.data containing all textual data if successful, errorMessage if unsuccessful
    app.get('/withdraws/unapproved',async(req,res)=>{
        admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
                if(decodeValue){
                    let withdraws=await getAllWithdrawRequests();
                    return res.send(await withdraws);
                }
            }).catch((err)=>{
                return res.send({errorMessage:'Unable to fetch data! Please check your network connection'});
            });
    })

    //Approves the withdraw request of student
    //Input: headers.authorization:currentUserIdTokken (of admin) ; withdraw object in body 
    //Output: body.data containing data if successful, errorMessage if unsuccessful
    app.post('/withdraws/approve',async(req,res)=>{
        if(!req.body.RequestTitle || !req.body.uid || !req.body.created_at || !req.body.docId){
            res.send({errorMessage:'Invalid data send to server'});
            return;
        }

        //getTextual data
        const userId=req.body.uid;
        const role=await getUserRole(userId);
        if(role==ROLES.STUDENT){
            console.log('role is: '+role);
            const data=await approveStudentWithdraw(req.body);
            return res.send(data);
        }else{
            return res.send('Only student withdraw requests can be approved');
        }
    })

    //Rejects the withdrwa request of student
    //Input: headers.authorization:currentUserIdTokken (of admin) ; withdraw object in body
    //Output: body.data containing data if successful, errorMessage if unsuccessful
    app.post('/withdraws/reject',async(req,res)=>{
        if(!req.body.uid){
            res.send({errorMessage:'Invalid data send to server'});
            return;
        }

        admin.auth().verifyIdToken(req.headers.authorization).then(async(decodeValue)=>{
            if(decodeValue){
                //getTextual data
                const userId=req.body.uid;
                const role=await getUserRole(userId);
                if(role==ROLES.STUDENT){
                    console.log('role is: '+role);
                    const data=await rejectStudentWithdraw(req.body);
                    return res.send(data);
                }else{
                    return res.send('Only student profiles can be rejected');
                }
            }
            }).catch((err)=>{
                return false;
            });
    })

    app.get('/withdraws',async(req,res)=>{
        let withdraws=await getAllAvailableWithdrawRequests()
        console.log(withdraws)
        res.send(withdraws);
    })

    //Gets number of users with role
    app.get('/users/count',async(req,res)=>{
        let userCount=await getAllUsersCount()
        res.send(userCount);
    })

    //Gets email and Name of users with role
    app.get('/users',async(req,res)=>{
        let users=await getAllUserEmailsAndNames()
        res.send(users);
    })

    //Gets role of provided uid in req.body
    app.get('/users/role',async(req,res)=>{
        let decodeValue=await admin.auth().verifyIdToken(req.headers.authorization);
        let role=await getUserRole(decodeValue.uid)
        if(!role){
            return res.send('no role defines');
        }
        let responseData={role:role,uid:decodeValue.uid}
        res.send(responseData);
    })

    //Gets the footer links
    app.get('/footer/links',async(req,res)=>{
        let links=await getAllFooterLinks();
        return res.send(links);
    })

    //create footer links
    app.post('/footer/links',async(req,res)=>{
        if(!req.body.links){
            res.send({errorMessage:'Invalid data send to server'});
            return;
        }
        let links=await createFooterLink(req.body.links);
        return res.send(links);
    })

    //update footer links
    app.put('/footer/links',async(req,res)=>{
        if(!req.body){
            res.send({errorMessage:'Invalid data send to server'});
            return;
        }
        let links=await updateFooterLink(req.body);
        return res.send(links);
    })
}
