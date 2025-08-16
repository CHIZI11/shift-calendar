// Тема (солнце/луна)
const themeBtn = document.getElementById("themeToggle");
const root = document.documentElement;
let dark = false;

function setTheme(isDark) {
  dark = isDark;
  if (dark) {
    root.style.setProperty("--bg", "#0f172a");
    root.style.setProperty("--text", "#f1f5f9");
    root.style.setProperty("--header", "#334155");
    themeBtn.innerHTML = "🌙"; // позже заменим svg
  } else {
    root.style.setProperty("--bg", "#ffffff");
    root.style.setProperty("--text", "#000000");
    root.style.setProperty("--header", "#10b981");
    themeBtn.innerHTML = "☀️"; // позже заменим svg
  }
}

themeBtn.addEventListener("click", () => setTheme(!dark));
setTheme(false);

// Календарь
const calendar = document.getElementById("calendar");
const today = new Date().getDate();

for (let i = 1; i <= 30; i++) {
  const div = document.createElement("div");
  div.className = "day";
  div.textContent = i;
  if (i === today) div.classList.add("current");
  calendar.appendChild(div);
}

// Меню
const menu = document.getElementById("menu");
document.getElementById("menuToggle").onclick = () => {
  menu.classList.toggle("open");
};

// Service Worker для PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
