const admin = require("firebase-admin");
const db = admin.firestore();

async function createFolder(userId, folderName) {
    try {
        // Create a new folder instance
        const folder = new Folder(folderName, userId);

        // Add the folder to Firestore with auto-generated ID
        const folderRef = await db.collection("folders").add(folder);

        // Get the user document
        const userRef = db.collection("users").doc(userId);
        const userSnapshot = await userRef.get();

        if (!userSnapshot.exists) {
            throw new Error("User does not exist");
        }

        // Update the user document with the new folder ID
        await userRef.update({
            folderId: admin.firestore.FieldValue.arrayUnion(folderRef.id)
        });

        console.log("Folder added and user updated successfully");
    } catch (error) {
        throw error;
    }
}

async function getAllFolders() {
    try {
        const snapshot = await db.collection("folders").get();
        const folders = [];
        snapshot.forEach(doc => {
            folders.push({ id: doc.id, ...doc.data() });
        });
        return folders;
    } catch (error) {
        throw error;
    }
}

async function getFoldersByUserId(userId) {
    try {
        const snapshot = await db.collection("folders").where("userId", "==", userId).get();
        const folders = [];
        snapshot.forEach(doc => {
            folders.push({ id: doc.id, ...doc.data() });
        });
        return folders;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createFolder,
    getAllFolders,
    getFoldersByUserId
}
