class Question {
    constructor(testId, wordId, question, isCorrect, correctAnswer, inCorrectAnswers = [], options = []) {
        this.testId = testId;
        this.wordId = wordId;
        this.question = question;
        this.isCorrect = isCorrect;
        this.correctAnswer = correctAnswer;
        this.inCorrectAnswers = inCorrectAnswers;
        this.options = options;
    }
}

module.exports = Question
