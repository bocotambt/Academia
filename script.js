const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

const courseNameInput = document.getElementById("courseNameInput");
const courseCodeInput = document.getElementById("courseCodeInput");
const courseColorInput = document.getElementById("courseColorInput");
const addCourseBtn = document.getElementById("addCourseBtn");
const courseList = document.getElementById("courseList");

const taskCourseInput = document.getElementById("taskCourseInput");
const taskInput = document.getElementById("taskInput");
const taskDueDateInput = document.getElementById("taskDueDateInput");
const taskStatusInput = document.getElementById("taskStatusInput");
const taskPriorityInput = document.getElementById("taskPriorityInput");
const taskSortInput = document.getElementById("taskSortInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const examCourseInput = document.getElementById("examCourseInput");
const examInput = document.getElementById("examInput");
const examDateInput = document.getElementById("examDateInput");
const addExamBtn = document.getElementById("addExamBtn");
const examList = document.getElementById("examList");

const noteCourseInput = document.getElementById("noteCourseInput");
const noteTitleInput = document.getElementById("noteTitleInput");
const noteTextInput = document.getElementById("noteTextInput");
const addNoteBtn = document.getElementById("addNoteBtn");
const notesList = document.getElementById("notesList");

const plannerDayInput = document.getElementById("plannerDayInput");
const plannerCourseInput = document.getElementById("plannerCourseInput");
const plannerTitleInput = document.getElementById("plannerTitleInput");
const plannerTimeInput = document.getElementById("plannerTimeInput");
const addPlannerBtn = document.getElementById("addPlannerBtn");

let courses = JSON.parse(localStorage.getItem("courses")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let exams = JSON.parse(localStorage.getItem("exams")) || [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let plannerItems = JSON.parse(localStorage.getItem("plannerItems")) || [];

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
  localStorage.setItem("courses", JSON.stringify(courses));
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("exams", JSON.stringify(exams));
  localStorage.setItem("notes", JSON.stringify(notes));
  localStorage.setItem("plannerItems", JSON.stringify(plannerItems));
}

function renderCourseOptions() {
  const selects = [taskCourseInput, examCourseInput, noteCourseInput, plannerCourseInput];

  selects.forEach((select) => {
    select.innerHTML = `<option value="">Choose course</option>`;

    courses.forEach((course) => {
      const option = document.createElement("option");
      option.value = course.code;
      option.textContent = `${course.code} - ${course.name}`;
      select.appendChild(option);
    });
  });
}

function getCourseByCode(code) {
  return courses.find((course) => course.code === code);
}

function getStatusClass(status) {
  if (status === "To do") return "status-todo";
  if (status === "Doing") return "status-doing";
  if (status === "Done") return "status-done";
  return "";
}

function getPriorityClass(priority) {
  if (priority === "High") return "priority-high";
  if (priority === "Medium") return "priority-medium";
  if (priority === "Low") return "priority-low";
  return "";
}

function sortTasks(taskArray) {
  const sortBy = taskSortInput ? taskSortInput.value : "default";
  const sorted = [...taskArray];

  if (sortBy === "dueDate") {
    sorted.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  } else if (sortBy === "priority") {
    const order = { High: 1, Medium: 2, Low: 3 };
    sorted.sort((a, b) => order[a.priority] - order[b.priority]);
  } else if (sortBy === "status") {
    const order = { "To do": 1, Doing: 2, Done: 3 };
    sorted.sort((a, b) => order[a.status] - order[b.status]);
  }

  return sorted;
}

function renderCourses() {
  courseList.innerHTML = "";

  courses.forEach((course, index) => {
    const card = document.createElement("div");
    card.className = "course-card";
    card.innerHTML = `
      <span class="course-badge" style="background:${course.color}">${course.code}</span>
      <h3>${course.name}</h3>
      <p class="meta">Color: ${course.color}</p>
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;
    courseList.appendChild(card);
  });

  courseList.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      const deletedCourse = courses[index];

      tasks = tasks.filter((task) => task.courseCode !== deletedCourse.code);
      exams = exams.filter((exam) => exam.courseCode !== deletedCourse.code);
      notes = notes.filter((note) => note.courseCode !== deletedCourse.code);
      plannerItems = plannerItems.filter((item) => item.courseCode !== deletedCourse.code);

      courses.splice(index, 1);
      saveData();
      renderAll();
    });
  });
}

function renderTasks() {
  taskList.innerHTML = "";
  const sortedTasks = sortTasks(tasks);

  sortedTasks.forEach((task) => {
    const course = getCourseByCode(task.courseCode);
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="status-badge ${getStatusClass(task.status)}">${task.status}</span>
      <span class="priority-badge ${getPriorityClass(task.priority)}">${task.priority}</span>
      <strong>${task.text}</strong><br>
      <span class="meta">${course ? course.code + " - " + course.name : "No course"}</span><br>
      <span class="meta">Due: ${task.dueDate || "No due date"}</span>
    `;

    li.addEventListener("click", () => {
      const realIndex = tasks.findIndex(
        (savedTask) =>
          savedTask.courseCode === task.courseCode &&
          savedTask.text === task.text &&
          savedTask.dueDate === task.dueDate &&
          savedTask.status === task.status &&
          savedTask.priority === task.priority
      );

      if (realIndex !== -1) {
        tasks.splice(realIndex, 1);
        saveData();
        renderTasks();
      }
    });

    taskList.appendChild(li);
  });
}

function renderExams() {
  examList.innerHTML = "";

  exams.forEach((exam, index) => {
    const li = document.createElement("li");
    const course = getCourseByCode(exam.courseCode);
    li.innerHTML = `
      <strong>${exam.name}</strong><br>
      <span class="meta">${exam.date} • ${course ? course.code + " - " + course.name : "No course"}</span>
    `;

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
    const course = getCourseByCode(note.courseCode);
    const card = document.createElement("div");
    card.className = "note-card";

    card.innerHTML = `
      <h3>${note.title}</h3>
      <p class="meta">${course ? course.code + " - " + course.name : "No course"}</p>
      <p>${note.text}</p>
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;

    notesList.appendChild(card);
  });

  notesList.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      notes.splice(index, 1);
      saveData();
      renderNotes();
    });
  });
}

function renderPlanner() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  days.forEach((day) => {
    const dayList = document.getElementById(day + "List");
    dayList.innerHTML = "";

    plannerItems
      .filter((item) => item.day === day)
      .forEach((item) => {
        const course = getCourseByCode(item.courseCode);
        const li = document.createElement("li");
        li.className = "planner-item";
        li.innerHTML = `
          <strong>${item.title}</strong>
          <span>${item.time}</span><br>
          <span class="meta">${course ? course.code + " - " + course.name : "No course"}</span>
        `;

        li.addEventListener("click", () => {
          const realIndex = plannerItems.findIndex(
            (plannerItem) =>
              plannerItem.day === item.day &&
              plannerItem.title === item.title &&
              plannerItem.time === item.time &&
              plannerItem.courseCode === item.courseCode
          );

          if (realIndex !== -1) {
            plannerItems.splice(realIndex, 1);
            saveData();
            renderPlanner();
          }
        });

        dayList.appendChild(li);
      });
  });
}

function renderAll() {
  renderCourseOptions();
  renderCourses();
  renderTasks();
  renderExams();
  renderNotes();
  renderPlanner();
}

addCourseBtn.addEventListener("click", () => {
  const name = courseNameInput.value.trim();
  const code = courseCodeInput.value.trim();
  const color = courseColorInput.value;

  if (!name || !code) return;

  courses.push({ name, code, color });
  courseNameInput.value = "";
  courseCodeInput.value = "";
  courseColorInput.value = "#2563eb";
  saveData();
  renderAll();
});

addTaskBtn.addEventListener("click", () => {
  const courseCode = taskCourseInput.value;
  const text = taskInput.value.trim();
  const dueDate = taskDueDateInput.value;
  const status = taskStatusInput.value;
  const priority = taskPriorityInput.value;

  if (!courseCode || !text || !dueDate) return;

  tasks.push({ courseCode, text, dueDate, status, priority });
  taskCourseInput.value = "";
  taskInput.value = "";
  taskDueDateInput.value = "";
  taskStatusInput.value = "To do";
  taskPriorityInput.value = "High";
  saveData();
  renderTasks();
});

if (taskSortInput) {
  taskSortInput.addEventListener("change", () => {
    renderTasks();
  });
}

addExamBtn.addEventListener("click", () => {
  const courseCode = examCourseInput.value;
  const name = examInput.value.trim();
  const date = examDateInput.value;

  if (!courseCode || !name || !date) return;

  exams.push({ courseCode, name, date });
  examCourseInput.value = "";
  examInput.value = "";
  examDateInput.value = "";
  saveData();
  renderExams();
});

addNoteBtn.addEventListener("click", () => {
  const courseCode = noteCourseInput.value;
  const title = noteTitleInput.value.trim();
  const text = noteTextInput.value.trim();

  if (!courseCode || !title || !text) return;

  notes.push({ courseCode, title, text });
  noteCourseInput.value = "";
  noteTitleInput.value = "";
  noteTextInput.value = "";
  saveData();
  renderNotes();
});

addPlannerBtn.addEventListener("click", () => {
  const day = plannerDayInput.value;
  const courseCode = plannerCourseInput.value;
  const title = plannerTitleInput.value.trim();
  const time = plannerTimeInput.value.trim();

  if (!day || !courseCode || !title || !time) return;

  plannerItems.push({ day, courseCode, title, time });
  plannerDayInput.value = "";
  plannerCourseInput.value = "";
  plannerTitleInput.value = "";
  plannerTimeInput.value = "";
  saveData();
  renderPlanner();
});

renderAll();
