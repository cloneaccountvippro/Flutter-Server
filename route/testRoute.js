const express = require('express')
const router = express.Router()
const {
    getTestByUser,
    getTestByTopic,
    startMCQTest,
    startQuizTest,
    completeMCQTest,
    completeQuizTest
} = require('../service/testService')

// Route to get tests by user ID
router.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId
    try {
        const tests = await getTestByUser(userId)
        res.status(200).json(tests)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Route to get tests by topic ID
router.get('/topic/:topicId', async (req, res) => {
    const topicId = req.params.topicId
    try {
        const tests = await getTestByTopic(topicId)
        res.status(200).json(tests)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Start MCQ test route
router.post('/start-mcq-test', async (req, res) => {
    const { userId, topicId } = req.body;
    try {
        const questions = await startMCQTest(userId, topicId);
        res.status(200).json({ questions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Quiz test route
router.post('/start-quiz-test', async (req, res) => {
    const { userId, topicId } = req.body;
    try {
        const questions = await startQuizTest(userId, topicId);
        res.status(200).json({ questions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Complete MCQ test
router.post('/complete-mcq-test', async (req, res) => {
    const { testId, timeTaken } = req.body;
    try {
        const result = await completeMCQTest(testId, timeTaken);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Complete Quiz test
router.post('/complete-quiz-test', async (req, res) => {
    const { testId, timeTaken } = req.body;
    try {
        const result = await completeQuizTest(testId, timeTaken);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router
