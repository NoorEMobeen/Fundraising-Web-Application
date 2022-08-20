const { REQUESTS_COLLECTION, REQUESTS_CANCELLED_COLLECTION, REQUESTS_FULFILLED_COLLECTION, STUDENTS_PROFILE_DATA_COLLECTION, STUDENTS_TRANSACTIONS_DATA_COLLECTION, STUDENT_PENDING_REQUEST_OBJECT_REALTIME_DB, STUDENT_ACTIVE_REQUEST_OBJECT_REALTIME_DB, STUDENT_PAUSED_REQUEST_OBJECT_REALTIME_DB, REQUESTS_REJECTED_COLLECTION } = require('../config/constents');
//const {getFirestore} =require('firebase-admin');
const admin = require('../config/firebaseConfig');

//////////////// Student ///////////////

//PENDING REQUESTS-------------------------Realtime database
module.exports.createStudentPendingRequest=async(decodedFirebaseToken,data)=>{
    let datetime=new Date();
    let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
    let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    let time_At_date=time+'@'+date;
    const ref= await admin.database().ref(STUDENT_PENDING_REQUEST_OBJECT_REALTIME_DB+"/"+decodedFirebaseToken.uid+"/"+data.RequestTitle+":"+data.DeadlineDay)
        .set({...data,status:'pending',uid:decodedFirebaseToken.uid,created_at:time_At_date,updated_at:time_At_date}).then(()=>{
            return 200;
        },(err)=>{
            return 400;
        }); 
}
module.exports.getStudentPendingRequests=async(decodedFirebaseToken)=>{
    const data= await admin.database().ref(STUDENT_PENDING_REQUEST_OBJECT_REALTIME_DB+"/"+decodedFirebaseToken.uid)
    .once('value', (snapshot) => {
        if(snapshot.hasChildren()){
            return snapshot.val();
        }
        else{
            return {errorMessage:"no pending request exists"};
        }
        }, (errorObject) => {
        return {errorMessage:"Error..."};
        }
    );
    return data;
}
//Needs RequestTitle and Deadline in an object i.e requestTitleAndDeadline to identify request
module.exports.getStudentPendingRequest=async(decodedFirebaseToken,requestTitleAndDeadline)=>{
    if(!requestTitleAndDeadline){
        return{errorMessage:"Require RequestTitle and Deadline to identify request"};
    }
    const ref= await admin.database().ref(STUDENT_PENDING_REQUEST_OBJECT_REALTIME_DB+"/"+decodedFirebaseToken.uid+"/"+requestTitleAndDeadline.RequestTitle+":"+requestTitleAndDeadline.DeadlineDay);
    //Reading request data from pending requests
    ref.once('value', (snapshot) => {
        if(snapshot.hasChild() || snapshot.hasChildren()){
            return snapshot.val();
        }
        else{
            return {errorMessage:"no pending request exists"};
        }
        }, (errorObject) => {
            return {errorMessage:"Error..."};
        }
    );
}
//Needs RequestTitle and Deadline in an object i.e requestTitleAndDeadline to identify request
module.exports.removeStudentPendingRequest=async(decodedFirebaseToken,requestTitleAndDeadline)=>{
    if(!requestTitleAndDeadline){
        return{errorMessage:"Require RequestTitle and Deadline to identify request"};
    }
    const ref= await admin.database().ref(STUDENT_PENDING_REQUEST_OBJECT_REALTIME_DB+"/"+decodedFirebaseToken.uid+"/"+requestTitleAndDeadline.RequestTitle+":"+requestTitleAndDeadline.DeadlineDay);
    //Reading request data from pending requests
    ref.remove().then(()=>{
        console.log('Success! \n Request removed');
        return 200;
    }).catch((err)=>{
        console.log('Error! \n Request DID NOT removed:'+err.message);
        return 400;
    });
}
//----------------------------------------

