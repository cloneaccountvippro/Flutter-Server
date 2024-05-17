const admin = require("firebase-admin");
const db = admin.firestore();
const {
    createMCQ,
    createQuiz
} = require("./questionService");

async function getTestByUser(userId) {
    try {
        const testsSnapshot = await db.collection("tests").where("userId", "==", userId).get();
        const tests = [];

        for (const doc of testsSnapshot.docs) {
            const test = doc.data();

            // Get the topic name based on topic ID
            const topicSnapshot = await db.collection("topics").doc(test.topicId).get();
            const topicName = topicSnapshot.exists ? topicSnapshot.data().name : "Unknown Topic";

            // Add the topic name to the test data
            test.topicName = topicName;
            tests.push(test);
        }

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
            timeCreated: admin.firestore.Timestamp.now()
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
            timeCreated: admin.firestore.Timestamp.now()
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

async function getTestsByTopicWithUserFullName(topicId) {
    try {
        const snapshot = await db.collection("tests").where("topicId", "==", topicId).get();
        const categorizedTests = {};

        // Iterate over each test
        for (const doc of snapshot.docs) {
            const test = doc.data();

            // Ignore tests with null result or timeCompleted
            if (test.result == null || test.timeCompleted == null) {
                continue;
            }

            // Get user full name based on user ID
            const userSnapshot = await db.collection("users").doc(test.userId).get();
            const userFullName = userSnapshot.exists ? userSnapshot.data().fullName : "Unknown User";

            // Add user full name to the test data
            test.userFullName = userFullName;

            // Group tests by category
            const category = test.category || "Uncategorized";
            categorizedTests[category] = categorizedTests[category] || {};

            // If this is the first test for this user in this category or the current test has a better result,
            // update the best result for this user in this category
            if (!categorizedTests[category][test.userId] || test.result > categorizedTests[category][test.userId].correctResult) {
                categorizedTests[category][test.userId] = {
                    userFullName: userFullName,
                    correctResult: test.result,
                    timeCompleted: test.timeCompleted
                };
            }
        }

        // Convert categorizedTests object to an array of objects for each category
        const categorizedTestsArray = Object.keys(categorizedTests).map(category => {
            return {
                category: category,
                tests: Object.values(categorizedTests[category])
            };
        });

        // Sort tests in each category by correct result and time completed
        categorizedTestsArray.forEach(categoryObj => {
            categoryObj.tests.sort((a, b) => {
                if (b.correctResult !== a.correctResult) {
                    return b.correctResult - a.correctResult; // Sort by correct result (higher to lower)
                } else {
                    return a.timeCompleted - b.timeCompleted; // If correct result is the same, sort by time completed (lower to higher)
                }
            });
        });

        return categorizedTestsArray;
    } catch (error) {
        throw error;
    }
}
async function getTestsByTopicWithUserFullName(topicId) {
    try {
        const snapshot = await db.collection("tests").where("topicId", "==", topicId).get();
        const categorizedTests = {};

        // Iterate over each test
        for (const doc of snapshot.docs) {
            const test = doc.data();

            // Ignore tests with null result or timeCompleted
            if (test.result == null || test.timeCompleted == null) {
                continue;
            }

            // Get user full name based on user ID
            const userSnapshot = await db.collection("users").doc(test.userId).get();
            const userFullName = userSnapshot.exists ? userSnapshot.data().fullName : "Unknown User";

            // Add user full name to the test data
            test.userFullName = userFullName;

            // Group tests by category
            const category = test.category || "Uncategorized";
            categorizedTests[category] = categorizedTests[category] || {};

            // If this is the first test for this user in this category or the current test has a better result,
            // update the best result for this user in this category
            if (!categorizedTests[category][test.userId] || test.result > categorizedTests[category][test.userId].correctResult) {
                categorizedTests[category][test.userId] = {
                    userFullName: userFullName,
                    correctResult: test.result,
                    timeCompleted: test.timeCompleted
                };
            }
        }

        // Convert categorizedTests object to an array of objects for each category
        const categorizedTestsArray = Object.keys(categorizedTests).map(category => {
            return {
                category: category,
                tests: Object.values(categorizedTests[category])
            };
        });

        // Sort tests in each category by correct result and time completed
        categorizedTestsArray.forEach(categoryObj => {
            categoryObj.tests.sort((a, b) => {
                if (b.correctResult !== a.correctResult) {
                    return b.correctResult - a.correctResult; // Sort by correct result (higher to lower)
                } else {
                    return a.timeCompleted - b.timeCompleted; // If correct result is the same, sort by time completed (lower to higher)
                }
            });
        });

        return categorizedTestsArray;
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
    completeQuizTest,
    getTestsByTopicWithUserFullName
}
