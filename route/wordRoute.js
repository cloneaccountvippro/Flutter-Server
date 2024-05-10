const express = require('express');
const router = express.Router();
const { addWord, addWordFromCSV, editWord, searchWordByLetter, searchWordsByTopic} = require('../service/wordService');
const multer = require('multer');

// Multer configuration for file upload
const upload = multer({ storage: multer.memoryStorage() });

// Route to add a single word
router.post('/add', async (req, res) => {
    const { word, vocab, meaning, topicId } = req.body;
    try {
        const wordId = await addWord(word, vocab, meaning, topicId);
        res.status(200).json({ message: "Word added successfully", wordId: wordId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to add words from a CSV file
router.post('/add-from-csv', upload.single('file'), async (req, res) => {
    const { topicId } = req.body;
    try {
        await addWordFromCSV(req.file.buffer, topicId); // Pass the file path to the service function
        res.status(200).json({ message: "Words added successfully from CSV" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to edit a word
router.put('/edit/:wordId', async (req, res) => {
    const wordId = req.params.wordId;
    const newData = req.body;
    try {
        await editWord(wordId, newData);
        res.status(200).json({ message: "Word updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to search for a word by its 'word' field
router.get('/search', async (req, res) => {
    const query = req.query.q;
    try {
        const words = await searchWordByLetter(query);
        res.status(200).json(words);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/search/:topicId', async (req, res) => {
    const topicId = req.params.topicId;
    try {
        const words = await searchWordsByTopic(topicId);
        res.status(200).json(words);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