//ACYIVE REQUESTS--------------------------Realtime database
module.exports.getStudentActiveRequests=async(decodedFirebaseToken)=>{
    const ref= await admin.database().ref(STUDENT_ACTIVE_REQUEST_OBJECT_REALTIME_DB+"/"+decodedFirebaseToken.uid)
    .once('value', (snapshot) => {
        if(snapshot.hasChildren()){
            return snapshot.val();
        }
        else{
            return {errorMessage:"no active request exists"};
        }
        }, (errorObject) => {
        return {errorMessage:"Error..."};
        }
    ); 
    return ref;
}
module.exports.createStudentActiveRequest=async(decodedFirebaseToken,data)=>{
    let datetime=new Date();
    let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
    let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    let time_At_date=time+'@'+date;
    
    const ref= await admin.database().ref(STUDENT_ACTIVE_REQUEST_OBJECT_REALTIME_DB+"/"+decodedFirebaseToken.uid+"/"+data.RequestTitle+":"+data.DeadlineDay)
        .set({...data,status:'active',created_at:time_At_date,updated_at:time_At_date}).then(()=>{
            return 200;
        },(err)=>{
            return 400;
        }); 
}
//Needs RequestTitle and Deadline in an object i.e requestTitleAndDeadline to identify request
module.exports.removeStudentActiveRequest=async(decodedFirebaseToken,requestTitleAndDeadline)=>{
    if(!requestTitleAndDeadline){
        return{errorMessage:"Require RequestTitle and Deadline to identify request"};
    }
    const ref= await admin.database().ref(STUDENT_ACTIVE_REQUEST_OBJECT_REALTIME_DB+"/"+decodedFirebaseToken.uid+"/"+requestTitleAndDeadline.RequestTitle+":"+requestTitleAndDeadline.DeadlineDay);
    //Reading request data from pending requests
    ref.remove().then(()=>{
        console.log('Success! \n Request removed');
        return 200;
    }).catch((err)=>{
        console.log('Error! \n Request DID NOT removed:'+err.message);
        return 400;
    });
}
//Needs RequestTitle and Deadline in an object i.e requestTitleAndDeadline to identify request
module.exports.getStudentActiveRequest=async(decodedFirebaseToken,requestTitleAndDeadline)=>{
    if(!requestTitleAndDeadline){
        return{errorMessage:"Require RequestTitle and Deadline to identify request"};
    }
    const ref= await admin.database().ref(STUDENT_ACTIVE_REQUEST_OBJECT_REALTIME_DB+"/"+decodedFirebaseToken.uid+"/"+requestTitleAndDeadline.RequestTitle+":"+requestTitleAndDeadline.DeadlineDay);
    //Reading request data from pending requests
    const snapshot=await ref.once('value');
        if(snapshot.exists()){
            return snapshot.val();
        }
        else{
            return {errorMessage:"no pending request exists"};
        }
}
//----------------------------------------

//PAUSED REQUESTS--------------------------Realtime database
module.exports.getStudentPausedRequests=async(decodedFirebaseToken)=>{
    const ref= await admin.database().ref(STUDENT_PAUSED_REQUEST_OBJECT_REALTIME_DB+"/"+decodedFirebaseToken.uid)
    .once('value', (snapshot) => {
        if(snapshot.hasChildren()){
            console.log(snapshot.val())
            return snapshot.val();
        }
        else{
            return {errorMessage:"no active request exists"};
        }
        }, (errorObject) => {
        return {errorMessage:"Error..."};
        }
    ); 
    return ref;
}
module.exports.createStudentPausedRequest=async(decodedFirebaseToken,data)=>{
    
    const ref= admin.database().ref(STUDENT_PAUSED_REQUEST_OBJECT_REALTIME_DB+"/"+decodedFirebaseToken.uid+"/"+data.RequestTitle+":"+data.DeadlineDay);
    const writeResponse = await ref.set({...data,status:'paused'});
    return writeResponse;
}
//Needs RequestTitle and Deadline in an object i.e requestTitleAndDeadline to identify request
module.exports.removeStudentPausedRequest=async(decodedFirebaseToken,requestTitleAndDeadline)=>{
    if(!requestTitleAndDeadline){
        return{errorMessage:"Require RequestTitle and Deadline to identify request"};
    }
    const ref= await admin.database().ref(STUDENT_PAUSED_REQUEST_OBJECT_REALTIME_DB+"/"+decodedFirebaseToken.uid+"/"+requestTitleAndDeadline.RequestTitle+":"+requestTitleAndDeadline.DeadlineDay);
    //Reading request data from pending requests
    ref.remove().then(()=>{
        console.log('Success! \n Request removed');
        return 200;
    }).catch((err)=>{
        console.log('Error! \n Request DID NOT removed:'+err.message);
        return 400;
    });
}
//Needs RequestTitle and Deadline in an object i.e requestTitleAndDeadline to identify request
module.exports.getStudentPausedRequest=async(decodedFirebaseToken,requestTitleAndDeadline)=>{
    if(!requestTitleAndDeadline){
        return{errorMessage:"Require RequestTitle and Deadline to identify request"};
    }
    const ref= await admin.database().ref(STUDENT_PAUSED_REQUEST_OBJECT_REALTIME_DB+"/"+decodedFirebaseToken.uid+"/"+requestTitleAndDeadline.RequestTitle+":"+requestTitleAndDeadline.DeadlineDay);
    //Reading request data from pending requests
    const snapshot=await ref.once('value');
        if(snapshot.exists()){
            return snapshot.val();
        }
        else{
            return {errorMessage:"no pending request exists"};
        }
}
//----------------------------------------

