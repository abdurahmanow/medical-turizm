// Открыть pop-up
const popup = document.getElementById('popup');
const contactButton = document.getElementById('contact-button');
const closePopup = document.querySelector('.close-popup');

contactButton.addEventListener('click', () => {
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
    e.preventDefault(); // Останавливаем стандартную отправку формы

    // Собираем данные с формы
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const direction = document.getElementById('direction').value;
    const comment = document.getElementById('comment').value;

    // Подставьте ваш токен бота и chat_id (ID чата или канала)
    const botToken = '1216940738:AAEg5JGMKiM1PWfnsJ2EgMFYE_dafan7AbI';
    const chatId = '-1001963011260';
    const message = `Новая заявка:\nИмя: ${name}\nТелефон: +38${phone}\nНаправление: ${direction}\nКомментарий: ${comment}`;

    // Отправляем запрос к Telegram API
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
            alert('Заявка успешно отправлена!');
        } else {
            alert('Ошибка отправки заявки.');
        }
    })
    .catch(error => {
        alert('Произошла ошибка: ' + error);
    });
});
