
// Function to toggle answers for FAQs
function toggleAnswer(questionElement) {
    const answerElement = questionElement.nextElementSibling;
    const toggleSymbol = questionElement.querySelector('.toggle');

    if (answerElement.style.display === 'block') {
        answerElement.style.display = 'none';
        toggleSymbol.textContent = '+';
    } else {
        answerElement.style.display = 'block';
        toggleSymbol.textContent = '−';
    }
}


