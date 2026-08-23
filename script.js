const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function $(id) {
  return document.getElementById(id);
}

const pageTitle = $("pageTitle");
const menuToggleBtn = $("menuToggleBtn");
const tabNav = $("tabNav");
const signOutBtn = $("signOutBtn");

const authSignedOut = $("authSignedOut");
const authSignedIn = $("authSignedIn");
const authEmail = $("authEmail");
const authPassword = $("authPassword");
const signUpBtn = $("signUpBtn");
const signInBtn = $("signInBtn");
const authMessage = $("authMessage");
const authMessageSignedIn = $("authMessageSignedIn");
const brandUserArea = $("brandUserArea");
const brandSignedInText = $("brandSignedInText");

const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

const coursesList = $("coursesList");
const plannerList = $("plannerList");
const notesList = $("notesList");
const examsList = $("examsList");
const academicYearsList = $("academicYearsList");

const dashboardToday = $("dashboardToday");
const dashboardTomorrow = $("dashboardTomorrow");
const dashboardUpcomingTasks = $("dashboardUpcomingTasks");
const dashboardUpcomingExams = $("dashboardUpcomingExams");

const courseNameInput = $("courseName");
const courseCodeInput = $("courseCode");
const courseInstructorInput = $("courseInstructor");
const courseColorInput = $("courseColor");
const courseSemesterInput = $("courseSemester");
const saveCourseBtn = $("saveCourseBtn");

const sessionTypeInput = $("sessionType");
const sessionRepeatInput = $("sessionRepeat");
const sessionDayInput = $("sessionDay");
const sessionDateInput = $("sessionDate");
const sessionStartTimeInput = $("sessionStartTime");
const sessionEndTimeInput = $("sessionEndTime");
const sessionLocationInput = $("sessionLocation");
const addSessionBtn = $("addSessionBtn");
const pendingSessionsList = $("pendingSessionsList");

const taskTitleInput = $("taskTitle");
const taskDetailsInput = $("taskDetails");
const taskCourseInput = $("taskCourse");
const taskDateInput = $("taskDate");
const taskPriorityInput = $("taskPriority");
const taskStatusInput = $("taskStatus");
const addTaskBtn = $("addTaskBtn");

const noteTitleInput = $("noteTitle");
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

const eventTitleInput = $("eventTitle");
const eventDateInput = $("eventDate");
const eventStartTimeInput = $("eventStartTime");
const eventEndTimeInput = $("eventEndTime");
const eventLocationInput = $("eventLocation");
const eventDetailsInput = $("eventDetails");
const saveEventBtn = $("saveEventBtn");

const academicYearNameInput = $("academicYearName");
const saveAcademicYearBtn = $("saveAcademicYearBtn");

const semesterAcademicYearInput = $("semesterAcademicYear");
const semesterNameInput = $("semesterName");
const semesterStartDateInput = $("semesterStartDate");
const semesterEndDateInput = $("semesterEndDate");
const saveSemesterBtn = $("saveSemesterBtn");

const monthViewBtn = $("monthViewBtn");
const weekViewBtn = $("weekViewBtn");
const dayViewBtn = $("dayViewBtn");
const prevPeriodBtn = $("prevPeriodBtn");
const nextPeriodBtn = $("nextPeriodBtn");
const calendarMonthLabel = $("calendarMonthLabel");
const monthCalendarWrap = $("monthCalendarWrap");
const weekCalendarWrap = $("weekCalendarWrap");
const dayCalendarWrap = $("dayCalendarWrap");
const calendarGrid = $("calendarGrid");
const weekCalendarGrid = $("weekCalendarGrid");
const dayCalendarGrid = $("dayCalendarGrid");

let currentUser = null;

let academicYears = [];
let semesters = [];
let courses = [];
let tasks = [];
let notes = [];
let exams = [];
let events = [];

let pendingSessions = [];
let editingCourseId = null;
let currentCalendarView = "month";
let currentCalendarDate = new Date();

