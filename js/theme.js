// js/theme.js
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('moneywise_dark_mode', isDarkMode);
}

function initializeTheme() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }

    // Check saved preference
    const savedDarkMode = localStorage.getItem('moneywise_dark_mode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
    }
}

document.addEventListener('DOMContentLoaded', initializeTheme);
