const admin = require("firebase-admin");
const db = admin.firestore();

async function createTopicAndAddToFolder(topicName, folderId) {
    try {
        // Create a new topic instance
        const TopicData = {
            name: topicName,
            folderId: folderId,
            wordId: [],
            public: true
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

async function deleteTopic(topicId) {
    try {
        const topicRef = db.collection("topics").doc(topicId);
        
        // Check if the topic has associated word IDs
        const topicSnapshot = await topicRef.get();
        const wordIds = topicSnapshot.data().wordId || [];

        if (wordIds.length > 0) {
            throw new Error("Topic cannot be deleted because it has associated word IDs");
        }

        // Delete the topic document
        await topicRef.delete();
        console.log("Topic deleted successfully");
    } catch (error) {
        throw error;
    }
}

async function toggleTopicPublic(topicId) {
    try {
        const topicRef = db.collection("topics").doc(topicId);

        // Get the current topic data
        const topicSnapshot = await topicRef.get();
        if (!topicSnapshot.exists) {
            throw new Error("Topic not found");
        }

        const currentPublicStatus = topicSnapshot.data().public;

        // Update the topic document to toggle its public status
        await topicRef.update({ public: !currentPublicStatus });

        console.log(`Topic ${topicId} public status toggled successfully`);
    } catch (error) {
        throw error;
    }
}

async function getAllTopics() {
    try {
        const snapshot = await db.collection("topics").get();
        const topics = [];
        snapshot.forEach(doc => {
            topics.push({ id: doc.id, ...doc.data() });
        });
        return topics;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createTopicAndAddToFolder,
    getTopicsByFolderId,
    updateTopicName,
    deleteTopic,
    toggleTopicPublic,
    getAllTopics
}
