const express = require('express');
const router = express.Router();
const {
    createMCQ,
    createQuiz,
    checkMCQResult,
    checkQuizResult
} = require('../service/questionService');

// Route to create multiple-choice questions (MCQ)
router.post('/mcq', async (req, res) => {
    const { testId } = req.body;
    try {
        const mcqQuestions = await createMCQ(testId);
        res.status(200).json(mcqQuestions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to create a quiz
router.post('/quiz', async (req, res) => {
    const { testId } = req.body;
    try {
        const quizQuestions = await createQuiz(testId);
        res.status(200).json(quizQuestions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to check the result of an MCQ question
router.post('/check-mcq-result', async (req, res) => {
    const { questionId, answer } = req.body;
    try {
        const result = await checkMCQResult(questionId, answer);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to check the result of a quiz question
router.post('/check-quiz-result', async (req, res) => {
    const { questionId, answer } = req.body;
    try {
        const isCorrect = await checkQuizResult(questionId, answer);
        res.status(200).json({ isCorrect });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
