const { DONOR_DONATION_DATA_COLLECTION, DONATIONS_DATA_COLLECTION } = require('../config/constents');
// const {admin.firestore()} =require('firebase-admin/firestore');
const admin = require('../config/firebaseConfig');


module.exports.createDonation=async(decodedFirebaseToken,data)=>{
    let datetime=new Date();
    let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
    let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    let time_At_date=time+'@'+date;
    
    const ref= admin.firestore()().collection(DONATIONS_DATA_COLLECTION).doc(decodedFirebaseToken.uid).collection(DONOR_DONATION_DATA_COLLECTION);
    const r = await ref.add(time_At_date).then(async(newDocRef)=>{
        let rep= await newDocRef.set({...data,deleted_at:'',created_at:time_At_date,DonationDay:date,DonationTime:time}).then((writeResult)=>{
            return writeResult;
        }).catch(()=>{
            return {errorMessage: 'Cannot insert values in newly created record'}
        });
        return rep;
    }).catch(()=>{
        return {errorMessage:'Cannot create new record in database'}
    });
    return r;
}

module.exports.getAllDonations=async(decodedFirebaseToken)=>{
    const ref= admin.firestore()().collection(DONATIONS_DATA_COLLECTION).doc(decodedFirebaseToken.uid).collection(DONOR_DONATION_DATA_COLLECTION);
    let doc=await ref.get();
    if(doc.exists){
        return doc.data(); 
    }else{
        return {errorMessage:'Data does not exists!'};
    }
    
}

module.exports.getDonationsforDonor=async(decodedFirebaseToken)=>{
    const ref= admin.firestore()().collection(DONATIONS_DATA_COLLECTION).doc(decodedFirebaseToken.uid).collection(DONOR_DONATION_DATA_COLLECTION);
    let doc=await ref.where('deleted_at','==','').get();
    if(doc.exists){
        return doc.data(); 
    }else{
        return {errorMessage:'Data does not exists!'};
    }
    
}

module.exports.getDonationWithDateTime=async(decodedFirebaseToken,dateTime)=>{
    if(!dateTime.DonationDay || !dateTime.DonationTime){
        return {errorMessage:'Server did not receive approperiate data'};
    }
    const ref= admin.firestore()().collection(DONATIONS_DATA_COLLECTION).doc(decodedFirebaseToken.uid).collection(DONOR_DONATION_DATA_COLLECTION);
    let doc=await ref.where("DonationDay",'==',dateTime.DonationDay).where("DonationTime",'==',dateTime.DonationTime).get();
    if(doc.exists){
        return doc.data(); 
    }else{
        return {errorMessage:'Data does not exists!'};
    }  
}

module.exports.getDonationWithDate=async(decodedFirebaseToken,date)=>{
    if(!date.DonationDay){
        return {errorMessage:'Server did not receive approperiate data'};
    }
    const ref= admin.firestore()().collection(DONATIONS_DATA_COLLECTION).doc(decodedFirebaseToken.uid).collection(DONOR_DONATION_DATA_COLLECTION);
    let doc=await ref.where("DonationDay",'==',date.DonationDay).get();
    if(doc.exists){
        return doc.data(); 
    }else{
        return {errorMessage:'Data does not exists!'};
    }  
}

module.exports.updateDonation=async(decodedFirebaseToken,data)=>{
    if(!data.DonationDay || !data.DonationTime){
        return {errorMessage:'Server did not receive approperiate data'};
    }
    let datetime=new Date();
    let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
    let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    let time_At_date=time+'@'+date;

    let r=await admin.firestore()().collection(DONATIONS_DATA_COLLECTION).doc(decodedFirebaseToken.uid).collection(DONOR_DONATION_DATA_COLLECTION).doc(data.DonationTime+':'+data.DonationDay)
    .update({...data,updated_at:time_At_date}).then((writeResult)=>{
        return {writeResult:writeResult};
    }).catch((err)=>{
        return {errorMessage:'Cannot Update record'};
    })  
    return r;
}

module.exports.deleteDonationHard=async(decodedFirebaseToken,data)=>{
    if(!data.DonationDay || !data.DonationTime){
        return {errorMessage:'Server did not receive approperiate data'};
    }

    let r=await admin.firestore()().collection(DONATIONS_DATA_COLLECTION).doc(decodedFirebaseToken.uid).collection(DONOR_DONATION_DATA_COLLECTION).doc(data.DonationTime+':'+data.DonationDay)
    .delete().then((writeResult)=>{
        return {writeResult:writeResult};
    }).catch((err)=>{
        return {errorMessage:'Cannot Delete record'};
    })  
    return r;
}

module.exports.deleteDonation=async(decodedFirebaseToken,data)=>{
    if(!data.DonationDay || !data.DonationTime){
        return {errorMessage:'Server did not receive approperiate data'};
    }
    let datetime=new Date();
    let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
    let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    let time_At_date=time+'@'+date;

    let r=await admin.firestore()().collection(DONATIONS_DATA_COLLECTION).doc(decodedFirebaseToken.uid).collection(DONOR_DONATION_DATA_COLLECTION).doc(data.DonationTime+':'+data.DonationDay)
    .update({...data,deleted_at:time_At_date}).then((writeResult)=>{
        return {writeResult:writeResult};
    }).catch((err)=>{
        return {errorMessage:'Cannot delete record'};
    })  
    return r;
}