function generateId(prefix) {
  return prefix + "-" + Date.now() + "-" + Math.floor(Math.random() * 100000);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function setMessage(el, message, isError) {
  if (!el) return;
  el.textContent = message || "";
  el.style.color = isError ? "#dc2626" : "#0f766e";
}

function formatDate(dateString) {
  if (!dateString) return "No date";
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatTime(timeString) {
  if (!timeString) return "";
  const [hour, minute] = timeString.split(":");
  const date = new Date();
  date.setHours(Number(hour), Number(minute));
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function isSameDate(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function dayNameFromDate(date) {
  return date.toLocaleDateString([], { weekday: "long" });
}

function openModal(modalId) {
  const modal = $(modalId);
  if (modal) modal.classList.remove("hidden");
}

function closeModal(modalId) {
  const modal = $(modalId);
  if (modal) modal.classList.add("hidden");
}

document.querySelectorAll("[data-open-modal]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    openModal(btn.dataset.openModal);
  });
});

document.querySelectorAll("[data-close-modal]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    closeModal(btn.dataset.closeModal);
  });
});

document.querySelectorAll(".modal").forEach(function (modal) {
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.classList.add("hidden");
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
    courses: "Courses",
    planner: "Tasks",
    notes: "Notes",
    exams: "Exams",
    academic: "Academic Settings",
    calendar: "Calendar"
  };

  if (pageTitle) pageTitle.textContent = titles[tabId] || "Academia";

  if (tabId === "calendar") {
    renderCalendar();
  }

  if (window.innerWidth <= 640 && tabNav) {
    tabNav.classList.remove("menu-open");
  }
}

tabButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    showTab(btn.dataset.tab);
  });
});

if (menuToggleBtn) {
  menuToggleBtn.addEventListener("click", function () {
    if (!tabNav) return;
    if (window.innerWidth <= 640) {
      tabNav.classList.toggle("menu-open");
    }
  });
}

function updateAuthUI() {
  const signedIn = !!currentUser;

  if (authSignedOut) authSignedOut.classList.toggle("hidden", signedIn);
  if (authSignedIn) authSignedIn.classList.toggle("hidden", !signedIn);
  if (signOutBtn) signOutBtn.classList.toggle("hidden", !signedIn);
  if (brandUserArea) brandUserArea.classList.toggle("hidden", !signedIn);

  if (currentUser) {
    const email = currentUser.email || "Signed in";
    if (brandSignedInText) brandSignedInText.textContent = `Signed in as ${email}`;
    setMessage(authMessageSignedIn, `Signed in as ${email}`, false);
  } else {
    if (brandSignedInText) brandSignedInText.textContent = "";
    setMessage(authMessageSignedIn, "", false);
  }
}

async function signUp() {
  try {
    const email = authEmail.value.trim();
    const password = authPassword.value.trim();

    if (!email || !password) {
      setMessage(authMessage, "Please enter email and password.", true);
      return;
    }

    const { error } = await supabaseClient.auth.signUp({ email, password });
    if (error) throw error;

    setMessage(authMessage, "Sign-up successful. Check your email if confirmation is enabled.", false);
  } catch (error) {
    setMessage(authMessage, error.message || "Sign-up failed.", true);
  }
}

async function signIn() {
  try {
    const email = authEmail.value.trim();
    const password = authPassword.value.trim();

    if (!email || !password) {
      setMessage(authMessage, "Please enter email and password.", true);
      return;
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;

    currentUser = data.user || null;
    updateAuthUI();
    await loadAllData();
    renderAll();
    setMessage(authMessage, "", false);
  } catch (error) {
    setMessage(authMessage, error.message || "Sign-in failed.", true);
  }
}

async function signOut() {
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;

    currentUser = null;
    academicYears = [];
    semesters = [];
    courses = [];
    tasks = [];
    notes = [];
    exams = [];
    events = [];
    pendingSessions = [];
    updateAuthUI();
    renderAll();
    showTab("dashboard");
  } catch (error) {
    alert(error.message || "Sign-out failed.");
  }
}

if (signUpBtn) signUpBtn.addEventListener("click", signUp);
if (signInBtn) signInBtn.addEventListener("click", signIn);
if (signOutBtn) signOutBtn.addEventListener("click", signOut);

async function getCurrentSession() {
  const { data } = await supabaseClient.auth.getSession();
  currentUser = data.session?.user || null;
  updateAuthUI();

  if (currentUser) {
    await loadAllData();
  }

  renderAll();
}

supabaseClient.auth.onAuthStateChange(async function (_event, session) {
  currentUser = session?.user || null;
  updateAuthUI();

  if (currentUser) {
    await loadAllData();
  } else {
    academicYears = [];
    semesters = [];
    courses = [];
    tasks = [];
    notes = [];
    exams = [];
    events = [];
  }

  renderAll();
});

