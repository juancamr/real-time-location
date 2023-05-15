require('dotenv').config();
const firebaseAdmin = require('firebase-admin');

const url = 'https://firebaseio.com';

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    }),
    databaseURL: url
})

const firebaseDatabase = firebaseAdmin.database();

exports = firebaseDatabase;