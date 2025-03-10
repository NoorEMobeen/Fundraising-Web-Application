//const {getFirestore} =require('firebase-admin/firestore');
const admin = require('../config/firebaseConfig');
const { WITHDRAW_COLLECCTION, REQUESTS_COLLECTION } = require('../config/constents');

module.exports.getAllWithdrawRequests=async() => {  
    let formatedData= (await admin.firestore().collection(WITHDRAW_COLLECCTION)
    .where('approved','!=',true).get())
    .docs.map(d=>d.data());
    formatedData = formatedData.filter(d=>!d.rejected);
    return await formatedData;
}
module.exports.getAllAvailableWithdrawRequests=async() => {  
    let formatedData= (await admin.firestore().collection(WITHDRAW_COLLECCTION).get())
    .docs.map(d=>d.data());
    return await formatedData;
}

module.exports.getStudentWithdrawRequests=async(decodedFirebaseToken) => {
    let unformatedData= (await admin.firestore().collection(WITHDRAW_COLLECCTION).get())
    .docs.filter(doc=>doc.data().uid===decodedFirebaseToken.uid);
    let formatedData=unformatedData.map(d=>d.data());
    return formatedData; 
}
module.exports.getStudentWithdrawRequestsWithUID=async(uid) => {
    let unformatedData= (await admin.firestore().collection(WITHDRAW_COLLECCTION).get())
    .docs.filter(doc=>doc.data().uid===uid);
    let formatedData=unformatedData.map(d=>d.data());
    return formatedData; 
}

module.exports.createStudentWithdrawRequest=async(decodedFirebaseToken,data)=>{
    let datetime=new Date();
    let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
    let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    let time_At_date=time+'@'+date;
    
    const d=await admin.firestore().collection(WITHDRAW_COLLECCTION).add({...data,approved:false,uid:decodedFirebaseToken.uid,created_at:time_At_date});
    return d;
}

//easypaisa api call within
module.exports.approveStudentWithdraw=async(data)=>{
    let datetime=new Date();
    let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
    let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    let time_At_date=time+'@'+date;
    
    const unformatedData= await admin.firestore().collection(WITHDRAW_COLLECCTION)
    .where('uid','==',data.uid)
    .where('RequestTitle','==',data.RequestTitle)
    .where('created_at','==',data.created_at).get();
    if(unformatedData.docs.length===1){

        //verify amount eligibility
        //from organization account to student account

        unformatedData.docs[0].ref.update({approved:true,approved_at:time_At_date})
        .then(writeRes=>console.log(writeRes))
        .catch(err=>console.log(err));

        //add withdraw amount in request
        admin.firestore().collection(REQUESTS_COLLECTION).doc(data.docId)
        .update({WithdrawAmount:data.Amount,last_withdraw_at:time_At_date})
        .then(writeRes=>console.log(writeRes))
        .catch(err=>console.log(err));
    }else{
        return {errorMessage:'More than one withdraws with same data available'}
    }
}

module.exports.rejectStudentWithdraw=async(data)=>{
    let datetime=new Date();
    let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
    let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    let time_At_date=time+'@'+date;
    
    const unformatedData= await admin.firestore().collection(WITHDRAW_COLLECCTION)
    .where('uid','==',data.uid)
    .where('RequestTitle','==',data.RequestTitle)
    .where('created_at','==',data.created_at).get();
    if(unformatedData.docs.length===1){
        unformatedData.docs[0].ref.update({rejected:true, approved:true,rejected_at:time_At_date})
        .then(writeRes=>console.log(writeRes))
        .catch(err=>console.log(err))
    }else{
        return {errorMessage:'More that one withdraws with same data available'}
    }
}