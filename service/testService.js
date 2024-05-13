const admin = require("firebase-admin");
const db = admin.firestore();
const {
    createMCQ,
    createQuiz
} = require("./questionService");

async function getTestByUser(userId){
    try {
        const testsSnapshot = await db.collection("tests").where("userId", "==", userId).get();
        const tests = [];
        testsSnapshot.forEach((doc) => {
            tests.push(doc.data());
        });
        return tests;
    } catch (error) {
        throw error;
    }
}

async function getTestByTopic(topicId){
    try {
        const testsSnapshot = await db.collection("tests").where("topicId", "==", topicId).get();
        const tests = [];
        testsSnapshot.forEach((doc) => {
            tests.push(doc.data());
        });
        return tests;
    } catch (error) {
        throw error;
    }
}

async function startMCQTest(userId, topicId){
    try {
        const testRef = await db.collection("tests").add({
            userId: userId,
            category: "Multiple Choice Quiz",
            result: null,
            timeCompleted: null,
            topicId: topicId,
        });

        const testId = testRef.id;

        const questions = await createMCQ(testId, topicId);

        return questions;
    } catch (error) {
        throw error
    }
}

async function startQuizTest(userId, topicId){
    try {
        const testRef = await db.collection("tests").add({
            userId: userId,
            category: "Quiz",
            result: null,
            timeCompleted: null,
            topicId: topicId,
        });

        const testId = testRef.id;

        const questions = await createQuiz(testId, topicId);

        return questions;
    } catch (error) {
        throw error
    }
}

async function completeQuizTest(testId, timeCompleted) {
    try {
        const testRef = db.collection("tests").doc(testId);
        const testSnapshot = await testRef.get();
        if (!testSnapshot.exists) {
            throw new Error("Test not found");
        }

        const questionsRef = testRef.collection("quizs");
        const questionsSnapshot = await questionsRef.get();
        const totalQuestions = questionsSnapshot.docs.length;

        let correctCount = 0;
        questionsSnapshot.forEach(doc => {
            const questionData = doc.data();
            if (questionData.isCorrect) {
                correctCount++;
            }
        });

        await testRef.update({ result: correctCount, timeCompleted: timeCompleted });

        console.log("Quiz test completed successfully");
    } catch (error) {
        throw error;
    }
}

async function completeMCQTest(testId, timeCompleted) {
    try {
        const testRef = db.collection("tests").doc(testId);
        const testSnapshot = await testRef.get();
        if (!testSnapshot.exists) {
            throw new Error("Test not found");
        }

        const questionsRef = testRef.collection("questions");
        const questionsSnapshot = await questionsRef.get();
        const totalQuestions = questionsSnapshot.docs.length;

        let correctCount = 0;
        questionsSnapshot.forEach(doc => {
            const questionData = doc.data();
            if (questionData.isCorrect) {
                correctCount++;
            }
        });

        await testRef.update({ result: correctCount, timeCompleted: timeCompleted });

        console.log("MCQ test completed successfully");
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getTestByUser,
    getTestByTopic,
    startMCQTest,
    startQuizTest,
    completeMCQTest,
    completeQuizTest
}
