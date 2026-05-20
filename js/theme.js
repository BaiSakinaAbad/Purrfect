document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('purrfectTheme') || 'light';

    function applyTheme(theme) {
        const isDark = theme === 'dark';

        document.body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('purrfectTheme', theme);

        if (!themeToggle) return;

        themeToggle.classList.toggle('is-dark', isDark);
        themeToggle.setAttribute('aria-pressed', String(isDark));
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        themeToggle.querySelector('.theme-toggle-text').textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }

    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
            applyTheme(nextTheme);
        });
    }
});
