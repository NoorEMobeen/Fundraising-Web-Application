import firebase from 'firebase/compat/app';
// import { getStorage } from "firebase/storage";
import "firebase/compat/auth";
// import { getDatabase } from "firebase/database";


// // Set the configuration for your app
// // TODO: Replace with your app's config object
const firebaseConfig = {
    apiKey: "AIzaSyBkbAhVyqsQS4_RoG2aRMmlcFHR2tP6wWc",
    authDomain: "afsystem-24fe0.firebaseapp.com",
    projectId: "afsystem-24fe0",
    storageBucket: "afsystem-24fe0.appspot.com",
    messagingSenderId: "1067401800628",
    appId: "1:1067401800628:web:55a91a5bd5d63cbdeca0e1",
    measurementId: "G-GHDWS3ENY2"
};

 const fbApp = firebase.initializeApp(firebaseConfig);
export const auth=firebase.auth();
//export const storage=fbApp.storage()
// auth.setPersistence(auth,inMemoryPersistence);

// export default auth;


// // Get a reference to the storage service, which is used to create references in your storage bucket
// export const storage = firebase.storage();
// export const auth =getAuth(FirebaseApp);
// export const realtimeDB=getDatabase(FirebaseApp);
