function toggleFaq(element) {
    // Закрыть все открытые ответы
    document.querySelectorAll('.faq-answer').forEach((answer) => {
        answer.classList.remove('active');
    });
    document.querySelectorAll('.faq-question').forEach((question) => {
        question.classList.remove('active');
    });

    // Открыть выбранный ответ
    const answer = element.nextElementSibling;
    if (!answer.classList.contains('active')) {
        answer.classList.add('active');
        element.classList.add('active');
    }
}
