// const {admin.firestore()} =require('firebase-admin/firestore');
const admin = require('../config/firebaseConfig');

module.exports.getAllFooterLinks = async()=>{
    const db = admin.firestore();
    const snapshot = await db.collection('footerLinks').get();
    let footerLinks = [];
    snapshot.forEach((doc)=>{
        footerLinks.push({
            id:doc.id,
            ...doc.data()
        });
    });
    return footerLinks;
}

module.exports.createFooterLink = async(links)=>{
    const db = admin.firestore();
    const newFooterLink = {
        aim:links.aim,
        vision:links.vision,
        services:links.services,
        contactUs:links.contactUs,
        twitter:links.twitter,
        linkedin:links.linkedin
    };
    const doc = await db.collection('footerLinks').add(newFooterLink);
    return  {message:'Footer Link saved successfully',
        footerLink:{
            ...newFooterLink,
            id:doc.id
        }
    }
}

module.exports.updateFooterLink = async(link)=>{
    const db = admin.firestore();
    if(link.id){
        const responce = await db.collection('footerLinks').doc(link.id).update(link);
        return responce;
    }
}

module.exports.deleteFooterLink = async(link)=>{
    const db = admin.firestore();
    const responce = await db.collection('footerLinks').doc(link.id).delete();
    return responce;
}