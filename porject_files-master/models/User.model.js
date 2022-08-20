// const firebase = require("firebase/app");
// require("firebase/auth");
const { ROLES } = require('../config/constents');
const admin=require('../config/firebaseConfig');

module.exports.verifyAuthToken=async (authToken)=>{
  admin.auth().verifyIdToken(authToken)
    .then((decodedAuthToken)=>{
      return decodedAuthToken;
    }
    );
}

module.exports.getUserRole=async(uid)=>{
  let storedRole='';

  for (let role of ROLES.ALL_ROLES) {
    storedRole='';
    let ref=admin.database().ref("roles/"+role+"/"+uid);
      await ref.once('value', (snapshot) => {
        if(snapshot.hasChildren()){
          storedRole=role;
        }
      });
      if(storedRole){
        return storedRole;
      }
  }
  return storedRole
}

module.exports.getAllUsersCount=async()=>{
  //total registered users all type
  let snapshot=await admin.database().ref('roles').get();
  if(snapshot.hasChildren){
    let tempUsers=[]
    snapshot.forEach(da=>{
      tempUsers.push({[da.key]:da.numChildren()})
    });
    return tempUsers;
  }
}

module.exports.getAllUserEmailsAndNames=async()=>{
  //total registered users all type
  let snapshot=await admin.database().ref('roles').get();
  if(snapshot.hasChildren){
    return snapshot;
  }
}

// class User {
//     signInWithEmailPassword(email,password) {
//         // [START auth_signin_password]
//         firebase.auth().signInWithEmailAndPassword(email, password)
//           .then((userCredential) => {
//             // Signed in
//             var user = userCredential.user;
//             // ...
//           })
//           .catch((error) => {
//             var errorCode = error.code;
//             var errorMessage = error.message;
//           });
//         // [END auth_signin_password]
//     }
      
//     signUpWithEmailPassword(email,password) {
//         // [START auth_signup_password]
//         firebase.auth().createUserWithEmailAndPassword(email, password)
//           .then((userCredential) => {
//             // Signed in 
//             var user = userCredential.user;
//             console.log('User Signed up successfully');
//             return true;
//             // ...
//           })
//           .catch((error) => {
//             var errorCode = error.code;
//             var errorMessage = error.message;
//             console.log('User Signed up Error',errorCode,errorMessage);
//             return false;
//             // ..
//           });
//         // [END auth_signup_password]
//     }
      
//     sendEmailVerification() {
//         // [START auth_send_email_verification]
//         firebase.auth().currentUser.sendEmailVerification()
//           .then(() => {
//             // Email verification sent!
//             // ...
//           });
//         // [END auth_send_email_verification]
//     }
      
//     sendPasswordReset(email) {
//         // [START auth_send_password_reset]
//         firebase.auth().sendPasswordResetEmail(email)
//             .then(() => {
//             // Password reset email sent!
//             // ..
//             })
//             .catch((error) => {
//             var errorCode = error.code;
//             var errorMessage = error.message;
//             // ..
//             });
//         // [END auth_send_password_reset]
//     }
// }

// module.exports= User;