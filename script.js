document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
  });

  const menuToggle = document.getElementById("menu-toggle");
  menuToggle.addEventListener("click", () => {
    alert("Тут будет меню выбора смен");
  });
});
