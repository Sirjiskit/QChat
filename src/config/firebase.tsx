import { initializeApp, getApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyAiCKYZ6cLtP27PkIENcbuHxy-dYQimpTk",
    authDomain: "qchat-be450.firebaseapp.com",
    projectId: "qchat-be450",
    storageBucket: "qchat-be450.appspot.com",
    messagingSenderId: "166496984935",
    appId: "1:166496984935:web:73c8ddfdccbcec9d3799c2",
    measurementId: "G-VXP7ZNMHH9"
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = initializeFirestore(app, { experimentalForceLongPolling: true });
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);
export { db, auth, firestore };