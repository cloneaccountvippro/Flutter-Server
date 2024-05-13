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

        // Get the user document
        const userRef = db.collection("users").doc(uid);
        const userSnapshot = await userRef.get();

        if (!userSnapshot.exists) {
            throw new Error("User does not exist");
        }

        // Get the current trained IDs from the user data
        const userData = userSnapshot.data();
        let trainedIdDict = {};

        // Convert the existing trainedId array to a dictionary format
        if (Array.isArray(userData.trainedId)) {
            userData.trainedId.forEach(id => {
                trainedIdDict[id] = (trainedIdDict[id] || 0) + 1;
            });
        } else if (typeof userData.trainedId === 'object' && userData.trainedId !== null) {
            // If trainedId is already in dictionary format, copy it
            trainedIdDict = { ...userData.trainedId };
        }

        // If the provided trainedId already exists, increment its count; otherwise, set its count to 1
        trainedIdDict[trainedId] = (trainedIdDict[trainedId] || 0) + 1;

        // Update the document with the updated trainedId dictionary
        await userRef.set({
            trainedId: trainedIdDict
        }, { merge: true }); // Merge with existing data or create a new field if it doesn't exist

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
        
        const trainedIdDict = userData.data().trainedId || {};
        
        // Convert the trainedId dictionary into an array of objects
        const trainedIdArray = Object.keys(trainedIdDict).map(id => ({
            id: id,
            count: trainedIdDict[id]
        }));

        return trainedIdArray;
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
        const trainedIdObjects = await getAllTrainedId(uid);
        const trainedWords = [];

        // Iterate through each trained ID object
        for (const trainedIdObject of trainedIdObjects) {
            // Fetch the word by ID
            const word = await getWordById(trainedIdObject.id);

            // Add the count information to the word object
            if (word) {
                word.count = trainedIdObject.count;
                trainedWords.push(word);
            }
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
