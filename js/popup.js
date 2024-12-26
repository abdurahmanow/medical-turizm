// Открыть pop-up
const popup = document.getElementById('popup');
const contactButton = document.getElementById('contact-button');
const openPopupButton = document.getElementById('open-popup'); // Вторая кнопка
const closePopup = document.querySelector('.close-popup');

contactButton.addEventListener('click', () => {
    popup.style.display = 'flex';
});

// Добавляем обработчик для второй кнопки
openPopupButton.addEventListener('click', () => {
    popup.style.display = 'flex';
});

// Закрыть pop-up
closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
});

// Закрыть pop-up при клике вне его области
window.addEventListener('click', (e) => {
    if (e.target == popup) {
        popup.style.display = 'none';
    }
});

// Функция для проверки, заполнены ли все поля
function checkFormCompletion() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const direction = document.getElementById('direction').value;
    const submitBtn = document.getElementById('submitBtn');

    // Проверяем, что все поля заполнены
    if (name && phone.length === 10 && direction !== '') {
        submitBtn.disabled = false;
        submitBtn.classList.add('active'); // Меняем цвет кнопки
    } else {
        submitBtn.disabled = true;
        submitBtn.classList.remove('active'); // Возвращаем неактивное состояние
    }
}

// Ограничиваем ввод только цифр в поле телефона и добавляем валидацию
document.getElementById('phone').addEventListener('input', function (e) {
    const phoneInput = e.target;
    const value = phoneInput.value.replace(/\D/g, ''); // Удаляем все нецифровые символы
    const isValidStart = value.startsWith('0'); // Проверяем, начинается ли номер с 0

    if (!isValidStart) {
        phoneInput.value = ''; // Если не начинается с 0, очищаем поле
    } else if (value.length <= 10) {
        phoneInput.value = value; // Оставляем только цифры и до 9 символов
    }
    checkFormCompletion(); // Проверяем форму
});

// Запрещаем ввод цифр в поле имени
document.getElementById('name').addEventListener('input', function (e) {
    const nameInput = e.target;
    nameInput.value = nameInput.value.replace(/\d/g, ''); // Убираем цифры
    checkFormCompletion(); // Проверяем форму
});

// Следим за изменениями в поле "Направление"
document.getElementById('direction').addEventListener('change', function () {
    checkFormCompletion(); // Проверяем форму
});

// Действие при клике на кнопку отправки
document.getElementById('submitBtn').addEventListener('click', function (e) {
    const phone = document.getElementById('phone').value;
    if (phone.length !== 10) {
        alert('Введите корректный номер телефона (0XX-XX-XX-XXX).');
        e.preventDefault(); // Останавливаем отправку формы
    } else {
        // Отправка данных в Телеграм
        console.log('Форма отправлена');
    }
});

document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const submitButton = document.getElementById('submitBtn');
    const popup = document.getElementById('popup'); // Получаем pop-up

    if (submitButton.disabled) return;

    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const direction = document.getElementById('directionText').value;

    const botToken = '7273500669:AAGOade_TuXW51wxTMp516kLI_UDf-xkOO8';
    const chatId = '-1001963011260';
    const message = `Новая заявка:\nИмя: ${name}\nТелефон: +38${phone}\nНаправление: ${direction}`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            showToast('Заявка успешно отправлена!');
            document.getElementById('contact-form').reset();

            // Закрытие pop-up после успешной отправки
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

// Функция для показа уведомления
function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    toastContainer.style.display = 'block';

    // Удаляем уведомление через 5 секунд
    setTimeout(() => {
        toast.remove();
        if (toastContainer.children.length === 0) {
            toastContainer.style.display = 'none';
        }
    }, 5000);
}

function updateDirectionText() {
    const directionSelect = document.getElementById('direction');
    const directionText = directionSelect.options[directionSelect.selectedIndex].text;

    // Записываем текст выбранного направления в скрытое поле
    document.getElementById('directionText').value = directionText;
}