//CANCELLED REQUESTS----------------------Firestore
module.exports.getStudentCancelledRequests=async(decodedFirebaseToken) => {
    let d=[]
    const docs = await admin.firestore().collection(REQUESTS_COLLECTION).doc(decodedFirebaseToken.uid).collection(REQUESTS_CANCELLED_COLLECTION).get();
    docs.forEach(doc=>{
        console.log(doc.data())
        d.push(doc.data());
    });
    return d;   
}

module.exports.createStudentCancelledRequest=async(decodedFirebaseToken,data)=>{
    if(!data.RequestTitle || !data.DeadlineDay){
        return {errorMessage:'Server did not received approperiate data'};
    }
    let datetime=new Date();
    let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
    let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    let time_At_date=time+'@'+date;
    
    const ref= admin.firestore().collection(REQUESTS_COLLECTION).doc(decodedFirebaseToken.uid).collection(REQUESTS_CANCELLED_COLLECTION);
    let newDocRef=await ref.add({...data,cancelled:true,cancelled_at:time_At_date});
    return newDocRef;
}
//-----------------------------------------

//FULFILLED REQUESTS-----------------------Firestore
module.exports.getStudentFulfilledRequests=async(decodedFirebaseToken) => {
    let d=[]
    const docs = await admin.firestore().collection(REQUESTS_COLLECTION).doc(decodedFirebaseToken.uid).collection(REQUESTS_FULFILLED_COLLECTION).get();
    docs.forEach(doc=>{
        console.log(doc.data())
        d.push(doc.data());
    });
    return d;   
}
//~~~add plus update functionality
module.exports.createStudentFulfilledRequest=async(decodedFirebaseToken,data)=>{
    if(!data.RequestTitle || !data.DeadlineDay){
        return {errorMessage:'Server did not received approperiate data'};
    }
    let datetime=new Date();
    let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
    let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    let time_At_date=time+'@'+date;
    
    const ref= admin.firestore().collection(REQUESTS_COLLECTION).doc(decodedFirebaseToken.uid).collection(REQUESTS_FULFILLED_COLLECTION);
    let newDocRef=await ref.add({...data,fulfilled_at:time_At_date});
    return newDocRef;
}
//-----------------------------------------

//REJECTED REQUESTS----------------------Firestore
module.exports.getStudentRejectedRequests=async(decodedFirebaseToken) => {
    let d=[]
    const docs = await admin.firestore().collection(REQUESTS_COLLECTION).doc(decodedFirebaseToken.uid).collection(REQUESTS_REJECTED_COLLECTION).get();
    docs.forEach(doc=>{
        console.log(doc.data())
        d.push(doc.data());
    });
    return d;   
}

module.exports.createStudentRejectedRequest=async(studentUID,data)=>{
    if(!data.RequestTitle || !data.DeadlineDay){
        return {errorMessage:'Server did not received approperiate data'};
    }
    let datetime=new Date();
    let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
    let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    let time_At_date=time+'@'+date;
    const ref= admin.firestore().collection(REQUESTS_COLLECTION).doc(studentUID).collection(REQUESTS_REJECTED_COLLECTION);
    let docTitle=data.RequestTitle+':'+data.DeadlineDay;
    console.log(docTitle)
    let newDocRef=await ref.add({...data,rejected_at:time_At_date});
    return newDocRef;    
}
//-----------------------------------------

