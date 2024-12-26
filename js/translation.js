async function fetchTranslations() {
    const response = await fetch('/locales/uk.json');
    return response.json();
}

function setTranslations(translations) {
    document.querySelectorAll('[data-translate-key]').forEach(element => {
        const key = element.getAttribute('data-translate-key');
        const keys = key.split('.');
        let translation = translations;
        keys.forEach(k => {
            translation = translation ? translation[k] : null;
        });
        if (translation) {
            element.textContent = translation;
        }
    });
}

async function initializeLanguage() {
    const translations = await fetchTranslations();
    setTranslations(translations);
}

document.addEventListener('DOMContentLoaded', initializeLanguage);

