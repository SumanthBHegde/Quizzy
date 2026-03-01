/**
 * md_to_quiz.js
 * Task 2: Markdown -> Quiz Page Converter Script
 * 
 * This script provides logic to parse a specific Markdown quiz format and 
 * an answer key string into a structured JSON format suitable for rendering.
 */

/**
 * Parses the quiz Markdown text.
 * Expects questions in format: **n. Question text?**
 * Expects options in format: - A) Option text
 */
function parseQuizMarkdown(markdown) {
    const questions = [];
    
    // Split by double asterisks to find question blocks, or use a line-by-line approach
    // Line-by-line is safer for this specific format
    const lines = markdown.split('\n');
    let currentQuestion = null;

    lines.forEach(line => {
        const trimmed = line.trim();
        
        // Match Question: **1. Which statement...**
        const qMatch = trimmed.match(/^\*\*(\d+)\.\s*(.*?)\*\*$/);
        if (qMatch) {
            if (currentQuestion) questions.push(currentQuestion);
            currentQuestion = {
                number: parseInt(qMatch[1]),
                question: qMatch[2],
                options: {},
                correct: null
            };
            return;
        }

        // Match Option: - A) Agile always...
        const oMatch = trimmed.match(/^- ([A-D])\)\s*(.*)$/);
        if (oMatch && currentQuestion) {
            currentQuestion.options[oMatch[1]] = oMatch[2];
        }
    });

    if (currentQuestion) questions.push(currentQuestion);
    return questions;
}

/**
 * Parses the answer key string.
 * Expects format: 1. B | 26. B | ...
 */
function parseAnswerKey(answerKeyText) {
    const answers = {};
    // Match patterns like "1. B" or "26. B"
    const matches = answerKeyText.matchAll(/(\d+)\.\s*([A-D])/g);
    for (const match of matches) {
        answers[parseInt(match[1])] = match[2];
    }
    return answers;
}

/**
 * Merges questions and answers into a single structure.
 */
function buildQuizData(mdText, answerKeyText) {
    const questions = parseQuizMarkdown(mdText);
    const answers = parseAnswerKey(answerKeyText);

    questions.forEach(q => {
        q.correct = answers[q.number] || null;
    });

    return questions;
}

/**
 * Example Usage Implementation
 * This function would be called by the UI to generate the quiz.
 */
function generateQuizFromInput(mdText, answerKeyText, containerId) {
    const questions = buildQuizData(mdText, answerKeyText);
    const container = document.getElementById(containerId);
    
    if (!container) return;

    // Reuse the rendering logic (assuming renderQuiz and checkAnswer are available globally)
    if (typeof renderQuiz === 'function') {
        renderQuiz(questions, container);
    } else {
        console.error("renderQuiz function not found. Ensure it is defined in your HTML.");
    }
}

// Export for use in other scripts if needed
if (typeof module !== 'undefined') {
    module.exports = { parseQuizMarkdown, parseAnswerKey, buildQuizData };
}
