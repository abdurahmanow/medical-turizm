// Открыть pop-up
const popup = document.getElementById('popup');
const contactButton = document.getElementById('contact-button');
const openPopupButton = document.getElementById('open-popup'); // Вторая кнопка
const closePopup = document.querySelector('.close-popup');

contactButton.addEventListener('click', () => {
    popup.style.display = 'flex';
});

// Добавляем обработчик для второй кнопки
openPopupButton.addEventListener('click', (e) => {
    e.preventDefault();
    popup.style.display = 'flex';
});

// Закрыть pop-up
closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
});

// Закрыть pop-up при клике вне его области
window.addEventListener('click', (e) => {
    if (e.target === popup) {
        popup.style.display = 'none';
    }
});

/* ---------- Универсальная валидация телефона ---------- */
/** Санитизация: оставляем только цифры и один '+' в начале */
function sanitizePhone(input) {
    let v = input.replace(/[^\d+]/g, '');         // только цифры и '+'
    if (v.includes('+')) v = '+' + v.replace(/\+/g, ''); // только один '+' в начале
    // ограничиваем максимум 15 цифр (по E.164)
    const digits = v.replace(/\D/g, '').slice(0, 15);
    return (v.startsWith('+') ? '+' : '') + digits;
}

/** Проверка формата: опционально '+', 7–15 цифр */
function isValidPhone(v) {
    return /^\+?\d{7,15}$/.test(v);
}

/* ---------- Проверка заполненности формы ---------- */
function checkFormCompletion() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const direction = document.getElementById('direction').value;
    const submitBtn = document.getElementById('submitBtn');

    const valid = name && isValidPhone(phone) && direction !== '';
    submitBtn.disabled = !valid;
    submitBtn.classList.toggle('active', valid);
}

/* ---------- Обработчики инпутов ---------- */
// Телефон: только цифры и опционально '+' в начале, длина до 15 цифр
document.getElementById('phone').addEventListener('input', function (e) {
    const sanitized = sanitizePhone(e.target.value);
    if (e.target.value !== sanitized) e.target.value = sanitized;
    checkFormCompletion();
});

// Имя: запрещаем цифры
document.getElementById('name').addEventListener('input', function (e) {
    const nameInput = e.target;
    const cleaned = nameInput.value.replace(/\d/g, '');
    if (nameInput.value !== cleaned) nameInput.value = cleaned;
    checkFormCompletion();
});

// Направление
document.getElementById('direction').addEventListener('change', checkFormCompletion);

/* ---------- Поведение кнопки Отправить ---------- */
document.getElementById('submitBtn').addEventListener('click', function (e) {
    const phone = document.getElementById('phone').value.trim();
    if (!isValidPhone(phone)) {
        alert('Введите корректный номер телефона (только цифры, можно с +, 7–15 цифр).');
        e.preventDefault();
    } else {
        // Отправка обработается обработчиком submit ниже
        // console.log('Кнопка нажата, форма будет отправлена');
    }
});

/* ---------- Отправка формы в Telegram ---------- */
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const submitButton = document.getElementById('submitBtn');
    if (submitButton.disabled) return;

    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim(); // уже универсальный формат
    const direction = document.getElementById('directionText').value;

    const botToken = '7273500669:AAGOade_TuXW51wxTMp516kLI_UDf-xkOO8';
    const chatId = '-1001963011260';
    const message = `Новая заявка:\nИмя: ${name}\nТелефон: ${phone}\nНаправление: ${direction}`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message })
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            showToast('Заявка успешно отправлена!');
            document.getElementById('contact-form').reset();
            popup.style.display = 'none';
        } else {
            showToast('Ошибка отправки заявки.');
        }
    })
    .catch(error => {
        showToast('Произошла ошибка: ' + error);
    })
    .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Отправить';
    });
});

/* ---------- Toast ---------- */
function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;
    toastContainer.appendChild(toast);
    toastContainer.style.display = 'block';
    setTimeout(() => {
        toast.remove();
        if (!toastContainer.children.length) toastContainer.style.display = 'none';
    }, 5000);
}

/* ---------- Скрытое поле для текста направления ---------- */
function updateDirectionText() {
    const directionSelect = document.getElementById('direction');
    const directionText = directionSelect.options[directionSelect.selectedIndex].text;
    document.getElementById('directionText').value = directionText;
}
