const admin = require("firebase-admin");
const db = admin.firestore();

async function createTopicAndAddToFolder(topicName, folderId) {
    try {
        // Create a new topic instance
        const TopicData = {
            name: topicName,
            folderId: folderId,
        };

        // Add the topic to Firestore with auto-generated ID
        const topicRef = await db.collection("topics").add(TopicData);

        // Update the corresponding folder document with the new topic ID
        const folderRef = db.collection("folders").doc(folderId);
        await folderRef.update({
            topicId: admin.firestore.FieldValue.arrayUnion(topicRef.id)
        });

        console.log("Topic created and added to folder successfully");
    } catch (error) {
        throw error;
    }
}

async function getTopicsByFolderId(folderId) {
    try {
        const snapshot = await db.collection("topics").where("folderId", "==", folderId).get();
        const topics = [];
        snapshot.forEach(doc => {
            topics.push({ id: doc.id, ...doc.data() });
        });
        return topics;
    } catch (error) {
        throw error;
    }
}

async function updateTopicName(topicId, newName) {
    try {
        const topicRef = db.collection("topics").doc(topicId);
        await topicRef.update({ name: newName });
        console.log("Topic name updated successfully");
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createTopicAndAddToFolder,
    getTopicsByFolderId,
    updateTopicName
}
