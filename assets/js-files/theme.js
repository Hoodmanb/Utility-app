document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.querySelector('.theme');

    function getCurrentTheme() {
        let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark': 'light';
        const storedTheme = localStorage.getItem('nwigiri.theme');
        if (storedTheme) {
            theme = storedTheme;
        }
        return theme;
    }

    function loadTheme(theme) {
        const root = document.documentElement;
        if (theme === "light") {
            themeBtn.checked = false;
        } else {
            themeBtn.checked = true;
        }
        root.setAttribute('color-scheme', theme);
    }

    themeBtn.addEventListener('change', () => {
        let theme = getCurrentTheme();
        if (theme === 'dark') {
            theme = 'light';
        } else {
            theme = 'dark';
        }
        localStorage.setItem('nwigiri.theme', theme);
        loadTheme(theme);
    });

    loadTheme(getCurrentTheme());
});