//#############################STUDENT ENDS######################################

////////////// Donor ////////////////


//#############################DONOR ENDS######################################

////////////// Admin ////////////////
//Requests--------------------------
module.exports.getAllPendingRequests=async()=>{
    const data= await admin.database().ref(STUDENT_PENDING_REQUEST_OBJECT_REALTIME_DB)
    .once('value', (snapshot) => {
        if(snapshot.hasChildren()){
            return snapshot.val();
        }
        else{
            return {errorMessage:"no pending request exists"};
        }
        }, (errorObject) => {
        return {errorMessage:"Error..."};
        }
    );
    return data;
}
module.exports.getAllPausedRequests=async()=>{
    const data= await admin.database().ref(STUDENT_PAUSED_REQUEST_OBJECT_REALTIME_DB)
    .once('value', (snapshot) => {
        if(snapshot.hasChildren()){
            return snapshot.val();
        }
        else{
            return {errorMessage:"no pending request exists"};
        }
        }, (errorObject) => {
        return {errorMessage:"Error..."};
        }
    );
    return data;
}
module.exports.getAndRemovePendingRequest=async(uid,RequestTitle,RequestDeadlineDay)=>{
    const ref=admin.database().ref(STUDENT_PENDING_REQUEST_OBJECT_REALTIME_DB+'/'+uid+'/'+RequestTitle+':'+RequestDeadlineDay);
    const data= await ref
    .once('value', async(snapshot) => {
        if(snapshot.hasChildren()){
            const values=snapshot.val();
            ref.remove().then((res)=>{
                console.log(res)
            }).catch(err=>{
                console.log(err)
            })
            console.log(values)
        }
        else{
            return {errorMessage:"no pending request exists"};
        }
        }, (errorObject) => {
        return {errorMessage:"Error..."};
        }
    );
    return data;
}
module.exports.createActiveRequest=async(data)=>{
    let datetime=new Date();
    let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
    let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    let time_At_date=time+'@'+date;
    const ref= await admin.database().ref(STUDENT_ACTIVE_REQUEST_OBJECT_REALTIME_DB+"/"+data.uid+"/"+data.RequestTitle+":"+data.DeadlineDay)
        .set({...data,status:'active',published_at:time_At_date}).then(()=>{
            return data;
        },(err)=>{
            return 400;
        }); 
}
module.exports.getAllCancelledRequests=async() => {
    const ref= admin.firestore().collectionGroup(REQUESTS_CANCELLED_COLLECTION);
    const snapshot = await ref.get();
    let reqs=[];
    snapshot.docs.forEach((doc)=>{reqs.push(doc.data())});
    return reqs;
}
module.exports.getAllFulfilledRequests=async() => {
    const ref= admin.firestore().collectionGroup(REQUESTS_FULFILLED_COLLECTION);
    const snapshot = await ref.get();
    let reqs=[];
    snapshot.docs.forEach((doc)=>{reqs.push(doc.data())});
    return reqs;
}
module.exports.getAllRejectedRequests=async() => {
    const ref= admin.firestore().collectionGroup(REQUESTS_REJECTED_COLLECTION);
    const snapshot = await ref.get();
    let reqs=[];
    snapshot.docs.forEach((doc)=>{reqs.push(doc.data())});
    return reqs;
}
module.exports.getAllActiveRequests=async()=>{
    const data= await admin.database().ref(STUDENT_ACTIVE_REQUEST_OBJECT_REALTIME_DB)
    .once('value', (snapshot) => {
        if(snapshot.hasChildren()){
            return snapshot.val();
        }
        else{
            return {errorMessage:"no pending request exists"};
        }
        }, (errorObject) => {
        return {errorMessage:"Error..."};
        }
    );
    return data; 
}
module.exports.getOnePendingRequestWithKey=async()=>{
    const data= await admin.database().ref(STUDENT_PENDING_REQUEST_OBJECT_REALTIME_DB)
    .once('value', (snapshot) => {
        if(snapshot.hasChildren()){
            const requests= snapshot.val();
            console.log(requests);
        }
        else{
            return {errorMessage:"no pending request exists"};
        }
        }, (errorObject) => {
        return {errorMessage:"Error..."};
        }
    );
    return data;
}
//------------------------------------

//#############################ADMIN ENDS######################################
