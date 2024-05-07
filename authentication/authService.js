const { initializeApp } = require("firebase/app");
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const { getAuth, sendPasswordResetEmail } = require("firebase/auth");
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const firebaseConfig = require('../config.js');
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://study-english-c6ba8-default-rtdb.asia-southeast1.firebasedatabase.app"
});
const db = getFirestore();

async function signUpWithEmailPasswordAndUserInfo(email, password, fullName, age, image) {
    try {
        const userRecord = await admin.auth().createUser({
            email,
            password
        });

        await saveUserInfoModel(userRecord.uid, fullName, age, image);
        return userRecord;
    } catch (error) {
        throw error;
    }
}

// Function to handle user sign-in
async function signInUser(email, password) {
    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        return userRecord;
    } catch (error) {
        throw error;
    }
}

async function resetEmail(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        return "Password reset email sent successfully";
    } catch (error) {
        throw error;
    }
}

// Function to update user's password
async function updatePassword(uid, newPassword) {
    try {
        await admin.auth().updateUser(uid, {
            password: newPassword
        });
        return "Password updated successfully";
    } catch (error) {
        throw error;
    }
}

async function saveUserInfoModel(uid, fullName, age, image) {
    try {
        const userData = {
            fullName: fullName,
            age: age,
            image: (image !== undefined) ? image : null,
        };
        const res = await db.collection('user').doc(uid).set(userData);
        return "User info model saved successfully";
    } catch (error) {
        throw error;
    }
}

module.exports = {
    signUpWithEmailPasswordAndUserInfo,
    signInUser,
    resetEmail,
    updatePassword,
};
