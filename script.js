const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
const calendar = document.getElementById('calendar');

function renderCalendar() {
  calendar.innerHTML = '';
  const days = 28; // пример
  const today = new Date().getDate();
  for (let i = 1; i <= days; i++) {
    const div = document.createElement('div');
    div.classList.add('day');
    div.textContent = i;
    if (i === today) div.classList.add('today');
    calendar.appendChild(div);
  }
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

menuToggle.addEventListener('click', () => {
  menu.classList.toggle('open');
});

// свайп вниз для закрытия меню
let startY;
menu.addEventListener('touchstart', e => startY = e.touches[0].clientY);
menu.addEventListener('touchend', e => {
  const endY = e.changedTouches[0].clientY;
  if (endY - startY > 50) menu.classList.remove('open');
});

renderCalendar();
