const express = require('express');
const router = express.Router();
const topicService = require('../service/topicService.js');

// Create a new topic and add it to a folder
router.post('/create', async (req, res) => {
    const { topicName, folderId } = req.body;
    try {
        await topicService.createTopicAndAddToFolder(topicName, folderId);
        res.status(201).json({ message: 'Topic created and added to folder successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get topics by folder ID
router.get('/get/:folderId', async (req, res) => {
    const folderId = req.params.folderId;
    try {
        const topics = await topicService.getTopicsByFolderId(folderId);
        res.status(200).json(topics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update topic name by topic ID
router.put('/update/:topicId', async (req, res) => {
    const { newName } = req.body;
    const topicId = req.params.topicId;
    try {
        await topicService.updateTopicName(topicId, newName);
        res.status(200).json({ message: 'Topic name updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete topic by topic ID
router.delete('/delete/:topicId', async (req, res) => {
    const topicId = req.params.topicId;
    try {
        await topicService.deleteTopic(topicId);
        res.status(200).json({ message: 'Topic deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post('/public/:topicId', async (req, res) => {
    const topicId = req.params.topicId;
    try {
        await topicService.toggleTopicPublic(topicId);
        res.status(200).json({ message: 'Topic visibility toggled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });   
    }
})

module.exports = router;
