const admin = require("firebase-admin");
const db = admin.firestore();
const { getWordById } = require("./wordService");
async function saveUserData(uid, UserInfoModel){
    try{
        // Initialize trainedId and markedId as empty arrays if not provided
        if (!UserInfoModel.trainedId) {
            UserInfoModel.trainedId = [];
        }
        if (!UserInfoModel.markedId) {
            UserInfoModel.markedId = [];
        }
        if(!UserInfoModel.folderId) {
            UserInfoModel.folderId = []
        }

        const userRef = await db.collection("users").doc(uid).set(UserInfoModel);
        console.log("User data saved successfully")
    } catch (error){
        throw error
    }
}

async function getUserData(uid){
    try {
        const user = await db.collection("users").doc(uid).get();
        if(!user.exists){
            console.log("User does not exist")
        }
        return user
    } catch (error) {
        throw error
    }
}

async function updateUserData(uid, name, age, gender) {
    try {
        const fieldsToUpdate = {};

        // Add name to fieldsToUpdate if provided
        if (name) {
            fieldsToUpdate.fullName = name;
        }

        // Add age to fieldsToUpdate if provided
        if (age) {
            fieldsToUpdate.age = age;
        }

        // Add gender to fieldsToUpdate if provided
        if (gender) {
            fieldsToUpdate.gender = gender;
        }

        // Update the document with the fields to update
        await db.collection("users").doc(uid).update(fieldsToUpdate);
        console.log("User data updated successfully");
    } catch (error) {
        throw error;
    }
}

async function addTrainedId(uid, trainedId) {
    try {
        if (!trainedId) {
            throw new Error("Trained ID is required");
        }

        // Update the document by adding the trainedId to the trainedId array using Firestore arrayUnion
        await db.collection("users").doc(uid).update({
            trainedId: admin.firestore.FieldValue.arrayUnion(trainedId)
        });

        console.log("Trained ID added successfully");
    } catch (error) {
        throw error;
    }
}

async function addMarkedId(uid, markedId) {
    try {
        if (!markedId) {
            throw new Error("Trained ID is required");
        }

        // Update the document by adding the markedId to the markedId array using Firestore arrayUnion
        await db.collection("users").doc(uid).update({
            markedId: admin.firestore.FieldValue.arrayUnion(markedId)
        });

        console.log("Marked ID added successfully");
    } catch (error) {
        throw error;
    }
}

async function getAllMarkedId(uid) {
    try {
        const userData = await getUserData(uid);
        if (!userData.exists) {
            throw new Error("User does not exist");
        }
        
        const markedId = userData.data().markedId || [];
        return markedId;
    } catch (error) {
        throw error;
    }
}

async function getAllTrainedId(uid) {
    try {
        const userData = await getUserData(uid);
        if (!userData.exists) {
            throw new Error("User does not exist");
        }
        
        const trainedId = userData.data().trainedId || [];
        return trainedId;
    } catch (error) {
        throw error;
    }
}

async function getAllMarkedWords(uid) {
    try {
        const markedIds = await getAllMarkedId(uid);
        const markedWords = [];
        for (const markedId of markedIds) {
            const word = await getWordById(markedId);
            markedWords.push(word);
        }
        return markedWords;
    } catch (error) {
        throw error;
    }
}

async function getAllTrainedWords(uid) {
    try {
        const trainedIds = await getAllTrainedId(uid);
        const trainedWords = [];
        for (const trainedId of trainedIds) {
            const word = await getWordById(trainedId);
            trainedWords.push(word);
        }
        return trainedWords;
    } catch (error) {
        throw error;
    }
}



module.exports = {
    saveUserData,
    getUserData,
    updateUserData,
    addTrainedId,
    addMarkedId,
    getAllMarkedWords,
    getAllTrainedWords
}
