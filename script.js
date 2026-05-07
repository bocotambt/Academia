const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const examInput = document.getElementById("examInput");
const examDateInput = document.getElementById("examDateInput");
const addExamBtn = document.getElementById("addExamBtn");
const examList = document.getElementById("examList");

const noteTitleInput = document.getElementById("noteTitleInput");
const noteTextInput = document.getElementById("noteTextInput");
const addNoteBtn = document.getElementById("addNoteBtn");
const notesList = document.getElementById("notesList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let exams = JSON.parse(localStorage.getItem("exams")) || [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tabName = button.dataset.tab;

    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(tabName).classList.add("active");
  });
});

function saveData() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("exams", JSON.stringify(exams));
  localStorage.setItem("notes", JSON.stringify(notes));
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task;

    li.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveData();
      renderTasks();
    });

    taskList.appendChild(li);
  });
}

function renderExams() {
  examList.innerHTML = "";

  exams.forEach((exam, index) => {
    const li = document.createElement("li");
    li.textContent = `${exam.name} — ${exam.date}`;

    li.addEventListener("click", () => {
      exams.splice(index, 1);
      saveData();
      renderExams();
    });

    examList.appendChild(li);
  });
}

function renderNotes() {
  notesList.innerHTML = "";

  notes.forEach((note, index) => {
    const card = document.createElement("div");
    card.className = "note-card";

    card.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.text}</p>
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;

    notesList.appendChild(card);
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const index = button.dataset.index;
      notes.splice(index, 1);
      saveData();
      renderNotes();
    });
  });
}

addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  tasks.push(taskText);
  taskInput.value = "";
  saveData();
  renderTasks();
});

addExamBtn.addEventListener("click", () => {
  const examName = examInput.value.trim();
  const examDate = examDateInput.value;

  if (!examName || !examDate) return;

  exams.push({ name: examName, date: examDate });
  examInput.value = "";
  examDateInput.value = "";
  saveData();
  renderExams();
});

addNoteBtn.addEventListener("click", () => {
  const noteTitle = noteTitleInput.value.trim();
  const noteText = noteTextInput.value.trim();

  if (!noteTitle || !noteText) return;

  notes.push({ title: noteTitle, text: noteText });
  noteTitleInput.value = "";
  noteTextInput.value = "";
  saveData();
  renderNotes();
});

renderTasks();
renderExams();
renderNotes();
