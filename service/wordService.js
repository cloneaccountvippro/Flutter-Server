const admin = require("firebase-admin");
const db = admin.firestore();
const csv = require('csv-parser');
const { Readable } = require('stream');


async function addWord(word, vocab, meaning, topicId) {
    try {
        const wordData = {
            word: word,
            vocab: vocab,
            meaning: meaning,
            topicId: topicId
        };
        
        // Add the word to Firestore
        const wordRef = await db.collection("words").add(wordData);

        const topicRef = db.collection("topics").doc(topicId);
        await topicRef.update({
            wordId: admin.firestore.FieldValue.arrayUnion(wordRef.id)
        });

        console.log("Word added successfully");
        return wordRef.id; // Return the ID of the newly added word
    } catch (error) {
        throw error;
    }
}

async function getWordById(wordId) {
    try {
        const wordSnapshot = await db.collection("words").doc(wordId).get();
        if (!wordSnapshot.exists) {
            throw new Error("Word not found");
        }
        const wordData = wordSnapshot.data();
        return { id: wordSnapshot.id, ...wordData }; // Include the word ID in the returned object
    } catch (error) {
        throw error;
    }
}

async function addWordFromCSV(fileBuffer, topicId){
    try {
        var initialData = JSON.parse(JSON.stringify(fileBuffer));
        const data =  Buffer.from(initialData).toString()

        const rows = data.split('\n');
        const words = [];

        rows.forEach(async row => {
            const columns = row.split(',');

            const [word, vocab, meaning] = columns;
            if(word == undefined || vocab == undefined || meaning == undefined){
                return;
            }
            const wordData = {
                word: word.trim(),     
                vocab: vocab.trim(),
                meaning: meaning.trim(),
                topicId: topicId
            };

            const wordId = await addWord(wordData.word, wordData.vocab, wordData.meaning, wordData.topicId);
            words.push({ id: wordId, ...wordData });
        });

        // Log the words array
        console.log(words);
    } catch (error) {
        throw error;
    }
}

async function editWord(wordId, newData) {
    try {
        await db.collection("words").doc(wordId).update(newData);
        console.log("Word updated successfully");
    } catch (error) {
        throw error;
    }
}

async function searchWordByLetter(letter) {
    try {
        const snapshot = await db.collection("words").where("word", ">=", letter).where("word", "<", letter + "\uf8ff").get();
        const words = [];
        snapshot.forEach(doc => {
            words.push({ id: doc.id, ...doc.data() });
        });
        return words;
    } catch (error) {
        throw error;
    }
}

async function searchWordsByTopic(topicId) {
    try {
        const snapshot = await db.collection("words").where("topicId", "==", topicId).get();
        const words = [];
        snapshot.forEach(doc => {
            words.push({ id: doc.id, ...doc.data() });
        });
        return words;
    } catch (error) {
        throw error;
    }
}

async function deleteWord(wordId) {
    try {
        await db.collection("words").doc(wordId).delete();
        console.log("Word deleted successfully");
    } catch (error) {
        throw error;
    }
}

async function exportWordsToCSV(topicId) {
    try {
        const snapshot = await db.collection("words").where("topicId", "==", topicId).get();
        const words = [];

        snapshot.forEach(doc => {
            words.push(doc.data());
        });

        const csvData = words.map(word => {
            return `${word.word},${word.vocab},${word.meaning}`;
        }).join('\n');

        return csvData;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    addWord,
    addWordFromCSV,
    editWord,
    deleteWord,
    getWordById,
    searchWordByLetter,
    searchWordsByTopic,
    exportWordsToCSV
};
