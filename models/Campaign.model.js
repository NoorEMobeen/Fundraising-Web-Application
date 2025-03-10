const { CAMPAIGN_STATUS, REQUESTS_COLLECTION } = require("../config/constents");
const admin = require('../config/firebaseConfig');

exports.getCampaign = async(docId) => {
    return (await admin.firestore().collection(REQUESTS_COLLECTION).doc(docId).get()).data();
}
exports.getCampaignsByStatus = async(uid, status) => {
    return (await admin.firestore().collection(REQUESTS_COLLECTION).where('status','==',status).where('uid','==',uid).get()).docs.map(doc => { return {...doc.data(),docId:doc.id}});
}
exports.getCampaignsByStatusForAdmin = async(status) => {
    return (await admin.firestore().collection(REQUESTS_COLLECTION).where('status','==',status).get()).docs.map(doc => { return {...doc.data(),docId:doc.id}});
}
exports.updateCampaign = async(campaign,docId) => {
    return await admin.firestore().collection(REQUESTS_COLLECTION).doc(docId).update(campaign);
}
exports.deleteCampaign = async(docId) => {
    return await admin.firestore().collection(REQUESTS_COLLECTION).doc(docId).delete();
}

// CAMPAIGN_STATUS.PENDING
exports.createPendingCampaign = async(uid, campaign) => {
    let datetime=new Date();
    let time=datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds();
    let date=datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    let time_At_date=time+'@'+date;
    if(campaign.docId){
        const response = await admin.firestore().collection(REQUESTS_COLLECTION).doc(campaign.docId).update(campaign);
        return response;
    }
    const response = await admin.firestore().collection(REQUESTS_COLLECTION).add({...campaign, uid:uid, created_at:time_At_date, status:CAMPAIGN_STATUS.PENDING});
    return response;
}
// CAMPAIGN_STATUS.ACTIVE
exports.createActiveCampaign = async(campaign, docId) => {
    return await admin.firestore().collection(REQUESTS_COLLECTION).doc(docId).update({...campaign, status:CAMPAIGN_STATUS.ACTIVE});
}
// CAMPAIGN_STATUS.PAUSED
exports.createPausedCampaign = async(campaign, docId) => {
    return await admin.firestore().collection(REQUESTS_COLLECTION).doc(docId).update({...campaign, status:CAMPAIGN_STATUS.PAUSED});
}
// CAMPAIGN_STATUS.CANCELLED
exports.createCancelledCampaign = async(campaign, docId) => {
    return await admin.firestore().collection(REQUESTS_COLLECTION).doc(docId).update({...campaign, status:CAMPAIGN_STATUS.CANCELLED});
}
// CAMPAIGN_STATUS.FULFILLED
exports.createFulfilledCampaign = async(campaign, docId) => {
    return await admin.firestore().collection(REQUESTS_COLLECTION).doc(docId).update({...campaign, status:CAMPAIGN_STATUS.FULFILLED});
}
// CAMPAIGN_STATUS.REJECTED
exports.createRejectedCampaign = async(campaign, docId) => {
    return await admin.firestore().collection(REQUESTS_COLLECTION).doc(docId).update({...campaign, status:CAMPAIGN_STATUS.REJECTED});
}
