const express = require('express');
const router = express.Router();
const {
    createMCQ,
    createQuiz,
    checkMCQResult,
    checkQuizResult
} = require('../service/questionService');

// Route to check the result of an MCQ question
router.post('/check-mcq-result', async (req, res) => {
    const { testId, questionId, answer, userId } = req.body;
    try {
        const result = await checkMCQResult(testId, questionId, answer, userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/check-quiz-result', async (req, res) => {
    const { testId, questionId, answer, userId } = req.body;
    try {
        const result = await checkQuizResult(testId, questionId, answer, userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
