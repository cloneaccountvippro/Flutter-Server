const { initializeApp } = require("firebase/app");
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword  } = require("firebase/auth");
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const firebaseConfig = require('../config.js');
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://study-english-c6ba8-default-rtdb.asia-southeast1.firebasedatabase.app"
});
const db = getFirestore();

// Function to sign up with email and password
async function SignUp(UserCredential) {
    try {
        const { email, password } = UserCredential;
        const userRecord = await createUserWithEmailAndPassword(auth, email, password);
        return userRecord.user.uid;
    } catch (error) {
        throw error;
    }
}

// Function to sign in with email and password
async function SignIn(UserCredential) {
    try {
        const { email, password } = UserCredential;
        const userRecord = await signInWithEmailAndPassword(auth, email, password);
        return userRecord.user.uid;
    } catch (error) {
        throw error;
    }
}
// Function to update user's password by email
async function ResetPassword(email){
    try {
        await sendPasswordResetEmail(auth, email);
        console.log("Password reset email sent successfully to:", email);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    SignUp,
    SignIn,
    ResetPassword,
};
