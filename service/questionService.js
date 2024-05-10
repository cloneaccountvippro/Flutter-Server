const admin = require("firebase-admin");
const db = admin.firestore();

async function getRandomWords(count) {
    try {
        // Fetch all words from the collection
        const snapshot = await db.collection("words").get();
        
        // Map the document snapshots to word objects
        const allWords = snapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
        });
        
        // Shuffle the array of words
        const shuffledWords = shuffleArray(allWords);
        
        // Select the first 'count' words from the shuffled array
        const randomWords = shuffledWords.slice(0, count);
        
        return randomWords;
    } catch (error) {
        throw error;
    }
}

async function getQuestion(questionId) {
    const question = await db.collection("questions").doc(questionId).get();
    return question.data();
}

async function createMCQ(testId){
    try {
        const randomWords = await getRandomWords(10);
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
            const incorrectWord = await getRandomWordsExcept(3, word.id);
            const incorrectAnswers = incorrectWord.map(word => word.vocab);

            const options = [word.vocab, ...incorrectAnswers];
            question.options = shuffleArray(options);
            question.inCorrectAnswers = incorrectAnswers;

            questions.push(question);
        }
        return questions
    } catch (error) {
        throw error
    }
}

async function getRandomWordsExcept(count, wordId) {
    try {
        // Fetch all words from the collection
        const snapshot = await db.collection("words").get();
        
        // Map the document snapshots to word objects
        const allWords = snapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() };
        });
        
        // Filter out the word with the specified wordId
        const filteredWords = allWords.filter(word => word.id !== wordId);
        
        // Shuffle the array of words
        const shuffledWords = shuffleArray(filteredWords);
        
        // Select the first 'count' words from the shuffled array
        const randomWords = shuffledWords.slice(0, count);
        
        return randomWords;
    } catch (error) {
        throw error;
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

async function createQuiz(testId) {
    const numberOfQuestions = 10;

    try {
        // Fetch random words to use in the quiz
        const randomWords = await getRandomWords(numberOfQuestions);
        
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

        return quizes;
    } catch (error) {
        throw error;
    }
}

async function checkMCQResult(questionId, answer) {
    try {
        const questionDoc = await db.collection("questions").doc(questionId).get();
        if (!questionDoc.exists) {
            throw new Error("Question not found");
        }
        
        const correctAnswer = questionDoc.data().correctAnswer;

        const isCorrect = answer === correctAnswer;
        
        return { isCorrect, correctAnswer };
    } catch (error) {
        throw error;
    }
}

async function checkQuizResult(questionId, answer) {
    try {
        const question = await db.collection("questions").doc(questionId).get();
        if(!question.exists){
            throw new Error("Question not found")
        }

        const isCorrect = answer === question.correctAnswer
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
