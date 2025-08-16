// ===== Helpers =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const MONTHS_RU = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const WEEKDAYS_RU = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];

// Базовые паттерны
const BASE_PATTERNS = {
  dnvv: ["Д","Н","В","В"],
  "2on2off": ["Д","Д","В","В"],
  "5_2": ["Д","Д","Д","Д","Д","В","В"]
};

// ===== State =====
let state = {
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  patternKey: localStorage.getItem("patternKey") || "dnvv",
  customPattern: JSON.parse(localStorage.getItem("customPattern") || "[]"),
  cycleStart: localStorage.getItem("cycleStart") || new Date().toISOString().split("T")[0],
  offset: parseInt(localStorage.getItem("offset") || "0", 10),
  dark: localStorage.getItem("theme") === "dark"
};

// ===== Theme handling (SVG переключение) =====
function applyTheme() {
  document.body.classList.toggle("dark", state.dark);
  const sun = $("#sunIcon"), moon = $("#moonIcon");
  if (state.dark) { sun.classList.add("hidden"); moon.classList.remove("hidden"); }
  else { sun.classList.remove("hidden"); moon.classList.add("hidden"); }
}
$("#themeToggle").addEventListener("click", () => {
  state.dark = !state.dark;
  localStorage.setItem("theme", state.dark ? "dark" : "light");
  applyTheme();
});
applyTheme();

// ===== Bottom sheet =====
const bottomMenu = $("#bottomMenu");
$("#menuToggle").addEventListener("click", () => {
  const open = !bottomMenu.classList.contains("open");
  bottomMenu.classList.toggle("open", open);
  bottomMenu.setAttribute("aria-hidden", open ? "false" : "true");
});

// Controls init
const patternChips = $("#patternChips");
const customRow = $("#customRow");
const customInput = $("#customPattern");
const cycleInput = $("#cycleStart");
const offsetInput = $("#cycleOffset");

cycleInput.value = state.cycleStart;
offsetInput.value = state.offset;
customInput.value = (state.customPattern || []).join(",");

// отметить активный чип
patternChips.querySelectorAll(".chip").forEach(ch => {
  if (ch.dataset.pattern === state.patternKey) ch.classList.add("active");
  ch.addEventListener("click", () => {
    patternChips.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    ch.classList.add("active");
    state.patternKey = ch.dataset.pattern;
    customRow.classList.toggle("hidden", state.patternKey !== "custom");
  });
});
customRow.classList.toggle("hidden", state.patternKey !== "custom");

$("#applyBtn").addEventListener("click", () => {
  state.cycleStart = cycleInput.value || state.cycleStart;
  state.offset = parseInt(offsetInput.value || "0", 10);
  if (state.patternKey === "custom") {
    const arr = customInput.value.split(/[,\\s]+/).map(s => s.trim()).filter(Boolean);
    state.customPattern = arr;
    localStorage.setItem("customPattern", JSON.stringify(arr));
  }
  localStorage.setItem("patternKey", state.patternKey);
  localStorage.setItem("cycleStart", state.cycleStart);
  localStorage.setItem("offset", String(state.offset));
  renderCalendar();
  bottomMenu.classList.remove("open");
  bottomMenu.setAttribute("aria-hidden", "true");
});

// ===== Calendar logic =====
const cal = $("#calendar");
const monthLabel = $("#monthLabel");

function getMondayBasedIndex(date) {
  const d = date.getDay(); // 0..6, где 0 = Вс
  return (d + 6) % 7 + 1;  // 1..7, где 1 = Пн
}

function pickPattern() {
  if (state.patternKey === "custom" && state.customPattern && state.customPattern.length) {
    return state.customPattern;
  }
  return BASE_PATTERNS[state.patternKey] || BASE_PATTERNS.dnvv;
}

function dayTypeFor(date) {
  const pattern = pickPattern();
  const start = new Date(state.cycleStart + "T00:00:00");
  const daysDiff = Math.floor((date - start) / (1000*60*60*24));
  const idx = (daysDiff + state.offset) % pattern.length;
  return pattern[(idx + pattern.length) % pattern.length];
}

function renderCalendar() {
  cal.innerHTML = "";
  const y = state.year, m = state.month;
  const first = new Date(y, m, 1);
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const today = new Date();
  const isThisMonth = (today.getFullYear() === y && today.getMonth() === m);

  // header
  WEEKDAYS_RU.forEach(w => {
    const h = document.createElement("div");
    h.className = "cell header";
    h.textContent = w;
    cal.appendChild(h);
  });

  // leading blanks
  const firstWeekday = getMondayBasedIndex(first);
  for (let i = 1; i < firstWeekday; i++) {
    const empty = document.createElement("div");
    empty.className = "cell header";
    empty.innerHTML = "&#8203;";
    cal.appendChild(empty);
  }

  // days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(y, m, d);
    const label = dayTypeFor(date); // "Д","Н","В"
    const cell = document.createElement("div");
    cell.className = "cell";

    const pill = document.createElement("div");
    pill.className = "pill";
    pill.textContent = label;

    if (label === "Д") cell.classList.add("work-day");
    else if (label === "Н") cell.classList.add("work-night");
    else cell.classList.add("off");

    // today ring
    if (isThisMonth && d === today.getDate()) {
      cell.classList.add("today");
      const ring = document.createElement("div");
      ring.className = "ring";
      cell.appendChild(ring);
    }

    const num = document.createElement("div");
    num.className = "num";
    num.textContent = String(d);

    cell.appendChild(pill);
    cell.appendChild(num);
    cal.appendChild(cell);
  }

  monthLabel.textContent = `${MONTHS_RU[m]} ${y}`;
}

// month nav
$("#prevMonth").addEventListener("click", () => {
  state.month--;
  if (state.month < 0) { state.month = 11; state.year--; }
  renderCalendar();
});
$("#nextMonth").addEventListener("click", () => {
  state.month++;
  if (state.month > 11) { state.month = 0; state.year++; }
  renderCalendar();
});

renderCalendar();

// ===== PWA =====
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js");
  });
}
