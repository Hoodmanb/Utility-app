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
    themeBtn.innerHTML = `<i class="fa-solid fa-moon" style="color:#F0F0F0; font-size:27px; "></i>`;
  } else {
    themeBtn.innerHTML = ` <i class="fa-solid fa-sun fa-spin-pulse" style="color: #FFD43B; font-size:27px;"></i>`;
  }
  root.setAttribute('color-scheme', theme);
}

themeBtn.addEventListener('click', () => {
  let theme = getCurrentTheme();
  if (theme === 'dark') {
    theme = 'light';
  } else {
    theme = 'dark';
  }
  localStorage.setItem('nwigiri.theme', theme);
  loadTheme(theme);
});

window.addEventListener('DOMContentLoaded', () => {
  loadTheme(getCurrentTheme());
});