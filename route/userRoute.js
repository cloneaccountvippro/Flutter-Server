const express = require('express')
const router = express.Router()
const {
    saveUserData,
    getUserData,
    updateUserData,
    addTrainedId,
    addMarkedId,
    addFolderId
} = require('../service/userService.js'); 

// Save user data route
router.post('/save', async (req, res) => {
    const { uid, userInfo } = req.body;
    try {
        await saveUserData(uid, userInfo);
        res.status(200).json({ message: "User data saved successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user data route
router.get('/get/:uid', async (req, res) => {
    const uid = req.params.uid;
    try {
        const userData = await getUserData(uid);
        if (!userData.exists) {
            res.status(404).json({ message: "User does not exist" });
        } else {
            res.status(200).json({ user: userData.data() });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user data route
router.put('/update/:uid', async (req, res) => {
    const uid = req.params.uid;
    const { name, age, gender } = req.body;
    try {
        await updateUserData(uid, name, age, gender);
        res.status(200).json({ message: "User data updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/add-trained-word/:uid', async (req, res) => {
    const uid = req.params.uid;
    const { trainedId } = req.body;
    try {
        await addTrainedId(uid, trainedId);
        res.status(200).json({ message: "Trained ID added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add markedId route
router.post('/add-marked-word/:uid', async (req, res) => {
    const uid = req.params.uid;
    const { markedId } = req.body;
    try {
        await addMarkedId(uid, markedId);
        res.status(200).json({ message: "Marked ID added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add folderId route
router.post('/add-folder-id/:uid', async (req, res) => {
    const uid = req.params.uid;
    const { folderId } = req.body;
    try {
        await addFolderId(uid, folderId);
        res.status(200).json({ message: "Folder Id added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router
