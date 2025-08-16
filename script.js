const monthYear = document.getElementById("monthYear");
const calendar = document.getElementById("calendar");
const prevMonth = document.getElementById("prevMonth");
const menuToggle = document.getElementById("menuToggle");
const themeToggle = document.getElementById("themeToggle");
const bottomSheet = document.getElementById("bottomSheet");

const noteModal = document.getElementById("noteModal");
const closeModal = document.getElementById("closeModal");
const noteDate = document.getElementById("noteDate");
const noteText = document.getElementById("noteText");
const saveNote = document.getElementById("saveNote");

let current = new Date();
let notes = JSON.parse(localStorage.getItem("notes") || "{}");

function renderCalendar() {
  calendar.innerHTML = "";
  const year = current.getFullYear();
  const month = current.getMonth();
  monthYear.textContent = current.toLocaleString("ru", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1).getDay() || 7;
  const daysInMonth = new Date(year, month+1, 0).getDate();

  for (let i=1; i<firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  for (let d=1; d<=daysInMonth; d++) {
    const day = document.createElement("div");
    day.className = "day";
    day.textContent = d;

    const dateKey = `${year}-${month+1}-${d}`;
    if (notes[dateKey]) {
      const marker = document.createElement("div");
      marker.className = "marker";
      day.appendChild(marker);
    }

    const today = new Date();
    if (d===today.getDate() && month===today.getMonth() && year===today.getFullYear()) {
      day.classList.add("current");
    }

    day.onclick = () => openNoteModal(dateKey);
    calendar.appendChild(day);
  }
}

function openNoteModal(key) {
  noteDate.textContent = key;
  noteText.value = notes[key] || "";
  noteModal.classList.remove("hidden");
  saveNote.onclick = () => {
    notes[key] = noteText.value;
    if (!noteText.value) delete notes[key];
    localStorage.setItem("notes", JSON.stringify(notes));
    noteModal.classList.add("hidden");
    renderCalendar();
  }
}

closeModal.onclick = () => noteModal.classList.add("hidden");

prevMonth.onclick = () => { current.setMonth(current.getMonth()-1); renderCalendar(); };
document.getElementById("nextMonth")?.onclick = () => { current.setMonth(current.getMonth()+1); renderCalendar(); };

menuToggle.onclick = () => bottomSheet.classList.toggle("show");
themeToggle.onclick = () => document.body.classList.toggle("dark");

renderCalendar();
