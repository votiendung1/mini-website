const admin = require('firebase-admin');

// Tải file serviceAccountKey.json từ Firebase Console
// Project Settings → Service Accounts → Generate new private key
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'mini-website-builder.firebasestorage.app' // Thay bằng project ID của bạn
});

const db = admin.firestore();
const storage = admin.storage();

module.exports = { admin, db, storage };