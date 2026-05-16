// Copy this file to firebase.js and fill in your Firebase web app config.
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const DEMO_USER_ID = "demo_user_hackathon";

function getCurrentUserId() {
    return DEMO_USER_ID;
}

window.firebaseConfig = {
    app,
    db,
    getCurrentUserId,
    DEMO_USER_ID
};
