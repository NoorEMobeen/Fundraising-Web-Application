const { STUDENTS_PROFILE_DATA_COLLECTION,DONOR_PROFILE_DATA_COLLECTION } = require('../config/constents');
//const {getFirestore} =require('firebase-admin');
const admin = require('../config/firebaseConfig');

module.exports.createUpdateStudentProfile=async(decodedFirebaseToken,data)=>{
    let datetime=new Date();
    let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
    let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    let time_At_date=time+'@'+date;
    
    const ref= admin.firestore().collection(STUDENTS_PROFILE_DATA_COLLECTION).doc(decodedFirebaseToken.uid);
    let doc=await ref.get();
    if(doc.exists){
        let d=await ref.update({...data,approved:false,updated_at:time_At_date}).then(()=>{
            return 200;
        },(err)=>{
            return 400;
        }); 
    }else{
        let d=await ref.set({...data,approved:false,created_at:time_At_date,updated_at:time_At_date,uid:decodedFirebaseToken.uid}).then(()=>{
            return 200;
        },(err)=>{
            return 400;
        }); 
    }
}

module.exports.approveStudentProfile=async(uid)=>{
    let datetime=new Date();
    let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
    let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    let time_At_date=time+'@'+date;
    
    const ref= admin.firestore().collection(STUDENTS_PROFILE_DATA_COLLECTION).doc(uid);
    let doc=await ref.get();
    
    if(doc.exists){
        ref.update({approved:true,approved_at:time_At_date})
        .then(writeRes=>{
            return writeRes
        }).catch(err=>console.log(err)).finally(()=>console.log('here'));
        
    }
}

module.exports.rejectStudentProfile=async(uid)=>{
    let datetime=new Date();
    let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
    let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    let time_At_date=time+'@'+date;
    
    const ref= admin.firestore().collection(STUDENTS_PROFILE_DATA_COLLECTION).doc(uid);
    let doc=await ref.get();
    if(doc.exists){
        let d=await ref.update({rejected:true,rejected_at:time_At_date});
        return d;
    }
}

module.exports.getStudentProfile=async(decodedFirebaseToken)=>{
    const ref= admin.firestore().collection(STUDENTS_PROFILE_DATA_COLLECTION).doc(decodedFirebaseToken.uid);
    let doc=await ref.get();
    if(doc.exists){
        return doc.data(); 
    }else{
        return {errorMessage:'Data does not exists!'};
    }
    
}

module.exports.getStudentProfileWithUID=async(uid)=>{
    const ref= admin.firestore().collection(STUDENTS_PROFILE_DATA_COLLECTION).doc(uid);
    let doc=await ref.get();
    if(doc.exists){
        return doc.data(); 
    }else{
        return {errorMessage:'Data does not exists!'};
    }
    
}

module.exports.createUpdateDonorProfile=async(decodedFirebaseToken,data)=>{
    let datetime=new Date();
    let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
    let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    let time_At_date=time+'@'+date;
    
    const ref= admin.firestore().collection(DONOR_PROFILE_DATA_COLLECTION).doc(decodedFirebaseToken.uid);
    let doc=await ref.get();
    if(doc.exists){
        let d=await ref.update({...data,updated_at:time_At_date}).then(()=>{
            return 200;
        },(err)=>{
            return 400;
        }); 
    }else{
        let d=await ref.set({...data,created_at:time_At_date,updated_at:time_At_date}).then(()=>{
            return 200;
        },(err)=>{
            return 400;
        }); 
    }
}

module.exports.getDonorProfile=async(decodedFirebaseToken)=>{
    const ref= admin.firestore().collection(DONOR_PROFILE_DATA_COLLECTION).doc(decodedFirebaseToken.uid);
    let doc=await ref.get();
    if(doc.exists){
        return doc.data(); 
    }else{
        return {errorMessage:'Data does not exists!'};
    }
    
}

module.exports.getDonorProfileWithUID=async(uid)=>{
    const ref= admin.firestore().collection(DONOR_PROFILE_DATA_COLLECTION).doc(uid);
    let doc=await ref.get();
    if(doc.exists){
        return doc.data(); 
    }else{
        return {errorMessage:'Data does not exists!'};
    }
    
}

module.exports.checkStudentApprovedProfile=async(uid)=>{
    const ref= admin.firestore().collection(STUDENTS_PROFILE_DATA_COLLECTION).doc(uid);
    let doc=await ref.get();
    if(doc.exists){
        return doc.data().approved===true?true:false; 
    }else{
        return {errorMessage:'Data does not exists!'};
    }
}

module.exports.checkStudentRejectedProfile=async(uid)=>{
    const ref= admin.firestore().collection(STUDENTS_PROFILE_DATA_COLLECTION).doc(uid);
    let doc=await ref.get();
    if(doc.exists){
        return doc.data().rejected===true?true:false; 
    }else{
        return {errorMessage:'Data does not exists!'};
    }
}

module.exports.getAllSudentUnapprovedProfiles=async()=>{
    let unformatedData= (await admin.firestore().collection(STUDENTS_PROFILE_DATA_COLLECTION).get())
    .docs.filter(doc=>doc.data().approved===false && !doc.data().rejected);
    let formatedData=unformatedData.map(d=>d.data());
    return formatedData;
}

module.exports.getAllSudentApprovedProfiles=async()=>{
    let unformatedData= (await admin.firestore().collection(STUDENTS_PROFILE_DATA_COLLECTION).get())
    .docs.filter(doc=>doc.data().approved===true);
    let formatedData=unformatedData.map(d=>d.data());
    return formatedData;
}

module.exports.getAllSudentRejectedProfiles=async()=>{
    let unformatedData= (await admin.firestore().collection(STUDENTS_PROFILE_DATA_COLLECTION).get())
    .docs.filter(doc=>doc.data().rejected===true);
    let formatedData=unformatedData.map(d=>d.data());
    return formatedData;
}