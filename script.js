document.addEventListener("DOMContentLoaded", function () {
  const SUPABASE_URL = "https://fdijdgvsqfzgzzwlvqff.supabase.co";
  const SUPABASE_KEY = "sb_publishable_qkCIilGuoTE3FgWWzeqKLw_4R9ERznE";
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  function $(id) {
    return document.getElementById(id);
  }

  const STORAGE_KEYS = {
    tasks: "academia_tasks",
    courses: "academia_courses",
    notes: "academia_notes",
    exams: "academia_exams"
  };

  let currentUser = null;
  let tasks = [];
  let courses = [];
  let notes = [];
  let exams = [];
  let currentCalendarDate = new Date();
  let currentCalendarView = "month";
  let editingTaskId = null;
  let editingCourseId = null;
  let editingNoteId = null;
  let editingExamId = null;
  let userPickedCalendarView = false;

  const mobileQuery = window.matchMedia("(max-width: 640px)");

  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  const openModalButtons = document.querySelectorAll(".open-modal-btn");
  const closeModalButtons = document.querySelectorAll(".close-modal-btn");

  const pageTitle = $("pageTitle");

  const totalTasksEl = $("totalTasks");
  const totalCoursesEl = $("totalCourses");
  const totalNotesEl = $("totalNotes");
  const totalExamsEl = $("totalExams");

  const plannerList = $("plannerList");
  const coursesList = $("coursesList");
  const notesList = $("notesList");
  const examsList = $("examsList");

  const dashboardToday = $("dashboardToday");
  const dashboardTomorrow = $("dashboardTomorrow");
  const dashboardExams = $("dashboardExams");
  const dashboardNotes = $("dashboardNotes");

  const authSignedOut = $("authSignedOut");
  const authSignedIn = $("authSignedIn");
  const authEmail = $("authEmail");
  const authPassword = $("authPassword");
  const authMessage = $("authMessage");
  const currentUserEmail = $("currentUserEmail");
  const signUpBtn = $("signUpBtn");
  const signInBtn = $("signInBtn");
  const signOutBtn = $("signOutBtn");

  const taskTitleInput = $("taskTitle");
  const taskDetailsInput = $("taskDetails");
  const taskDateInput = $("taskDate");
  const taskPriorityInput = $("taskPriority");
  const taskStatusInput = $("taskStatus");
  const addTaskBtn = $("addTaskBtn");

  const courseTitleInput = $("courseTitle");
  const courseCodeInput = $("courseCode");
  const courseInstructorInput = $("courseInstructor");
  const courseDetailsInput = $("courseDetails");
  const saveCourseBtn = $("saveCourseBtn");

  const noteTitleInput = $("noteTitle");
  const noteCourseInput = $("noteCourse");
  const noteContentInput = $("noteContent");
  const saveNoteBtn = $("saveNoteBtn");

  const examTitleInput = $("examTitle");
  const examCourseInput = $("examCourse");
  const examDateInput = $("examDate");
  const examTimeInput = $("examTime");
  const examPlaceInput = $("examPlace");
  const examSeatNumberInput = $("examSeatNumber");
  const examGradeInput = $("examGrade");
  const examMarkInput = $("examMark");
  const examNotesInput = $("examNotes");
  const saveExamBtn = $("saveExamBtn");

  const monthViewBtn = $("monthViewBtn");
  const weekViewBtn = $("weekViewBtn");
  const dayViewBtn = $("dayViewBtn");
  const prevPeriodBtn = $("prevPeriodBtn");
  const nextPeriodBtn = $("nextPeriodBtn");
  const calendarMonthLabel = $("calendarMonthLabel");
  const calendarGrid = $("calendarGrid");
  const weekCalendarGrid = $("weekCalendarGrid");
  const dayCalendarGrid = $("dayCalendarGrid");
  const monthCalendarWrap = $("monthCalendarWrap");
  const weekCalendarWrap = $("weekCalendarWrap");
  const dayCalendarWrap = $("dayCalendarWrap");

  const detailTitle = $("detailTitle");
  const detailBody = $("detailBody");

  function isOnline() {
    return navigator.onLine;
  }

  function getOfflineArray(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_error) {
      return [];
    }
  }

  function setOfflineArray(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getCurrentStore(type) {
    return getOfflineArray(STORAGE_KEYS[type]);
  }

  function setCurrentStore(type, value) {
    setOfflineArray(STORAGE_KEYS[type], value);
  }

  function generateId(prefix) {
    return prefix + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  }

  function showAuthMessage(message, isError) {
    authMessage.textContent = message;
    authMessage.style.color = isError ? "#b91c1c" : "#0f766e";
  }

  function setAuthUI(user) {
    currentUser = user || null;

    if (currentUser) {
      authSignedOut.classList.add("hidden");
      authSignedIn.classList.remove("hidden");
      currentUserEmail.textContent = currentUser.email || "";
    } else {
      authSignedOut.classList.remove("hidden");
      authSignedIn.classList.add("hidden");
      currentUserEmail.textContent = "";
    }
  }

  async function signUp() {
    if (!isOnline()) {
      showAuthMessage("You are offline. Connect to the internet to sign up.", true);
      return;
    }

    const email = authEmail.value.trim();
    const password = authPassword.value.trim();

    if (!email || !password) {
      showAuthMessage("Enter email and password first.", true);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://bocotambt.github.io/Academia/"
      }
    });

    if (error) {
      showAuthMessage(error.message, true);
      return;
    }

    showAuthMessage("Sign-up submitted. Check your email if confirmation is still enabled.", false);
  }

  async function signIn() {
    if (!isOnline()) {
      showAuthMessage("Offline mode active. You can still use saved browser data on this device.", true);
      return;
    }

    const email = authEmail.value.trim();
    const password = authPassword.value.trim();

    if (!email || !password) {
      showAuthMessage("Enter email and password first.", true);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      showAuthMessage(error.message, true);
      return;
    }

    showAuthMessage("Signed in.", false);
  }

  async function signOut() {
    if (isOnline()) {
      await supabase.auth.signOut();
    }

    setAuthUI(null);
    loadLocalData();
    renderAll();
    showAuthMessage("Signed out.", false);
  }

  async function getCurrentUser() {
    if (!isOnline()) return null;
    const { data } = await supabase.auth.getUser();
    return data.user || null;
  }

  function loadLocalData() {
    tasks = getCurrentStore("tasks");
    courses = getCurrentStore("courses");
    notes = getCurrentStore("notes");
    exams = getCurrentStore("exams");
  }

  function saveAllLocal() {
    setCurrentStore("tasks", tasks);
    setCurrentStore("courses", courses);
    setCurrentStore("notes", notes);
    setCurrentStore("exams", exams);
  }

  function isPastDate(dateString) {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const itemDate = new Date(dateString + "T00:00:00");
    return itemDate < today;
  }

  function isPastExam(exam) {
    if (!exam.date) return false;
    const examTime = exam.time ? exam.time : "23:59";
    const examDateTime = new Date(exam.date + "T" + examTime + ":00");
    return examDateTime < new Date();
  }

  function getRecommendedCalendarView() {
    return mobileQuery.matches ? "week" : "month";
  }

  function applyResponsiveCalendarDefault(force) {
    if (force || !userPickedCalendarView) {
      setCalendarView(getRecommendedCalendarView(), false);
    }
  }

  function resetTaskModal() {
    taskTitleInput.value = "";
    taskDetailsInput.value = "";
    taskDateInput.value = "";
    taskPriorityInput.value = "High";
    taskStatusInput.value = "To Do";
    editingTaskId = null;
  }

  function resetCourseModal() {
    courseTitleInput.value = "";
    courseCodeInput.value = "";
    courseInstructorInput.value = "";
    courseDetailsInput.value = "";
    editingCourseId = null;
  }

  function resetNoteModal() {
    noteTitleInput.value = "";
    noteCourseInput.value = "";
    noteContentInput.value = "";
    editingNoteId = null;
  }

  function resetExamModal() {
    examTitleInput.value = "";
    examCourseInput.value = "";
    examDateInput.value = "";
    examTimeInput.value = "";
    examPlaceInput.value = "";
    examSeatNumberInput.value = "";
    examGradeInput.value = "";
    examMarkInput.value = "";
    examNotesInput.value = "";
    editingExamId = null;
  }

  function openModal(id) {
    const modal = $(id);
    if (!modal) return;
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeModal(id) {
    const modal = $(id);
    if (!modal) return;
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  openModalButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const modalId = btn.dataset.openModal;
      if (modalId === "taskModal") resetTaskModal();
      if (modalId === "courseModal") resetCourseModal();
      if (modalId === "noteModal") resetNoteModal();
      if (modalId === "examModal") resetExamModal();
      openModal(modalId);
    });
  });

  closeModalButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      closeModal(btn.dataset.closeModal);
    });
  });

  document.querySelectorAll(".modal").forEach(function (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.classList.add("hidden");
        document.body.style.overflow = "";
      }
    });
  });

  function showTab(tabId) {
    tabButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    tabContents.forEach(function (content) {
      content.classList.remove("active");
    });

    const activeBtn = document.querySelector('.tab-btn[data-tab="' + tabId + '"]');
    const activeTab = $(tabId);

    if (activeBtn) activeBtn.classList.add("active");
    if (activeTab) activeTab.classList.add("active");

    const titles = {
      dashboard: "Dashboard",
      planner: "Tasks",
      courses: "Courses",
      notes: "Notes",
      exams: "Exams",
      calendar: "Calendar"
    };

    pageTitle.textContent = titles[tabId] || "Academia";

    if (tabId === "calendar") renderCalendar();
  }

  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      showTab(button.dataset.tab);
    });
  });

  function updateCounts() {
    totalTasksEl.textContent = tasks.length;
    totalCoursesEl.textContent = courses.length;
    totalNotesEl.textContent = notes.length;
    totalExamsEl.textContent = exams.length;
  }

  function showDetailModal(title, items) {
    detailTitle.textContent = title;
    detailBody.innerHTML = items.map(function (pair) {
      return `
        <div class="detail-item">
          <span class="detail-label">${pair[0]}</span>
          <div>${pair[1]}</div>
        </div>
      `;
    }).join("");
    openModal("detailModal");
  }

  function renderTasks() {
    plannerList.innerHTML = "";

    if (tasks.length === 0) {
      plannerList.innerHTML = '<div class="empty-state">No tasks added yet.</div>';
      return;
    }

    tasks.forEach(function (task) {
      const card = document.createElement("div");
      const isDone = task.status === "Done";
      const isPast = isPastDate(task.date);

      card.className = "day-card";
      if (isDone) card.classList.add("task-done-card");
      if (isPast) card.classList.add("past-item");

      const priorityClass =
        task.priority === "High" ? "priority-high" :
        task.priority === "Medium" ? "priority-medium" :
        "priority-low";

      const statusClass =
        task.status === "To Do" ? "status-todo" :
        task.status === "In Progress" ? "status-progress" :
        "status-done";

      card.innerHTML = `
        <h3 class="task-title ${isDone ? "task-done-title" : ""}">${task.title}</h3>
        <span class="priority-badge ${priorityClass}">${task.priority}</span>
        <span class="status-badge ${statusClass}">${task.status}</span>
        <p class="meta">Due: ${task.date || "Not set"}</p>
        <p class="meta">${task.details || "No details added."}</p>
        <div class="card-actions">
          <button class="view-btn" data-view-task="${task.id}" type="button">View</button>
          <button class="edit-btn" data-edit-task="${task.id}" type="button">Edit</button>
          <button class="delete-btn" data-delete-task="${task.id}" type="button">Delete</button>
        </div>
      `;
      plannerList.appendChild(card);
    });
  }

  function renderCourses() {
    coursesList.innerHTML = "";

    if (courses.length === 0) {
      coursesList.innerHTML = '<div class="empty-state">No courses added yet.</div>';
      return;
    }

    courses.forEach(function (course) {
      const card = document.createElement("div");
      card.className = "day-card";
      card.innerHTML = `
        <h3 class="task-title">${course.title}</h3>
        <span class="course-badge">${course.code || "Course"}</span>
        <p class="meta">Instructor: ${course.instructor || "Not set"}</p>
        <p class="meta">${course.details || "No details added."}</p>
        <div class="card-actions">
          <button class="view-btn" data-view-course="${course.id}" type="button">View</button>
          <button class="edit-btn" data-edit-course="${course.id}" type="button">Edit</button>
          <button class="delete-btn" data-delete-course="${course.id}" type="button">Delete</button>
        </div>
      `;
      coursesList.appendChild(card);
    });
  }

  function renderNotes() {
    notesList.innerHTML = "";

    if (notes.length === 0) {
      notesList.innerHTML = '<div class="empty-state">No notes added yet.</div>';
      return;
    }

    notes.forEach(function (note) {
      const card = document.createElement("div");
      card.className = "day-card";
      card.innerHTML = `
        <h3 class="task-title">${note.title}</h3>
        <span class="note-badge">${note.course || "General Note"}</span>
        <p class="meta">${note.content || "No content added."}</p>
        <div class="card-actions">
          <button class="view-btn" data-view-note="${note.id}" type="button">View</button>
          <button class="edit-btn" data-edit-note="${note.id}" type="button">Edit</button>
          <button class="delete-btn" data-delete-note="${note.id}" type="button">Delete</button>
        </div>
      `;
      notesList.appendChild(card);
    });
  }

  function renderExams() {
    examsList.innerHTML = "";

    if (exams.length === 0) {
      examsList.innerHTML = '<div class="empty-state">No exams added yet.</div>';
      return;
    }

    exams.forEach(function (exam) {
      const card = document.createElement("div");
      const isPast = isPastExam(exam);

      card.className = "day-card";
      if (isPast) card.classList.add("past-item");

      card.innerHTML = `
        <h3 class="task-title">${exam.title}</h3>
        <span class="status-badge status-progress">${exam.course || "Exam"}</span>
        ${exam.grade ? `<span class="priority-badge priority-low">Grade: ${exam.grade}</span>` : ""}
        ${exam.mark !== "" && exam.mark !== null ? `<span class="priority-badge priority-medium">Mark: ${exam.mark}</span>` : ""}
        <p class="meta">Date: ${exam.date || "Not set"}</p>
        <p class="meta">Time: ${exam.time || "Not set"}</p>
        <p class="meta">Place: ${exam.place || "Not set"}</p>
        <p class="meta">Seat: ${exam.seatNumber || "Not set"}</p>
        <p class="meta">${exam.notes || "No revision notes added."}</p>
        <div class="card-actions">
          <button class="view-btn" data-view-exam="${exam.id}" type="button">View</button>
          <button class="edit-btn" data-edit-exam="${exam.id}" type="button">Edit</button>
          <button class="delete-btn" data-delete-exam="${exam.id}" type="button">Delete</button>
        </div>
      `;
      examsList.appendChild(card);
    });
  }

  function pad(num) {
    return String(num).padStart(2, "0");
  }

  function formatDateKey(date) {
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }

  function formatDateLabel(dateString) {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  function getItemsForDate(dateKey) {
    const taskItems = tasks
      .filter(function (task) {
        return task.date === dateKey;
      })
      .map(function (task) {
        return {
          type: "task",
          id: task.id,
          title: "Task: " + task.title,
          timeLabel: task.status === "Done" ? "Done" : "All day",
          isPast: isPastDate(task.date) || task.status === "Done"
        };
      });

    const examItems = exams
      .filter(function (exam) {
        return exam.date === dateKey;
      })
      .map(function (exam) {
        return {
          type: "exam",
          id: exam.id,
          title: "Exam: " + exam.title,
          timeLabel: exam.time || "Time not set",
          isPast: isPastExam(exam)
        };
      });

    const noteItems = notes
      .filter(function (note) {
        return note.date === dateKey;
      })
      .map(function (note) {
        return {
          type: "note",
          id: note.id,
          title: "Note: " + note.title,
          timeLabel: "Note",
          isPast: false
        };
      });

    return taskItems.concat(examItems, noteItems);
  }

  function renderMonthView() {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    calendarMonthLabel.textContent = currentCalendarDate.toLocaleString("en-US", {
      month: "long",
      year: "numeric"
    });

    calendarGrid.innerHTML = "";

    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const todayKey = formatDateKey(new Date());

    for (let i = 0; i < 42; i++) {
      const cell = document.createElement("div");
      cell.className = "calendar-cell";

      let displayDay;
      let displayMonth = month;
      let displayYear = year;
      let isOtherMonth = false;

      if (i < startWeekday) {
        displayDay = prevMonthDays - startWeekday + i + 1;
        displayMonth = month - 1;
        if (displayMonth < 0) {
          displayMonth = 11;
          displayYear = year - 1;
        }
        isOtherMonth = true;
      } else if (i >= startWeekday + daysInMonth) {
        displayDay = i - (startWeekday + daysInMonth) + 1;
        displayMonth = month + 1;
        if (displayMonth > 11) {
          displayMonth = 0;
          displayYear = year + 1;
        }
        isOtherMonth = true;
      } else {
        displayDay = i - startWeekday + 1;
      }

      const cellDate = new Date(displayYear, displayMonth, displayDay);
      const cellKey = formatDateKey(cellDate);

      if (isOtherMonth) cell.classList.add("other-month");
      if (cellKey === todayKey) cell.classList.add("today");

      const dayItems = getItemsForDate(cellKey);
      const itemsHtml = dayItems.map(function (item) {
        return `
          <button
            type="button"
            class="calendar-item ${item.type}"
            title="${item.title}"
            style="opacity:${item.isPast ? "0.55" : "1"};"
          >
            <span>${item.title}</span>
            <small>${item.timeLabel}</small>
          </button>
        `;
      }).join("");

      cell.innerHTML = `
        <div class="calendar-date">${displayDay}</div>
        <div class="calendar-items">${itemsHtml}</div>
      `;

      calendarGrid.appendChild(cell);
    }
  }

  function getStartOfWeek(date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    result.setDate(result.getDate() - result.getDay());
    return result;
  }

  function renderWeekView() {
    const start = getStartOfWeek(currentCalendarDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    calendarMonthLabel.textContent =
      formatDateLabel(formatDateKey(start)) + " - " + formatDateLabel(formatDateKey(end));

    weekCalendarGrid.innerHTML = "";

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(start);
      dayDate.setDate(start.getDate() + i);
      const dateKey = formatDateKey(dayDate);
      const items = getItemsForDate(dateKey);

      const column = document.createElement("div");
      column.className = "week-day-column";

      const itemsHtml = items.length === 0
        ? '<div class="empty-state">No items</div>'
        : items.map(function (item) {
            return `
              <button type="button" class="calendar-item ${item.type}" style="opacity:${item.isPast ? "0.55" : "1"};">
                <span>${item.timeLabel} • ${item.title}</span>
              </button>
            `;
          }).join("");

      column.innerHTML = `
        <div class="week-day-title">
          ${dayDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </div>
        <div class="week-items">${itemsHtml}</div>
      `;

      weekCalendarGrid.appendChild(column);
    }
  }

  function renderDayView() {
    const dateKey = formatDateKey(currentCalendarDate);
    const items = getItemsForDate(dateKey);

    const label = currentCalendarDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });

    calendarMonthLabel.textContent = label;

    const itemsHtml = items.length === 0
      ? '<div class="empty-state">No items for this day.</div>'
      : items.map(function (item) {
          return `
            <button type="button" class="calendar-item ${item.type}" style="opacity:${item.isPast ? "0.55" : "1"};">
              <span>${item.timeLabel} • ${item.title}</span>
            </button>
          `;
        }).join("");

    dayCalendarGrid.innerHTML = `
      <div class="day-view-card">
        <div class="day-view-title">${label}</div>
        <div class="day-items">${itemsHtml}</div>
      </div>
    `;
  }

  function setCalendarView(view, rememberChoice) {
    currentCalendarView = view;

    if (rememberChoice !== false) {
      userPickedCalendarView = true;
    }

    monthViewBtn.classList.remove("active-view-btn");
    weekViewBtn.classList.remove("active-view-btn");
    dayViewBtn.classList.remove("active-view-btn");

    monthCalendarWrap.classList.add("hidden");
    weekCalendarWrap.classList.add("hidden");
    dayCalendarWrap.classList.add("hidden");

    if (view === "month") {
      monthViewBtn.classList.add("active-view-btn");
      monthCalendarWrap.classList.remove("hidden");
    } else if (view === "week") {
      weekViewBtn.classList.add("active-view-btn");
      weekCalendarWrap.classList.remove("hidden");
    } else {
      dayViewBtn.classList.add("active-view-btn");
      dayCalendarWrap.classList.remove("hidden");
    }

    renderCalendar();
  }

  function renderCalendar() {
    if (currentCalendarView === "month") renderMonthView();
    else if (currentCalendarView === "week") renderWeekView();
    else renderDayView();
  }

  function moveCalendar(direction) {
    if (currentCalendarView === "month") {
      currentCalendarDate = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + direction, 1);
    } else if (currentCalendarView === "week") {
      currentCalendarDate = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), currentCalendarDate.getDate() + (7 * direction));
    } else {
      currentCalendarDate = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), currentCalendarDate.getDate() + direction);
    }

    renderCalendar();
  }

  function renderDashboard() {
    const todayKey = formatDateKey(new Date());
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowKey = formatDateKey(tomorrow);

    const todayItems = getItemsForDate(todayKey);
    const tomorrowItems = getItemsForDate(tomorrowKey);
    const upcomingExams = exams
      .slice()
      .sort(function (a, b) {
        return (a.date || "").localeCompare(b.date || "");
      })
      .slice(0, 5);
    const recentNotes = notes.slice(-5).reverse();

    dashboardToday.innerHTML = todayItems.length
      ? todayItems.map(function (item) {
          return `<div class="detail-item"><strong>${item.title}</strong><div class="meta">${item.timeLabel}</div></div>`;
        }).join("")
      : '<div class="empty-state">No items for today.</div>';

    dashboardTomorrow.innerHTML = tomorrowItems.length
      ? tomorrowItems.map(function (item) {
          return `<div class="detail-item"><strong>${item.title}</strong><div class="meta">${item.timeLabel}</div></div>`;
        }).join("")
      : '<div class="empty-state">No items for tomorrow.</div>';

    dashboardExams.innerHTML = upcomingExams.length
      ? upcomingExams.map(function (exam) {
          return `<div class="detail-item"><strong>${exam.title}</strong><div class="meta">${exam.date || "No date"} ${exam.time ? "• " + exam.time : ""}</div></div>`;
        }).join("")
      : '<div class="empty-state">No exams added yet.</div>';

    dashboardNotes.innerHTML = recentNotes.length
      ? recentNotes.map(function (note) {
          return `<div class="detail-item"><strong>${note.title}</strong><div class="meta">${note.course || "General Note"}</div></div>`;
        }).join("")
      : '<div class="empty-state">No notes added yet.</div>';
  }

  function renderAll() {
    updateCounts();
    renderTasks();
    renderCourses();
    renderNotes();
    renderExams();
    renderDashboard();
    renderCalendar();
  }

  function saveTask() {
    const title = taskTitleInput.value.trim();
    const details = taskDetailsInput.value.trim();
    const date = taskDateInput.value;
    const priority = taskPriorityInput.value;
    const status = taskStatusInput.value;

    if (!title) {
      alert("Enter a task title.");
      return;
    }

    if (editingTaskId) {
      const task = tasks.find(function (item) { return item.id === editingTaskId; });
      if (task) {
        task.title = title;
        task.details = details;
        task.date = date;
        task.priority = priority;
        task.status = status;
      }
    } else {
      tasks.push({
        id: generateId("task"),
        title,
        details,
        date,
        priority,
        status
      });
    }

    saveAllLocal();
    renderAll();
    closeModal("taskModal");
    resetTaskModal();
  }

  function saveCourse() {
    const title = courseTitleInput.value.trim();
    const code = courseCodeInput.value.trim();
    const instructor = courseInstructorInput.value.trim();
    const details = courseDetailsInput.value.trim();

    if (!title) {
      alert("Enter a course name.");
      return;
    }

    if (editingCourseId) {
      const course = courses.find(function (item) { return item.id === editingCourseId; });
      if (course) {
        course.title = title;
        course.code = code;
        course.instructor = instructor;
        course.details = details;
      }
    } else {
      courses.push({
        id: generateId("course"),
        title,
        code,
        instructor,
        details
      });
    }

    saveAllLocal();
    renderAll();
    closeModal("courseModal");
    resetCourseModal();
  }

  function saveNote() {
    const title = noteTitleInput.value.trim();
    const course = noteCourseInput.value.trim();
    const content = noteContentInput.value.trim();

    if (!title) {
      alert("Enter a note title.");
      return;
    }

    if (editingNoteId) {
      const note = notes.find(function (item) { return item.id === editingNoteId; });
      if (note) {
        note.title = title;
        note.course = course;
        note.content = content;
      }
    } else {
      notes.push({
        id: generateId("note"),
        title,
        course,
        content,
        date: formatDateKey(new Date())
      });
    }

    saveAllLocal();
    renderAll();
    closeModal("noteModal");
    resetNoteModal();
  }

  function saveExam() {
    const title = examTitleInput.value.trim();
    const course = examCourseInput.value.trim();
    const date = examDateInput.value;
    const time = examTimeInput.value;
    const place = examPlaceInput.value.trim();
    const seatNumber = examSeatNumberInput.value.trim();
    const grade = examGradeInput.value.trim();
    const mark = examMarkInput.value.trim();
    const notesValue = examNotesInput.value.trim();

    if (!title) {
      alert("Enter an exam title.");
      return;
    }

    if (editingExamId) {
      const exam = exams.find(function (item) { return item.id === editingExamId; });
      if (exam) {
        exam.title = title;
        exam.course = course;
        exam.date = date;
        exam.time = time;
        exam.place = place;
        exam.seatNumber = seatNumber;
        exam.grade = grade;
        exam.mark = mark;
        exam.notes = notesValue;
      }
    } else {
      exams.push({
        id: generateId("exam"),
        title,
        course,
        date,
        time,
        place,
        seatNumber,
        grade,
        mark,
        notes: notesValue
      });
    }

    saveAllLocal();
    renderAll();
    closeModal("examModal");
    resetExamModal();
  }

  function attachListHandlers() {
    plannerList.addEventListener("click", function (e) {
      const viewId = e.target.getAttribute("data-view-task");
      const editId = e.target.getAttribute("data-edit-task");
      const deleteId = e.target.getAttribute("data-delete-task");

      if (viewId) {
        const item = tasks.find(function (x) { return x.id === viewId; });
        if (item) {
          showDetailModal(item.title, [
            ["Type", "Task"],
            ["Due Date", item.date || "Not set"],
            ["Priority", item.priority || "Not set"],
            ["Status", item.status || "Not set"],
            ["Details", item.details || "No details added."]
          ]);
        }
      }

      if (editId) {
        const item = tasks.find(function (x) { return x.id === editId; });
        if (item) {
          taskTitleInput.value = item.title || "";
          taskDetailsInput.value = item.details || "";
          taskDateInput.value = item.date || "";
          taskPriorityInput.value = item.priority || "High";
          taskStatusInput.value = item.status || "To Do";
          editingTaskId = item.id;
          openModal("taskModal");
        }
      }

      if (deleteId) {
        tasks = tasks.filter(function (x) { return x.id !== deleteId; });
        saveAllLocal();
        renderAll();
      }
    });

    coursesList.addEventListener("click", function (e) {
      const viewId = e.target.getAttribute("data-view-course");
      const editId = e.target.getAttribute("data-edit-course");
      const deleteId = e.target.getAttribute("data-delete-course");

      if (viewId) {
        const item = courses.find(function (x) { return x.id === viewId; });
        if (item) {
          showDetailModal(item.title, [
            ["Type", "Course"],
            ["Code", item.code || "Not set"],
            ["Instructor", item.instructor || "Not set"],
            ["Details", item.details || "No details added."]
          ]);
        }
      }

      if (editId) {
        const item = courses.find(function (x) { return x.id === editId; });
        if (item) {
          courseTitleInput.value = item.title || "";
          courseCodeInput.value = item.code || "";
          courseInstructorInput.value = item.instructor || "";
          courseDetailsInput.value = item.details || "";
          editingCourseId = item.id;
          openModal("courseModal");
        }
      }

      if (deleteId) {
        courses = courses.filter(function (x) { return x.id !== deleteId; });
        saveAllLocal();
        renderAll();
      }
    });

    notesList.addEventListener("click", function (e) {
      const viewId = e.target.getAttribute("data-view-note");
      const editId = e.target.getAttribute("data-edit-note");
      const deleteId = e.target.getAttribute("data-delete-note");

      if (viewId) {
        const item = notes.find(function (x) { return x.id === viewId; });
        if (item) {
          showDetailModal(item.title, [
            ["Type", "Note"],
            ["Course", item.course || "General Note"],
            ["Content", item.content || "No content added."]
          ]);
        }
      }

      if (editId) {
        const item = notes.find(function (x) { return x.id === editId; });
        if (item) {
          noteTitleInput.value = item.title || "";
          noteCourseInput.value = item.course || "";
          noteContentInput.value = item.content || "";
          editingNoteId = item.id;
          openModal("noteModal");
        }
      }

      if (deleteId) {
        notes = notes.filter(function (x) { return x.id !== deleteId; });
        saveAllLocal();
        renderAll();
      }
    });

    examsList.addEventListener("click", function (e) {
      const viewId = e.target.getAttribute("data-view-exam");
      const editId = e.target.getAttribute("data-edit-exam");
      const deleteId = e.target.getAttribute("data-delete-exam");

      if (viewId) {
        const item = exams.find(function (x) { return x.id === viewId; });
        if (item) {
          showDetailModal(item.title, [
            ["Type", "Exam"],
            ["Course", item.course || "Not set"],
            ["Date", item.date || "Not set"],
            ["Time", item.time || "Not set"],
            ["Place", item.place || "Not set"],
            ["Seat Number", item.seatNumber || "Not set"],
            ["Grade", item.grade || "Not entered"],
            ["Mark", item.mark || "Not entered"],
            ["Notes", item.notes || "No notes added."]
          ]);
        }
      }

      if (editId) {
        const item = exams.find(function (x) { return x.id === editId; });
        if (item) {
          examTitleInput.value = item.title || "";
          examCourseInput.value = item.course || "";
          examDateInput.value = item.date || "";
          examTimeInput.value = item.time || "";
          examPlaceInput.value = item.place || "";
          examSeatNumberInput.value = item.seatNumber || "";
          examGradeInput.value = item.grade || "";
          examMarkInput.value = item.mark || "";
          examNotesInput.value = item.notes || "";
          editingExamId = item.id;
          openModal("examModal");
        }
      }

      if (deleteId) {
        exams = exams.filter(function (x) { return x.id !== deleteId; });
        saveAllLocal();
        renderAll();
      }
    });
  }

  monthViewBtn.addEventListener("click", function () {
    setCalendarView("month", true);
  });

  weekViewBtn.addEventListener("click", function () {
    setCalendarView("week", true);
  });

  dayViewBtn.addEventListener("click", function () {
    setCalendarView("day", true);
  });

  prevPeriodBtn.addEventListener("click", function () {
    moveCalendar(-1);
  });

  nextPeriodBtn.addEventListener("click", function () {
    moveCalendar(1);
  });

  addTaskBtn.addEventListener("click", saveTask);
  saveCourseBtn.addEventListener("click", saveCourse);
  saveNoteBtn.addEventListener("click", saveNote);
  saveExamBtn.addEventListener("click", saveExam);
  signUpBtn.addEventListener("click", signUp);
  signInBtn.addEventListener("click", signIn);
  signOutBtn.addEventListener("click", signOut);

  mobileQuery.addEventListener("change", function () {
    applyResponsiveCalendarDefault(false);
  });

  window.addEventListener("offline", function () {
    showAuthMessage("You are offline. Browser storage mode is active.", true);
    loadLocalData();
    renderAll();
  });

  window.addEventListener("online", function () {
    showAuthMessage("You are back online.", false);
  });

  supabase.auth.onAuthStateChange(function (_event, session) {
    setAuthUI(session ? session.user : null);
  });

  async function init() {
    const user = await getCurrentUser();
    setAuthUI(user);
    loadLocalData();
    applyResponsiveCalendarDefault(true);
    renderAll();
    attachListHandlers();

    if (!user) {
      showAuthMessage("Not signed in. You can still use browser storage on this device.", false);
    }
  }

  init();
});