async function loadTable(tableName) {
  if (!currentUser) return [];

  const { data, error } = await supabaseClient
    .from(tableName)
    .select("*")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

async function loadAllData() {
  if (!currentUser) return;

  academicYears = await loadTable("academic_years");
  semesters = await loadTable("semesters");
  courses = await loadTable("courses");
  tasks = await loadTable("tasks");
  notes = await loadTable("notes");
  exams = await loadTable("exams");
  events = await loadTable("events");
}

async function upsertRecord(tableName, payload) {
  if (!currentUser) {
    alert("Please sign in first.");
    return null;
  }

  const record = {
    ...payload,
    user_id: currentUser.id
  };

  const { data, error } = await supabaseClient
    .from(tableName)
    .upsert(record)
    .select()
    .single();

  if (error) {
    alert(error.message || "Save failed.");
    return null;
  }

  return data;
}

function populateSemesterOptions() {
  if (courseSemesterInput) {
    courseSemesterInput.innerHTML = `<option value="">Choose semester</option>`;
    semesters.forEach(function (semester) {
      const option = document.createElement("option");
      option.value = semester.id;
      option.textContent = semester.name;
      courseSemesterInput.appendChild(option);
    });
  }

  if (semesterAcademicYearInput) {
    semesterAcademicYearInput.innerHTML = `<option value="">Choose academic year</option>`;
    academicYears.forEach(function (year) {
      const option = document.createElement("option");
      option.value = year.id;
      option.textContent = year.name;
      semesterAcademicYearInput.appendChild(option);
    });
  }
}

function populateCourseOptions() {
  if (!taskCourseInput) return;

  taskCourseInput.innerHTML = `<option value="">No course</option>`;
  courses.forEach(function (course) {
    const option = document.createElement("option");
    option.value = course.id;
    option.textContent = course.name;
    taskCourseInput.appendChild(option);
  });
}

function resetCourseSessionInputs() {
  if (sessionTypeInput) sessionTypeInput.value = "";
  if (sessionRepeatInput) sessionRepeatInput.value = "";
  if (sessionDayInput) sessionDayInput.value = "";
  if (sessionDateInput) sessionDateInput.value = "";
  if (sessionStartTimeInput) sessionStartTimeInput.value = "";
  if (sessionEndTimeInput) sessionEndTimeInput.value = "";
  if (sessionLocationInput) sessionLocationInput.value = "";
}

function renderPendingSessions() {
  if (!pendingSessionsList) return;

  pendingSessionsList.innerHTML = "";

  if (pendingSessions.length === 0) {
    pendingSessionsList.innerHTML = '<div class="empty-state">No sessions added yet.</div>';
    return;
  }

  pendingSessions.forEach(function (session, index) {
    const item = document.createElement("div");
    item.className = "pending-session-item";
    item.innerHTML = `
      <strong>${escapeHtml(session.sessionType)}</strong>
      <p class="meta">
        ${session.repeatType === "weekly"
          ? `Weekly on ${escapeHtml(session.dayOfWeek)}`
          : `Specific date: ${escapeHtml(session.specificDate)}`}
      </p>
      <p class="meta">${escapeHtml(formatTime(session.startTime))} - ${escapeHtml(formatTime(session.endTime))}</p>
      <p class="meta">${escapeHtml(session.location || "No location")}</p>
      <div class="card-actions">
        <button class="delete-btn" data-remove-session="${index}" type="button">Remove</button>
      </div>
    `;
    pendingSessionsList.appendChild(item);
  });
}

function addPendingSession() {
  const sessionType = sessionTypeInput.value;
  const repeatType = sessionRepeatInput.value;
  const dayOfWeek = sessionDayInput.value;
  const specificDate = sessionDateInput.value;
  const startTime = sessionStartTimeInput.value;
  const endTime = sessionEndTimeInput.value;
  const location = sessionLocationInput.value.trim();

  if (!sessionType || !repeatType || !startTime || !endTime) {
    alert("Please choose session type, repeat rule, start time, and end time.");
    return;
  }

  if (repeatType === "weekly" && !dayOfWeek) {
    alert("Please choose a weekly day.");
    return;
  }

  if (repeatType === "specific" && !specificDate) {
    alert("Please choose a specific date.");
    return;
  }

  pendingSessions.push({
    sessionType,
    repeatType,
    dayOfWeek: repeatType === "weekly" ? dayOfWeek : "",
    specificDate: repeatType === "specific" ? specificDate : "",
    startTime,
    endTime,
    location
  });

  resetCourseSessionInputs();
  renderPendingSessions();
}

if (addSessionBtn) {
  addSessionBtn.addEventListener("click", addPendingSession);
}

function resetCourseModal() {
  if (courseNameInput) courseNameInput.value = "";
  if (courseCodeInput) courseCodeInput.value = "";
  if (courseInstructorInput) courseInstructorInput.value = "";
  if (courseColorInput) courseColorInput.value = "#2563eb";
  if (courseSemesterInput) courseSemesterInput.value = "";
  editingCourseId = null;
  pendingSessions = [];
  renderPendingSessions();
  resetCourseSessionInputs();
  if (saveCourseBtn) saveCourseBtn.textContent = "Save Course";
}

async function saveCourse() {
  const name = courseNameInput.value.trim();
  const code = courseCodeInput.value.trim();
  const instructor = courseInstructorInput.value.trim();
  const color = courseColorInput.value;
  const semester_id = courseSemesterInput.value || null;

  if (!name) {
    alert("Please enter a course name.");
    return;
  }

  const payload = {
    id: editingCourseId || generateId("course"),
    name,
    code,
    instructor,
    color,
    semester_id,
    sessions: pendingSessions
  };

  const saved = await upsertRecord("courses", payload);
  if (!saved) return;

  await loadAllData();
  populateCourseOptions();
  renderAll();
  resetCourseModal();
  closeModal("courseModal");
}

if (saveCourseBtn) {
  saveCourseBtn.addEventListener("click", saveCourse);
}

async function saveTask() {
  const title = taskTitleInput.value.trim();

  if (!title) {
    alert("Please enter a task title.");
    return;
  }

  const payload = {
    id: generateId("task"),
    title,
    details: taskDetailsInput.value.trim(),
    course_id: taskCourseInput.value || null,
    due_date: taskDateInput.value || null,
    priority: taskPriorityInput.value || "",
    status: taskStatusInput.value || "To Do"
  };

  const saved = await upsertRecord("tasks", payload);
  if (!saved) return;

  taskTitleInput.value = "";
  taskDetailsInput.value = "";
  taskCourseInput.value = "";
  taskDateInput.value = "";
  taskPriorityInput.value = "";
  taskStatusInput.value = "";

  await loadAllData();
  renderAll();
  closeModal("taskModal");
}

if (addTaskBtn) addTaskBtn.addEventListener("click", saveTask);

async function saveNote() {
  const title = noteTitleInput.value.trim();

  if (!title) {
    alert("Please enter a note title.");
    return;
  }

  const payload = {
    id: generateId("note"),
    title,
    content: noteContentInput.value.trim()
  };

  const saved = await upsertRecord("notes", payload);
  if (!saved) return;

  noteTitleInput.value = "";
  noteContentInput.value = "";

  await loadAllData();
  renderAll();
  closeModal("noteModal");
}

if (saveNoteBtn) saveNoteBtn.addEventListener("click", saveNote);

async function saveExam() {
  const title = examTitleInput.value.trim();

  if (!title) {
    alert("Please enter an exam title.");
    return;
  }

  const payload = {
    id: generateId("exam"),
    title,
    course_name: examCourseInput.value.trim(),
    date: examDateInput.value || null,
    time: examTimeInput.value || null,
    place: examPlaceInput.value.trim(),
    seat_number: examSeatNumberInput.value.trim(),
    grade: examGradeInput.value.trim(),
    mark: examMarkInput.value ? Number(examMarkInput.value) : null,
    notes: examNotesInput.value.trim()
  };

  const saved = await upsertRecord("exams", payload);
  if (!saved) return;

  examTitleInput.value = "";
  examCourseInput.value = "";
  examDateInput.value = "";
  examTimeInput.value = "";
  examPlaceInput.value = "";
  examSeatNumberInput.value = "";
  examGradeInput.value = "";
  examMarkInput.value = "";
  examNotesInput.value = "";

  await loadAllData();
  renderAll();
  closeModal("examModal");
}

if (saveExamBtn) saveExamBtn.addEventListener("click", saveExam);

async function saveEvent() {
  const title = eventTitleInput.value.trim();

  if (!title) {
    alert("Please enter an event title.");
    return;
  }

  const payload = {
    id: generateId("event"),
    title,
    date: eventDateInput.value || null,
    start_time: eventStartTimeInput.value || null,
    end_time: eventEndTimeInput.value || null,
    location: eventLocationInput.value.trim(),
    details: eventDetailsInput.value.trim()
  };

  const saved = await upsertRecord("events", payload);
  if (!saved) return;

  eventTitleInput.value = "";
  eventDateInput.value = "";
  eventStartTimeInput.value = "";
  eventEndTimeInput.value = "";
  eventLocationInput.value = "";
  eventDetailsInput.value = "";

  await loadAllData();
  renderAll();
  closeModal("eventModal");
}

if (saveEventBtn) saveEventBtn.addEventListener("click", saveEvent);

async function saveAcademicYear() {
  const name = academicYearNameInput.value.trim();

  if (!name) {
    alert("Please enter an academic year.");
    return;
  }

  const saved = await upsertRecord("academic_years", {
    id: generateId("academic-year"),
    name
  });

  if (!saved) return;

  academicYearNameInput.value = "";
  await loadAllData();
  populateSemesterOptions();
  renderAll();
  closeModal("academicYearModal");
}

if (saveAcademicYearBtn) {
  saveAcademicYearBtn.addEventListener("click", saveAcademicYear);
}

async function saveSemester() {
  const academic_year_id = semesterAcademicYearInput.value;
  const name = semesterNameInput.value.trim();
  const start_date = semesterStartDateInput.value || null;
  const end_date = semesterEndDateInput.value || null;

  if (!academic_year_id || !name) {
    alert("Please choose an academic year and enter a semester name.");
    return;
  }

  const saved = await upsertRecord("semesters", {
    id: generateId("semester"),
    academic_year_id,
    name,
    start_date,
    end_date
  });

  if (!saved) return;

  semesterAcademicYearInput.value = "";
  semesterNameInput.value = "";
  semesterStartDateInput.value = "";
  semesterEndDateInput.value = "";

  await loadAllData();
  populateSemesterOptions();
  renderAll();
  closeModal("semesterModal");
}

if (saveSemesterBtn) saveSemesterBtn.addEventListener("click", saveSemester);

function getCourseById(courseId) {
  return courses.find(function (course) {
    return course.id === courseId;
  }) || null;
}

function getSessionsForDate(date) {
  const dateKey = toDateKey(date);
  const dayName = dayNameFromDate(date);

  const items = [];

  courses.forEach(function (course) {
    const sessions = Array.isArray(course.sessions) ? course.sessions : [];

    sessions.forEach(function (session, index) {
      const weeklyMatch = session.repeatType === "weekly" && session.dayOfWeek === dayName;
      const specificMatch = session.repeatType === "specific" && session.specificDate === dateKey;

      if (weeklyMatch || specificMatch) {
        items.push({
          type: "course",
          id: `${course.id}-${index}-${dateKey}`,
          title: `${course.name} - ${session.sessionType}`,
          timeLabel: `${formatTime(session.startTime)} - ${formatTime(session.endTime)}`,
          color: course.color || "#5666dd",
          location: session.location || "",
          courseId: course.id
        });
      }
    });
  });

  return items.sort(function (a, b) {
    return (a.timeLabel || "").localeCompare(b.timeLabel || "");
  });
}

function isPastExam(exam) {
  if (!exam.date) return false;
  const now = new Date();
  const examDateTime = new Date(`${exam.date}T${exam.time || "23:59"}`);
  return examDateTime < now;
}

function getItemsForDate(dateKey) {
  const dateObj = new Date(dateKey + "T00:00:00");
  const courseItems = getSessionsForDate(dateObj);

  const examItems = exams
    .filter(function (exam) {
      return exam.date === dateKey;
    })
    .map(function (exam) {
      return {
        type: "custom",
        id: "exam-" + exam.id,
        title: "Exam: " + exam.title,
        timeLabel: exam.time || "Time not set",
        color: "#0f766e",
        location: exam.place || "",
        isPast: isPastExam(exam)
      };
    });

  const eventItems = events
    .filter(function (event) {
      return event.date === dateKey;
    })
    .map(function (event) {
      return {
        type: "event",
        id: "event-" + event.id,
        title: event.title,
        timeLabel: `${event.start_time || ""}${event.end_time ? " - " + event.end_time : ""}`.trim() || "Time not set",
        color: "#7c3aed",
        location: event.location || ""
      };
    });

  return courseItems.concat(examItems, eventItems);
}

function renderScheduleList(container, items) {
  if (!container) return;

  if (!items.length) {
    container.innerHTML = '<div class="empty-state">Nothing scheduled.</div>';
    return;
  }

  container.innerHTML = items.map(function (item) {
    return `
      <div class="day-card ${item.isPast ? "past-item" : ""}">
        <h4 class="task-title">${escapeHtml(item.title)}</h4>
        <p class="meta">${escapeHtml(item.timeLabel || "")}</p>
        <p class="meta">${escapeHtml(item.location || "")}</p>
      </div>
    `;
  }).join("");
}

function renderDashboard() {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  renderScheduleList(dashboardToday, getItemsForDate(toDateKey(today)));
  renderScheduleList(dashboardTomorrow, getItemsForDate(toDateKey(tomorrow)));

  const upcomingTasks = tasks
    .filter(function (task) {
      return task.status !== "Done";
    })
    .sort(function (a, b) {
      return (a.due_date || "").localeCompare(b.due_date || "");
    })
    .slice(0, 5);

  if (dashboardUpcomingTasks) {
    dashboardUpcomingTasks.innerHTML = upcomingTasks.length
      ? upcomingTasks.map(function (task) {
          return `
            <div class="day-card">
              <h4 class="task-title">${escapeHtml(task.title)}</h4>
              <p class="meta">${escapeHtml(task.due_date ? formatDate(task.due_date) : "No due date")}</p>
            </div>
          `;
        }).join("")
      : '<div class="empty-state">No upcoming tasks.</div>';
  }

  if (dashboardUpcomingExams) {
    dashboardUpcomingExams.innerHTML = exams.length
      ? exams
          .slice()
          .sort(function (a, b) {
            return `${a.date || ""} ${a.time || ""}`.localeCompare(`${b.date || ""} ${b.time || ""}`);
          })
          .slice(0, 5)
          .map(function (exam) {
            return `
              <div class="day-card ${isPastExam(exam) ? "past-item" : ""}">
                <h4 class="task-title">${escapeHtml(exam.title)}</h4>
                <p class="meta">${escapeHtml(exam.date ? formatDate(exam.date) : "No date")}</p>
                <p class="meta">${escapeHtml(exam.time ? formatTime(exam.time) : "No time")}</p>
              </div>
            `;
          })
          .join("")
      : '<div class="empty-state">No upcoming exams.</div>';
  }
}

function renderCourses() {
  if (!coursesList) return;

  if (!courses.length) {
    coursesList.innerHTML = '<div class="empty-state">No courses yet.</div>';
    return;
  }

  coursesList.innerHTML = courses.map(function (course) {
    const sessions = Array.isArray(course.sessions) ? course.sessions : [];

    return `
      <div class="course-card">
        <div class="badge-row">
          <span class="course-badge" style="background:${escapeHtml(course.color || "#5666dd")}">${escapeHtml(course.name)}</span>
        </div>
        <p class="meta">${escapeHtml(course.code || "No code")}</p>
        <p class="meta">${escapeHtml(course.instructor || "No instructor")}</p>
        <div class="task-card-expanded">
          ${
            sessions.length
              ? sessions.map(function (session) {
                  return `
                    <div class="detail-item">
                      <strong>${escapeHtml(session.sessionType)}</strong>
                      <p class="meta">
                        ${session.repeatType === "weekly"
                          ? `Weekly on ${escapeHtml(session.dayOfWeek)}`
                          : `Specific date: ${escapeHtml(session.specificDate)}`}
                      </p>
                      <p class="meta">${escapeHtml(formatTime(session.startTime))} - ${escapeHtml(formatTime(session.endTime))}</p>
                      <p class="meta">${escapeHtml(session.location || "No location")}</p>
                    </div>
                  `;
                }).join("")
              : '<div class="empty-state">No sessions added.</div>'
          }
        </div>
      </div>
    `;
  }).join("");
}

function renderTasks() {
  if (!plannerList) return;

  if (!tasks.length) {
    plannerList.innerHTML = '<div class="empty-state">No tasks yet.</div>';
    return;
  }

  plannerList.innerHTML = tasks.map(function (task) {
    const course = getCourseById(task.course_id);
    const priorityClass =
      task.priority === "High" ? "priority-high" :
      task.priority === "Medium" ? "priority-medium" :
      "priority-low";

    const statusClass =
      task.status === "Done" ? "status-done" :
      task.status === "In Progress" ? "status-progress" :
      "status-todo";

    return `
      <div class="course-card">
        <div class="badge-row">
          <span class="priority-badge ${priorityClass}">${escapeHtml(task.priority || "No priority")}</span>
          <span class="status-badge ${statusClass}">${escapeHtml(task.status || "To Do")}</span>
        </div>
        <h4 class="task-title ${task.status === "Done" ? "task-done-title" : ""}">${escapeHtml(task.title)}</h4>
        <p class="meta">${escapeHtml(task.details || "No details")}</p>
        <p class="meta">Course: ${escapeHtml(course ? course.name : "No course")}</p>
        <p class="meta">Due: ${escapeHtml(task.due_date ? formatDate(task.due_date) : "No due date")}</p>
      </div>
    `;
  }).join("");
}

function renderNotes() {
  if (!notesList) return;

  notesList.innerHTML = notes.length
    ? notes.map(function (note) {
        return `
          <div class="note-card">
            <h4 class="task-title">${escapeHtml(note.title)}</h4>
            <p class="meta">${escapeHtml(note.content || "No content")}</p>
          </div>
        `;
      }).join("")
    : '<div class="empty-state">No notes yet.</div>';
}

function renderExams() {
  if (!examsList) return;

  examsList.innerHTML = exams.length
    ? exams.map(function (exam) {
        return `
          <div class="course-card ${isPastExam(exam) ? "past-item" : ""}">
            <h4 class="task-title">${escapeHtml(exam.title)}</h4>
            <p class="meta">Course: ${escapeHtml(exam.course_name || "No course")}</p>
            <p class="meta">Date: ${escapeHtml(exam.date ? formatDate(exam.date) : "No date")}</p>
            <p class="meta">Time: ${escapeHtml(exam.time ? formatTime(exam.time) : "No time")}</p>
            <p class="meta">Place: ${escapeHtml(exam.place || "No place")}</p>
            <p class="meta">Seat: ${escapeHtml(exam.seat_number || "No seat number")}</p>
            <p class="meta">Grade: ${escapeHtml(exam.grade || "No grade")}</p>
            <p class="meta">Mark: ${escapeHtml(exam.mark ?? "No mark")}</p>
            <p class="meta">Notes: ${escapeHtml(exam.notes || "No notes")}</p>
          </div>
        `;
      }).join("")
    : '<div class="empty-state">No exams yet.</div>';
}

function renderAcademicYears() {
  if (!academicYearsList) return;

  if (!academicYears.length) {
    academicYearsList.innerHTML = '<div class="empty-state">No academic years yet.</div>';
    return;
  }

  academicYearsList.innerHTML = academicYears.map(function (year) {
    const yearSemesters = semesters.filter(function (semester) {
      return semester.academic_year_id === year.id;
    });

    return `
      <div class="academic-card">
        <h4 class="task-title">${escapeHtml(year.name)}</h4>
        <div class="task-card-expanded">
          ${
            yearSemesters.length
              ? yearSemesters.map(function (semester) {
                  return `
                    <div class="semester-box">
                      <strong>${escapeHtml(semester.name)}</strong>
                      <p class="meta">${escapeHtml(semester.start_date ? formatDate(semester.start_date) : "No start")} - ${escapeHtml(semester.end_date ? formatDate(semester.end_date) : "No end")}</p>
                    </div>
                  `;
                }).join("")
              : '<div class="empty-state">No semesters yet.</div>'
          }
        </div>
      </div>
    `;
  }).join("");
}

function buildCalendarItemHtml(item) {
  let itemClass = "event";
  if (item.type === "course") itemClass = "course";
  if (item.type === "custom") itemClass = "exam";
  if (item.type === "event") itemClass = "event";

  return `
    <button class="calendar-item ${itemClass}" type="button">
      <span>${escapeHtml(item.title)}</span>
      <small>${escapeHtml(item.timeLabel || "")}</small>
    </button>
  `;
}

function renderMonthView() {
  if (!calendarGrid || !calendarMonthLabel) return;

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const startDay = firstDay.getDay();
  const startDate = new Date(year, month, 1 - startDay);

  const today = new Date();
  const cells = [];

  for (let i = 0; i < 42; i += 1) {
    const cellDate = new Date(startDate);
    cellDate.setDate(startDate.getDate() + i);

    const key = toDateKey(cellDate);
    const items = getItemsForDate(key);
    const isToday = isSameDate(cellDate, today);
    const isOtherMonth = cellDate.getMonth() !== month;

    cells.push(`
      <div class="calendar-cell ${isToday ? "today" : ""} ${isOtherMonth ? "other-month" : ""}">
        <div class="calendar-date">${cellDate.getDate()}</div>
        <div class="calendar-items">
          ${items.slice(0, 3).map(buildCalendarItemHtml).join("")}
          ${items.length > 3 ? `<div class="meta">+${items.length - 3} more</div>` : ""}
        </div>
      </div>
    `);
  }

  calendarGrid.innerHTML = cells.join("");
  calendarMonthLabel.textContent = currentCalendarDate.toLocaleDateString([], {
    month: "long",
    year: "numeric"
  });
}

function renderWeekView() {
  if (!weekCalendarGrid || !calendarMonthLabel) return;

  const today = new Date(currentCalendarDate);
  const day = today.getDay();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - day);

  const columns = [];

  for (let i = 0; i < 7; i += 1) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    const items = getItemsForDate(toDateKey(date));

    columns.push(`
      <div class="week-day-column">
        <div class="week-day-title">${escapeHtml(
          date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })
        )}</div>
        <div class="week-items">
          ${items.length ? items.map(buildCalendarItemHtml).join("") : '<div class="empty-state">No items</div>'}
        </div>
      </div>
    `);
  }

  weekCalendarGrid.innerHTML = columns.join("");
  calendarMonthLabel.textContent = currentCalendarDate.toLocaleDateString([], {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function renderDayView() {
  if (!dayCalendarGrid || !calendarMonthLabel) return;

  const items = getItemsForDate(toDateKey(currentCalendarDate));

  dayCalendarGrid.innerHTML = `
    <div class="day-view-card">
      <div class="day-view-title">${escapeHtml(
        currentCalendarDate.toLocaleDateString([], {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric"
        })
      )}</div>
      <div class="day-items">
        ${items.length ? items.map(buildCalendarItemHtml).join("") : '<div class="empty-state">No items</div>'}
      </div>
    </div>
  `;

  calendarMonthLabel.textContent = currentCalendarDate.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function setCalendarView(view) {
  currentCalendarView = view;

  if (monthViewBtn) monthViewBtn.classList.toggle("active-view-btn", view === "month");
  if (weekViewBtn) weekViewBtn.classList.toggle("active-view-btn", view === "week");
  if (dayViewBtn) dayViewBtn.classList.toggle("active-view-btn", view === "day");

  if (monthCalendarWrap) monthCalendarWrap.classList.toggle("hidden", view !== "month");
  if (weekCalendarWrap) weekCalendarWrap.classList.toggle("hidden", view !== "week");
  if (dayCalendarWrap) dayCalendarWrap.classList.toggle("hidden", view !== "day");

  renderCalendar();
}

function renderCalendar() {
  if (currentCalendarView === "month") renderMonthView();
  if (currentCalendarView === "week") renderWeekView();
  if (currentCalendarView === "day") renderDayView();
}

if (monthViewBtn) monthViewBtn.addEventListener("click", function () { setCalendarView("month"); });
if (weekViewBtn) weekViewBtn.addEventListener("click", function () { setCalendarView("week"); });
if (dayViewBtn) dayViewBtn.addEventListener("click", function () { setCalendarView("day"); });

if (prevPeriodBtn) {
  prevPeriodBtn.addEventListener("click", function () {
    if (currentCalendarView === "month") currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    if (currentCalendarView === "week") currentCalendarDate.setDate(currentCalendarDate.getDate() - 7);
    if (currentCalendarView === "day") currentCalendarDate.setDate(currentCalendarDate.getDate() - 1);
    currentCalendarDate = new Date(currentCalendarDate);
    renderCalendar();
  });
}

if (nextPeriodBtn) {
  nextPeriodBtn.addEventListener("click", function () {
    if (currentCalendarView === "month") currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    if (currentCalendarView === "week") currentCalendarDate.setDate(currentCalendarDate.getDate() + 7);
    if (currentCalendarView === "day") currentCalendarDate.setDate(currentCalendarDate.getDate() + 1);
    currentCalendarDate = new Date(currentCalendarDate);
    renderCalendar();
  });
}

document.addEventListener("click", function (e) {
  const removeSessionBtn = e.target.closest("[data-remove-session]");
  if (removeSessionBtn) {
    const index = Number(removeSessionBtn.dataset.removeSession);
    pendingSessions.splice(index, 1);
    renderPendingSessions();
  }
});

function renderAll() {
  populateSemesterOptions();
  populateCourseOptions();
  renderPendingSessions();
  renderDashboard();
  renderCourses();
  renderTasks();
  renderNotes();
  renderExams();
  renderAcademicYears();
  renderCalendar();
}

resetCourseModal();
getCurrentSession();
showTab("dashboard");
