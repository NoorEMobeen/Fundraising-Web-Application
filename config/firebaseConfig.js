const admin = require("firebase-admin");

const serviceAccount = require("../afsystem-24fe0-firebase-adminsdk-vkgmx-42687eb276.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://afsystem-24fe0-default-rtdb.firebaseio.com"
});

// exports.firestore = admin.firestore();
// exports.realtimeDB = admin.database();
// exports.auth = admin.auth();
// exports.storage = admin.storage();

module.exports =admin;