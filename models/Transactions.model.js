const { TRANSACTIONS_COLLECTION, MY_TRANSACTIONS_COLLECTION, DONOR_TRANSACTIONS_COLLECTION, STUDENT_ACTIVE_REQUEST_OBJECT_REALTIME_DB, REQUESTS_COLLECTION } = require('../config/constents');
//const {getFirestore} =require('firebase-admin');
const admin=require('../config/firebaseConfig');
const { getCampaign, updateCampaign } = require('./Campaign.model');

//additional functions
const getName=async(uid)=>{
    console.log('here')
    const snapshot=await admin.database().ref('profileData/'+uid).once('value');
    if(!snapshot.val()){
        console.log('inside if')
        return 'noName'
    }
    console.log('outside if',snapshot.val().fullName)
    return snapshot.val().fullName?snapshot.val().fullName:'No Name';
}

//Student Transaction
module.exports.createStudentPendingTransaction=async(decodedFirebaseToken,data)=>{
    let datetime=new Date();
    let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
    let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    let time_At_date=time+'@'+date;
    
    const ref= admin.firestore().collection(TRANSACTIONS_COLLECTION).doc(decodedFirebaseToken.uid).collection(MY_TRANSACTIONS_COLLECTION);
    const r = await ref.add({...data,datetime:time_At_date});
    return r;
}

module.exports.getStudentPendingTransactions=async(decodedFirebaseToken)=>{
    let d=[]
    const ref= admin.firestore().collection(TRANSACTIONS_COLLECTION).doc(decodedFirebaseToken.uid).collection(MY_TRANSACTIONS_COLLECTION);
    let docs=await ref.where('status','==','pending').get();
    if(!docs.empty()){
        docs.forEach(doc=>{
            console.log(doc.data())
            d.push(doc.data());
        });
        return d;  
    }else{
        return {errorMessage:'Data does not exists!'};
    }
}

module.exports.getStudentPendingTransaction=async(decodedFirebaseToken,data)=>{
    if(!data.created_at){
        return {errorMessage:'Data does not exists!'};
    }
    const ref= admin.firestore().collection(TRANSACTIONS_COLLECTION).doc(decodedFirebaseToken.uid).collection(MY_TRANSACTIONS_COLLECTION);
    let doc=await ref.doc(data.created_at).get();
    if(doc.exists()){
        return doc.data();  
    }else{
        return {errorMessage:'Data does not exists!'};
    }
}

module.exports.getStudentCompletedTransactions=async(decodedFirebaseToken)=>{
    let d=[]
    const docs = await admin.firestore().collection(TRANSACTIONS_COLLECTION).doc(decodedFirebaseToken.uid).collection(MY_TRANSACTIONS_COLLECTION).where('status','==','completed').get();
    if(!docs.empty()){
        docs.forEach(doc=>{
            console.log(doc.data())
            d.push(doc.data());
        });
        return d; 
    }
}
//Only updates the pending transaction to completed
module.exports.createStudentCompletedTransaction=async(decodedFirebaseToken,data)=>{
    let pendingTransaction=await this.getStudentPendingTransaction(decodedFirebaseToken,data);
    if(!pendingTransaction.errorMessage){
        let datetime=new Date();
        let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
        let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
        let time_At_date=time+'@'+date;
        
        const r= admin.firestore().collection(TRANSACTIONS_COLLECTION).doc(decodedFirebaseToken.uid).collection(MY_TRANSACTIONS_COLLECTION).doc(data.created_at)
        .update({status:'completed',completed_at:time_At_date}).then((writeResult)=>{
                return writeResult;
            }).catch(()=>{
                return {errorMessage: 'Cannot update values in record'}
            });
        return r;
    }
}
/////-------------
//Donor Transaction
module.exports.createDonorPendingTransaction=async(data)=>{
    let datetime=new Date();
    let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
    let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    let time_At_date=time+'@'+date;

    const {docId, amount, uid, RequestTitle, DeadlineDay, RequestUID}=data
    console.log('received data-->',data);
    //update active request record
    const campaign= await getCampaign(docId);;
    console.log('Campaign Data-->',campaign);
    const updateData={
        CollectedAmount:campaign.CollectedAmount?(parseInt(campaign.CollectedAmount)+parseInt(amount)):amount,
        DonersParticipated:campaign.DonersParticipated?(parseInt(campaign.DonersParticipated)+1):1
    }
    const updateResponse = await updateCampaign(updateData,docId);
    //const requestRef= admin.database().ref(STUDENT_ACTIVE_REQUEST_OBJECT_REALTIME_DB+"/"+RequestUID+"/"+RequestTitle+":"+DeadlineDay);
    // const snapshot=await requestRef.once('value');
    // const requestData=snapshot.val();
    // const updateData={
    //     CollectedAmount:requestData.CollectedAmount?(parseInt(requestData.CollectedAmount)+parseInt(amount)):amount,
    //     DonersParticipated:requestData.DonersParticipated?(parseInt(requestData.DonersParticipated)+1):1
    // }
    // const updateResponse=await requestRef.update(updateData);

    //create donor transaction record
    const ref= admin.firestore().collection(DONOR_TRANSACTIONS_COLLECTION);
    const transactionCreateResponse = await ref.add({docId:docId,Amount:amount,from:await getName(uid),to:await getName(RequestUID),uid:uid,to_uid:RequestUID,RequestTitle:RequestTitle,DeadlineDay:DeadlineDay,datetime:time_At_date});
    return {transactionCreateResponse,updateResponse};
    // if(snapshot.hasChild()){
        
    // }
    // else{
    //     return {errorMessage:"no Active request exists"};
    // }
}

