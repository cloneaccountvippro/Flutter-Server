const express = require('express');
const router = express.Router();
const folderService = require('../service/folderService.js');

// Endpoint to create a new folder
router.post('/create', async (req, res) => {
    const { userId, folderName } = req.body;
    try {
        await folderService.createFolder(userId, folderName);
        res.status(201).json({ message: 'Folder created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to get all folders
router.get('/all', async (req, res) => {
    try {
        const folders = await folderService.getAllFolders();
        res.status(200).json(folders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to get folders by user ID
router.get('/all/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const folders = await folderService.getFoldersByUserId(userId);
        res.status(200).json(folders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to update a folder
router.put('/update/:folderId', async (req, res) => {
    const folderId = req.params.folderId;
    const { newFolderName } = req.body;
    try {
        await folderService.updateFolderName(folderId, newFolderName);
        res.status(200).json({ message: 'Folder updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Endpoint to delete a folder
router.delete('/delete/:folderId', async (req, res) => {
    const folderId = req.params.folderId;
    try {
        await folderService.deleteFolder(folderId);
        res.status(200).json({ message: 'Folder deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;
