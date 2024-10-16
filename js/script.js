// Логика скрытия и показа меню при скролле
let lastScrollTop = 0;
const header = document.getElementById('main-header');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 300) {
        header.style.top = '-100px';  // Скрыть
    } else if (scrollTop < lastScrollTop) {
        header.style.top = '0';  // Показать
    }
    
    lastScrollTop = scrollTop;
});