module.exports.getDonorPendingTransactions=async(decodedFirebaseToken)=>{
    let d=[]
    const ref= admin.firestore().collection(DONOR_TRANSACTIONS_COLLECTION);
    const docs = await ref.where('uid','==',decodedFirebaseToken.uid).get();
    if(docs.docs.length==0){
        return {errorMessage:'Data does not exists!'};
    }
    docs.docs.forEach(doc=>{
        d.push(doc.data());
    });
    return d;
    
}
/////--------------

//--
module.exports.getDonorPendingTransaction=async(decodedFirebaseToken,data)=>{
    if(!data.created_at){
        return {errorMessage:'Data does not exists!'};
    }
    const ref= admin.firestore().collection(DONOR_TRANSACTIONS_COLLECTION).doc(decodedFirebaseToken.uid).collection(MY_TRANSACTIONS_COLLECTION);
    let doc=await ref.doc(data.created_at).get();
    if(doc.exists()){
        return doc.data();  
    }else{
        return {errorMessage:'Data does not exists!'};
    }
}

//--
module.exports.getDonorCompletedTransactions=async(decodedFirebaseToken)=>{
    let d=[]
    const docs = await admin.firestore().collection(DONOR_TRANSACTIONS_COLLECTION).doc(decodedFirebaseToken.uid).collection(MY_TRANSACTIONS_COLLECTION).where('status','==','completed').get();
    if(!docs.empty()){
        docs.forEach(doc=>{
            console.log(doc.data())
            d.push(doc.data());
        });
        return d; 
    }
}

//Admin functions
module.exports.getAllStudentTransactions=async()=>{
    let d=[]
    const ref= admin.firestore().collection(TRANSACTIONS_COLLECTION);
    let documents= await ref.listDocuments();
    if(documents.length>0){
        for(let document in documents){
            let docs=await document.collection(MY_TRANSACTIONS_COLLECTION).listDocuments();
            if(docs.length>0){
                for(let doc in docs){
                    let da=await doc.get();
                    d.push(da.data);
                }
            }
        }
        return d;
    }
}

module.exports.getAllDonorTransactions=async()=>{
    let d=[]
    const ref= admin.firestore().collection(DONOR_TRANSACTIONS_COLLECTION);
    let documents= await ref.listDocuments();
    if(documents.length>0){
        for(let key in documents){
            let doc=await documents[key].get();
            d.push(doc.data());
        }
        return d;
    }
}

//Only updates the pending transaction to completed
module.exports.createDonorCompletedTransaction=async(decodedFirebaseToken,data)=>{
    let pendingTransaction=await this.getDonorPendingTransaction(decodedFirebaseToken,data);
    if(!pendingTransaction.errorMessage){
        let datetime=new Date();
        let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
        let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
        let time_At_date=time+'@'+date;
        
        const r= admin.firestore().collection(DONOR_TRANSACTIONS_COLLECTION).doc(decodedFirebaseToken.uid).collection(MY_TRANSACTIONS_COLLECTION).doc(data.created_at)
        .update({status:'completed',completed_at:time_At_date}).then((writeResult)=>{
                return writeResult;
            }).catch(()=>{
                return {errorMessage: 'Cannot update values in record'}
            });
        return r;
    }
}