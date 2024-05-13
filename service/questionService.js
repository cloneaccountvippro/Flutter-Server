const admin = require("firebase-admin");
const db = admin.firestore();
const { addTrainedId } = require("./userService");
async function getRandomWordsByTopic(count, topicId) {
    try {
        const snapshot = await db.collection("words").where("topicId", "==", topicId).get();
        const words = snapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
        });
        const shuffledWords = shuffleArray(words);
        const randomWords = shuffledWords.slice(0, count);
        return randomWords;
    } catch (error) {
        throw error;
    }
}

async function getRandomWordsExceptByTopic(count, wordId, topicId) {
    try {
        const snapshot = await db.collection("words").where("topicId", "==", topicId).get();
        const allWords = snapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
        });
        const filteredWords = allWords.filter(word => word.id !== wordId);
        const shuffledWords = shuffleArray(filteredWords);
        const randomWords = shuffledWords.slice(0, count);
        return randomWords;
    } catch (error) {
        throw error;
    }
}


async function createMCQ(testId, topicId){
    try {
        const randomWords = await getRandomWordsByTopic(10, topicId);
        const questions = [];
        for(const word of randomWords){
            const question = {
                testId: testId,
                wordId: word.id,
                question: `What is this ${word.word} mean in Vietnamese ?`,
                isCorrect: false,
                correctAnswer: word.vocab,
                inCorrectAnswers: [],
                options: []
            }
            const incorrectWord = await getRandomWordsExceptByTopic(3, word.id, topicId);
            const incorrectAnswers = incorrectWord.map(word => word.vocab);

            const options = [word.vocab, ...incorrectAnswers];
            question.options = shuffleArray(options);
            question.inCorrectAnswers = incorrectAnswers;

            
            questions.push(question);
        }

        const batch = db.batch();
        questions.forEach(question => {
            const questionRef = db.collection("tests").doc(testId).collection("questions").doc();
            batch.set(questionRef, question);
        });
        await batch.commit();

        return questions
    } catch (error) {
        throw error
    }
}

// Helper function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function createQuiz(testId, topicId) {
    const numberOfQuestions = 10;

    try {
        // Fetch random words to use in the quiz
        const randomWords = await getRandomWordsByTopic(numberOfQuestions, topicId);
        
        // Initialize an array to store quiz questions
        const quizes = [];

        // Iterate over each random word to create quiz questions
        for (const word of randomWords) {
            const quiz = {
                testId: testId,
                wordId: word.id,
                question: `What is this ${word.word} mean in Vietnamese ?`,
                isCorrect: false,
                correctAnswer: word.vocab,
                inCorrectAnswers: [],
                options: []
            };
            quizes.push(quiz);
        }
        const batch = db.batch();
        quizes.forEach(quiz => {
            const quizRef = db.collection("tests").doc(testId).collection("questions").doc();
            batch.set(quizRef, quiz);
        });
        await batch.commit();

        return quizes;
    } catch (error) {
        throw error;
    }
}

async function checkMCQResult(questionId, answer, userId) {
    try {
        const questionDoc = await db.collection("questions").doc(questionId).get();
        if (!questionDoc.exists) {
            throw new Error("Question not found");
        }
        
        const correctAnswer = questionDoc.data().correctAnswer;

        const isCorrect = answer === correctAnswer;
        if(isCorrect){
            await addTrainedId(questionDoc.data().wordId, userId)
        }
        return { isCorrect, correctAnswer };
    } catch (error) {
        throw error;
    }
}

async function checkQuizResult(questionId, answer, userId) {
    try {
        const question = await db.collection("questions").doc(questionId).get();
        if(!question.exists){
            throw new Error("Question not found")
        }

        const isCorrect = answer === question.correctAnswer
        if(isCorrect){
            await addTrainedId(question.data().wordId, userId)
        }
        return isCorrect
    } catch (error) {
        
    }
}

module.exports = {
    createMCQ,
    createQuiz,
    checkMCQResult,
    checkQuizResult
}
