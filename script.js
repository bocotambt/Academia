const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(button => {
  button.addEventListener("click", () => {
    const tab = button.dataset.tab;

    tabButtons.forEach(btn => btn.classList.remove("active"));
    tabContents.forEach(content => content.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(tab).classList.add("active");
  });
});

let courses = JSON.parse(localStorage.getItem("courses")) || [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let pendingSessions = [];
let editingCourseId = null;
let editingNoteId = null;
let editingTaskId = null;

const courseNameInput = document.getElementById("courseName");
const courseCodeInput = document.getElementById("courseCode");
const courseInstructorInput = document.getElementById("courseInstructor");
const courseColorInput = document.getElementById("courseColor");

const sessionTypeInput = document.getElementById("sessionType");
const sessionRepeatInput = document.getElementById("sessionRepeat");
const sessionDayInput = document.getElementById("sessionDay");
const sessionDateInput = document.getElementById("sessionDate");
const sessionStartTimeInput = document.getElementById("sessionStartTime");
const sessionEndTimeInput = document.getElementById("sessionEndTime");

const addSessionBtn = document.getElementById("addSessionBtn");
const saveCourseBtn = document.getElementById("saveCourseBtn");
const pendingSessionsList = document.getElementById("pendingSessionsList");
const coursesList = document.getElementById("coursesList");

const noteTitleInput = document.getElementById("noteTitle");
const noteContentInput = document.getElementById("noteContent");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const notesList = document.getElementById("notesList");

const taskTitleInput = document.getElementById("taskTitle");
const taskDateInput = document.getElementById("taskDate");
const taskPriorityInput = document.getElementById("taskPriority");
const taskStatusInput = document.getElementById("taskStatus");
const addTaskBtn = document.getElementById("addTaskBtn");
const plannerList = document.getElementById("plannerList");

const totalCoursesEl = document.getElementById("totalCourses");
const totalTasksEl = document.getElementById("totalTasks");
const upcomingExamsEl = document.getElementById("upcomingExams");

const calendarGrid = document.getElementById("calendarGrid");
const calendarMonthLabel = document.getElementById("calendarMonthLabel");
const prevMonthBtn = document.getElementById("prevMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");

let currentCalendarDate = new Date();

function saveCourses() {
  localStorage.setItem("courses", JSON.stringify(courses));
}

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateDashboard() {
  totalCoursesEl.textContent = courses.length;
  totalTasksEl.textContent = tasks.length;

  const today = new Date();
  const upcomingCount = courses.reduce((count, course) => {
    const specificSessions = (course.sessions || []).filter(session => {
      return session.repeat === "specific" && session.date;
    });

    const futureSessions = specificSessions.filter(session => {
      return new Date(session.date) >= new Date(today.toDateString());
    });

    return count + futureSessions.length;
  }, 0);

  upcomingExamsEl.textContent = upcomingCount;
}

function updateSessionInputs() {
  if (sessionRepeatInput.value === "weekly") {
    sessionDayInput.style.display = "block";
    sessionDateInput.style.display = "none";
    sessionDateInput.value = "";
  } else {
    sessionDayInput.style.display = "none";
    sessionDateInput.style.display = "block";
    sessionDayInput.value = "";
  }
}

function renderPendingSessions() {
  pendingSessionsList.innerHTML = "";

  if (pendingSessions.length === 0) {
    pendingSessionsList.innerHTML = "<li>No sessions added yet.</li>";
    return;
  }

  pendingSessions.forEach((session, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${session.type}</strong><br>
      ${session.repeat === "weekly"
        ? `${session.day} • ${session.startTime} - ${session.endTime} • Weekly`
        : `${session.date} • ${session.startTime} - ${session.endTime} • Specific Date`}
      <br>
      <button class="delete-btn" onclick="removePendingSession(${index})">Remove</button>
    `;
    pendingSessionsList.appendChild(li);
  });
}

function removePendingSession(index) {
  pendingSessions.splice(index, 1);
  renderPendingSessions();
}

window.removePendingSession = removePendingSession;

function clearCourseForm() {
  courseNameInput.value = "";
  courseCodeInput.value = "";
  courseInstructorInput.value = "";
  courseColorInput.value = "#2563eb";

  sessionTypeInput.value = "Lecture";
  sessionRepeatInput.value = "weekly";
  sessionDayInput.value = "";
  sessionDateInput.value = "";
  sessionStartTimeInput.value = "";
  sessionEndTimeInput.value = "";

  pendingSessions = [];
  editingCourseId = null;
  saveCourseBtn.textContent = "Save Course";

  updateSessionInputs();
  renderPendingSessions();
}

function addSession() {
  const type = sessionTypeInput.value;
  const repeat = sessionRepeatInput.value;
  const day = sessionDayInput.value;
  const date = sessionDateInput.value;
  const startTime = sessionStartTimeInput.value;
  const endTime = sessionEndTimeInput.value;

  if (!startTime || !endTime) {
    alert("Please enter both start and end time.");
    return;
  }

  if (repeat === "weekly" && !day) {
    alert("Please choose a day for a weekly session.");
    return;
  }

  if (repeat === "specific" && !date) {
    alert("Please choose a date for a specific-date session.");
    return;
  }

  pendingSessions.push({
    id: Date.now() + Math.random(),
    type,
    repeat,
    day,
    date,
    startTime,
    endTime
  });

  sessionTypeInput.value = "Lecture";
  sessionRepeatInput.value = "weekly";
  sessionDayInput.value = "";
  sessionDateInput.value = "";
  sessionStartTimeInput.value = "";
  sessionEndTimeInput.value = "";

  updateSessionInputs();
  renderPendingSessions();
}

function saveCourse() {
  const name = courseNameInput.value.trim();
  const code = courseCodeInput.value.trim();
  const instructor = courseInstructorInput.value.trim();
  const color = courseColorInput.value;

  if (!name || !code) {
    alert("Please enter both course name and course code.");
    return;
  }

  if (pendingSessions.length === 0) {
    alert("Please add at least one session.");
    return;
  }

  const courseData = {
    id: editingCourseId || Date.now(),
    name,
    code,
    instructor,
    color,
    sessions: [...pendingSessions]
  };

  if (editingCourseId) {
    courses = courses.map(course => course.id === editingCourseId ? courseData : course);
  } else {
    courses.push(courseData);
  }

  saveCourses();
  renderCourses();
  updateDashboard();
  renderCalendar();
  clearCourseForm();
}

function editCourse(id) {
  const course = courses.find(course => course.id === id);
  if (!course) return;

  editingCourseId = id;
  courseNameInput.value = course.name;
  courseCodeInput.value = course.code;
  courseInstructorInput.value = course.instructor;
  courseColorInput.value = course.color;
  pendingSessions = [...(course.sessions || [])];

  saveCourseBtn.textContent = "Update Course";
  renderPendingSessions();
  updateSessionInputs();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteCourse(id) {
  courses = courses.filter(course => course.id !== id);
  saveCourses();
  renderCourses();
  updateDashboard();
  renderCalendar();

  if (editingCourseId === id) {
    clearCourseForm();
  }
}

window.editCourse = editCourse;
window.deleteCourse = deleteCourse;

function renderCourses() {
  coursesList.innerHTML = "";

  if (courses.length === 0) {
    coursesList.innerHTML = "<p>No courses added yet.</p>";
    return;
  }

  courses.forEach(course => {
    const card = document.createElement("div");
    card.className = "course-card";

    let sessionsHtml = "<p>No sessions saved.</p>";

    if (course.sessions && course.sessions.length > 0) {
      sessionsHtml = course.sessions.map(session => `
        <div class="planner-item">
          <span class="course-badge" style="background:${course.color};">${session.type}</span>
          <p class="meta">
            ${session.repeat === "weekly"
              ? `${session.day} • ${session.startTime} - ${session.endTime} • Weekly`
              : `${session.date} • ${session.startTime} - ${session.endTime} • Specific Date`}
          </p>
        </div>
      `).join("");
    }

    card.innerHTML = `
      <h3>${course.name} (${course.code})</h3>
      <p><strong>Instructor:</strong> ${course.instructor || "N/A"}</p>
      <div class="course-badge" style="background:${course.color};">${course.code}</div>
      <div class="course-sessions">
        <h4>Sessions</h4>
        ${sessionsHtml}
      </div>
      <div class="card-actions">
        <button class="edit-btn" onclick="editCourse(${course.id})">Edit</button>
        <button class="delete-btn" onclick="deleteCourse(${course.id})">Delete</button>
      </div>
    `;

    coursesList.appendChild(card);
  });
}

function clearNoteForm() {
  noteTitleInput.value = "";
  noteContentInput.value = "";
  editingNoteId = null;
  saveNoteBtn.textContent = "Save Note";
}

function saveNote() {
  const title = noteTitleInput.value.trim();
  const content = noteContentInput.value.trim();

  if (!title || !content) {
    alert("Please enter both note title and note content.");
    return;
  }

  const noteData = {
    id: editingNoteId || Date.now(),
    title,
    content
  };

  if (editingNoteId) {
    notes = notes.map(note => note.id === editingNoteId ? noteData : note);
  } else {
    notes.push(noteData);
  }

  saveNotes();
  renderNotes();
  clearNoteForm();
}

function editNote(id) {
  const note = notes.find(note => note.id === id);
  if (!note) return;

  editingNoteId = id;
  noteTitleInput.value = note.title;
  noteContentInput.value = note.content;
  saveNoteBtn.textContent = "Update Note";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteNote(id) {
  notes = notes.filter(note => note.id !== id);
  saveNotes();
  renderNotes();

  if (editingNoteId === id) {
    clearNoteForm();
  }
}

window.editNote = editNote;
window.deleteNote = deleteNote;

function renderNotes() {
  notesList.innerHTML = "";

  if (notes.length === 0) {
    notesList.innerHTML = "<p>No notes saved yet.</p>";
    return;
  }

  notes.forEach(note => {
    const card = document.createElement("div");
    card.className = "note-card";
    card.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <div class="card-actions">
        <button class="edit-btn" onclick="editNote(${note.id})">Edit</button>
        <button class="delete-btn" onclick="deleteNote(${note.id})">Delete</button>
      </div>
    `;
    notesList.appendChild(card);
  });
}

function clearTaskForm() {
  taskTitleInput.value = "";
  taskDateInput.value = "";
  taskPriorityInput.value = "High";
  taskStatusInput.value = "To Do";
  editingTaskId = null;
  addTaskBtn.textContent = "Add Task";
}

function addOrUpdateTask() {
  const title = taskTitleInput.value.trim();
  const date = taskDateInput.value;
  const priority = taskPriorityInput.value;
  const status = taskStatusInput.value;

  if (!title || !date) {
    alert("Please enter both task title and due date.");
    return;
  }

  const taskData = {
    id: editingTaskId || Date.now(),
    title,
    date,
    priority,
    status
  };

  if (editingTaskId) {
    tasks = tasks.map(task => task.id === editingTaskId ? taskData : task);
  } else {
    tasks.push(taskData);
  }

  saveTasks();
  renderTasks();
  updateDashboard();
  renderCalendar();
  clearTaskForm();
}

function editTask(id) {
  const task = tasks.find(task => task.id === id);
  if (!task) return;

  editingTaskId = id;
  taskTitleInput.value = task.title;
  taskDateInput.value = task.date;
  taskPriorityInput.value = task.priority;
  taskStatusInput.value = task.status;
  addTaskBtn.textContent = "Update Task";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
  updateDashboard();
  renderCalendar();

  if (editingTaskId === id) {
    clearTaskForm();
  }
}

window.editTask = editTask;
window.deleteTask = deleteTask;

function renderTasks() {
  plannerList.innerHTML = "";

  if (tasks.length === 0) {
    plannerList.innerHTML = "<p>No tasks added yet.</p>";
    return;
  }

  tasks.forEach(task => {
    const card = document.createElement("div");
    card.className = "day-card";

    const priorityClass =
      task.priority === "High" ? "priority-high" :
      task.priority === "Medium" ? "priority-medium" :
      "priority-low";

    const statusClass =
      task.status === "To Do" ? "status-todo" :
      task.status === "Doing" ? "status-doing" :
      "status-done";

    card.innerHTML = `
      <h3>${task.title}</h3>
      <span class="priority-badge ${priorityClass}">${task.priority}</span>
      <span class="status-badge ${statusClass}">${task.status}</span>
      <p class="meta">Due: ${task.date}</p>
      <div class="card-actions">
        <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;

    plannerList.appendChild(card);
  });
}

function getWeeklySessionsForDate(date) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = days[date.getDay()];

  const matches = [];

  courses.forEach(course => {
    (course.sessions || []).forEach(session => {
      if (session.repeat === "weekly" && session.day === dayName) {
        matches.push({
          courseName: course.name,
          courseCode: course.code,
          color: course.color,
          sessionType: session.type,
          startTime: session.startTime,
          endTime: session.endTime
        });
      }
    });
  });

  return matches;
}

function getSpecificSessionsForDate(dateString) {
  const matches = [];

  courses.forEach(course => {
    (course.sessions || []).forEach(session => {
      if (session.repeat === "specific" && session.date === dateString) {
        matches.push({
          courseName: course.name,
          courseCode: course.code,
          color: course.color,
          sessionType: session.type,
          startTime: session.startTime,
          endTime: session.endTime
        });
      }
    });
  });

  return matches;
}

function renderCalendar() {
  calendarGrid.innerHTML = "";

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayIndex = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const monthName = currentCalendarDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric"
  });

  calendarMonthLabel.textContent = monthName;

  for (let i = 0; i < startDayIndex; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-day empty";
    calendarGrid.appendChild(emptyCell);
  }

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  for (let day = 1; day <= totalDays; day++) {
    const currentDate = new Date(year, month, day);
    const dateString = currentDate.toISOString().split("T")[0];

    const dayCell = document.createElement("div");
    dayCell.className = "calendar-day";

    if (dateString === todayString) {
      dayCell.classList.add("today");
    }

    const weeklySessions = getWeeklySessionsForDate(currentDate);
    const specificSessions = getSpecificSessionsForDate(dateString);
    const dayTasks = tasks.filter(task => task.date === dateString);

    let itemsHtml = "";

    weeklySessions.forEach(session => {
      itemsHtml += `
        <span class="calendar-exam">
          ${session.courseCode} ${session.sessionType}<br>
          ${session.startTime}-${session.endTime}
        </span>
      `;
    });

    specificSessions.forEach(session => {
      itemsHtml += `
        <span class="calendar-exam">
          ${session.courseCode} ${session.sessionType}<br>
          ${session.startTime}-${session.endTime}
        </span>
      `;
    });

    dayTasks.forEach(task => {
      itemsHtml += `
        <span class="calendar-task">
          ${task.title}
        </span>
      `;
    });

    dayCell.innerHTML = `
      <div class="calendar-day-number">${day}</div>
      ${itemsHtml}
    `;

    calendarGrid.appendChild(dayCell);
  }
}

function goToPreviousMonth() {
  currentCalendarDate = new Date(
    currentCalendarDate.getFullYear(),
    currentCalendarDate.getMonth() - 1,
    1
  );
  renderCalendar();
}

function goToNextMonth() {
  currentCalendarDate = new Date(
    currentCalendarDate.getFullYear(),
    currentCalendarDate.getMonth() + 1,
    1
  );
  renderCalendar();
}

addSessionBtn.addEventListener("click", addSession);
saveCourseBtn.addEventListener("click", saveCourse);
sessionRepeatInput.addEventListener("change", updateSessionInputs);

saveNoteBtn.addEventListener("click", saveNote);
addTaskBtn.addEventListener("click", addOrUpdateTask);

prevMonthBtn.addEventListener("click", goToPreviousMonth);
nextMonthBtn.addEventListener("click", goToNextMonth);

updateSessionInputs();
renderPendingSessions();
renderCourses();
renderNotes();
renderTasks();
renderCalendar();
updateDashboard();
