const SUPABASE_URL = "https://fdijdgvsqfzgzzwlvqff.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_qkCIilGuoTE3FgWWzeqKLw_4R9ERznE";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function $(id) {
  return document.getElementById(id);
}

const pageTitle = $("pageTitle");
const menuToggleBtn = $("menuToggleBtn");
const tabNav = $("tabNav");
const signOutBtn = $("signOutBtn");

const authSignedOut = $("authSignedOut");
const authEmail = $("authEmail");
const authPassword = $("authPassword");
const signUpBtn = $("signUpBtn");
const signInBtn = $("signInBtn");
const authMessage = $("authMessage");
const brandUserArea = $("brandUserArea");
const brandSignedInText = $("brandSignedInText");

const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

const coursesList = $("coursesList");
const plannerList = $("plannerList");
const notesList = $("notesList");
const examsList = $("examsList");
const holidaysList = $("holidaysList");
const academicYearsList = $("academicYearsList");

const dashboardToday = $("dashboardToday");
const dashboardTomorrow = $("dashboardTomorrow");
const dashboardUpcomingTasks = $("dashboardUpcomingTasks");
const dashboardUpcomingExams = $("dashboardUpcomingExams");

const detailTitle = $("detailTitle");
const detailBody = $("detailBody");

const courseModalTitle = $("courseModalTitle");
const courseNameInput = $("courseName");
const courseCodeInput = $("courseCode");
const courseInstructorInput = $("courseInstructor");
const courseColorInput = $("courseColor");
const courseColorPreview = $("courseColorPreview");
const courseSemesterInput = $("courseSemester");
const saveCourseBtn = $("saveCourseBtn");

const sessionTypeInput = $("sessionType");
const sessionRepeatInput = $("sessionRepeat");
const sessionDayInput = $("sessionDay");
const sessionDateInput = $("sessionDate");
const sessionStartTimeInput = $("sessionStartTime");
const sessionEndTimeInput = $("sessionEndTime");
const sessionLocationInput = $("sessionLocation");
const sessionDayWrap = $("sessionDayWrap");
const sessionDatesWrap = $("sessionDatesWrap");
const addSpecificDateBtn = $("addSpecificDateBtn");
const pendingSpecificDates = $("pendingSpecificDates");
const addSessionBtn = $("addSessionBtn");
const pendingSessionsList = $("pendingSessionsList");

const taskModalTitle = $("taskModalTitle");
const taskTitleInput = $("taskTitle");
const taskDetailsInput = $("taskDetails");
const taskCourseInput = $("taskCourse");
const taskDateInput = $("taskDate");
const taskPriorityInput = $("taskPriority");
const taskStatusInput = $("taskStatus");
const addTaskBtn = $("addTaskBtn");

const noteModalTitle = $("noteModalTitle");
const noteTitleInput = $("noteTitle");
const noteContentInput = $("noteContent");
const saveNoteBtn = $("saveNoteBtn");

const examModalTitle = $("examModalTitle");
const examTitleInput = $("examTitle");
const examCourseInput = $("examCourse");
const examDateInput = $("examDate");
const examTimeInput = $("examTime");
const examDurationInput = $("examDuration");
const examPlaceInput = $("examPlace");
const examSeatNumberInput = $("examSeatNumber");
const examGradeInput = $("examGrade");
const examMarkInput = $("examMark");
const examNotesInput = $("examNotes");
const saveExamBtn = $("saveExamBtn");

const holidayModalTitle = $("holidayModalTitle");
const holidayTitleInput = $("holidayTitle");
const holidayStartDateInput = $("holidayStartDate");
const holidayEndDateInput = $("holidayEndDate");
const holidayTypeInput = $("holidayType");
const saveHolidayBtn = $("saveHolidayBtn");

const eventModalTitle = $("eventModalTitle");
const eventTitleInput = $("eventTitle");
const eventDateInput = $("eventDate");
const eventStartTimeInput = $("eventStartTime");
const eventEndTimeInput = $("eventEndTime");
const eventLocationInput = $("eventLocation");
const eventColorInput = $("eventColor");
const eventColorPreview = $("eventColorPreview");
const eventDetailsInput = $("eventDetails");
const saveEventBtn = $("saveEventBtn");

const academicYearModalTitle = $("academicYearModalTitle");
const academicYearNameInput = $("academicYearName");
const saveAcademicYearBtn = $("saveAcademicYearBtn");

const semesterModalTitle = $("semesterModalTitle");
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
let courseSessions = [];
let tasks = [];
let notes = [];
let exams = [];
let holidays = [];
let events = [];

let pendingSessions = [];
let pendingSpecificDateList = [];
let currentCalendarView = "month";
let currentCalendarDate = new Date();

let editState = {
  courseId: null,
  taskId: null,
  noteId: null,
  examId: null,
  holidayId: null,
  eventId: null,
  academicYearId: null,
  semesterId: null
};

const saveLocks = {
  course: false,
  task: false,
  note: false,
  exam: false,
  holiday: false,
  event: false,
  academicYear: false,
  semester: false
};

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

function formatShortDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString([], {
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

function calculateExamEndTime(startTime, durationMinutes) {
  if (!startTime || !durationMinutes) return "";
  const [hour, minute] = startTime.split(":").map(Number);
  const totalMinutes = hour * 60 + minute + Number(durationMinutes);
  const endHour = Math.floor((totalMinutes % (24 * 60)) / 60);
  const endMinute = totalMinutes % 60;
  return `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
}

function buildHolidayDates(holiday) {
  const start = holiday.start_date || holiday.date;
  const end = holiday.end_date || holiday.start_date || holiday.date;
  if (!start || !end) return [];
  const dates = [];
  const current = new Date(start + "T00:00:00");
  const endDate = new Date(end + "T00:00:00");
  while (current <= endDate) {
    dates.push(toDateKey(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function isHolidayDate(dateKey) {
  return holidays.some(function (holiday) {
    return buildHolidayDates(holiday).includes(dateKey);
  });
}

function getHolidayForDate(dateKey) {
  return holidays.find(function (holiday) {
    return buildHolidayDates(holiday).includes(dateKey);
  }) || null;
}

function openModal(modalId) {
  const modal = $(modalId);
  if (modal) modal.classList.remove("hidden");
}

function closeModal(modalId) {
  const modal = $(modalId);
  if (modal) modal.classList.add("hidden");
}

function updateColorPreview(input, preview) {
  if (!input || !preview) return;
  preview.style.background = input.value || "#2563eb";
}

function lockButton(button, locked, loadingText, defaultText) {
  if (!button) return;
  button.disabled = locked;
  button.textContent = locked ? loadingText : defaultText;
}

function getCourseById(courseId) {
  return courses.find(function (course) {
    return course.id === courseId;
  }) || null;
}

function getCourseByName(courseName) {
  return courses.find(function (course) {
    return course.name === courseName;
  }) || null;
}

function getCourseColorById(courseId) {
  const course = getCourseById(courseId);
  return course?.color || "#5263b2";
}

function getCourseColorByName(courseName) {
  const course = getCourseByName(courseName);
  return course?.color || "#0f766e";
}

function getReadableTextColor(bgColor) {
  if (!bgColor) return "#ffffff";
  const color = bgColor.replace("#", "");
  if (color.length !== 6) return "#ffffff";
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 160 ? "#1f2a44" : "#ffffff";
}

function createCourseChip(course) {
  if (!course) return '<span class="meta">No course</span>';
  const bg = course.color || "#5263b2";
  const fg = getReadableTextColor(bg);
  return `<span class="course-link-chip" style="background:${escapeHtml(bg)};color:${escapeHtml(fg)};">${escapeHtml(course.name)}</span>`;
}

function buildItemMenu(entity, id) {
  return `
    <div class="item-tools">
      <button class="item-menu-btn" type="button" data-menu-toggle="${escapeHtml(entity)}" data-id="${escapeHtml(id)}">✎</button>
      <div class="item-menu" data-menu="${escapeHtml(entity)}" data-id="${escapeHtml(id)}">
        <button type="button" data-edit-type="${escapeHtml(entity)}" data-id="${escapeHtml(id)}">Edit</button>
        <button type="button" class="menu-delete" data-delete-type="${escapeHtml(entity)}" data-id="${escapeHtml(id)}">Delete</button>
      </div>
    </div>
  `;
}

function clearOpenMenus() {
  document.querySelectorAll(".item-menu.show").forEach(function (menu) {
    menu.classList.remove("show");
  });
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
    holidays: "Holidays",
    academic: "Academic Settings",
    calendar: "Calendar"
  };

  if (pageTitle) pageTitle.textContent = titles[tabId] || "Academia";

  if (tabId === "calendar") renderCalendar();

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
  if (signOutBtn) signOutBtn.classList.toggle("hidden", !signedIn);
  if (brandUserArea) brandUserArea.classList.toggle("hidden", !signedIn);

  if (currentUser) {
    const email = currentUser.email || "Signed in";
    if (brandSignedInText) brandSignedInText.textContent = `Signed in as ${email}`;
  } else {
    if (brandSignedInText) brandSignedInText.textContent = "";
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
    courseSessions = [];
    tasks = [];
    notes = [];
    exams = [];
    holidays = [];
    events = [];
    pendingSessions = [];
    pendingSpecificDateList = [];
    resetEditState();
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
    courseSessions = [];
    tasks = [];
    notes = [];
    exams = [];
    holidays = [];
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
    console.error(tableName, error);
    return [];
  }

  return data || [];
}

async function loadAllData() {
  if (!currentUser) return;

  academicYears = await loadTable("academic_years");
  semesters = await loadTable("semesters");
  courses = await loadTable("courses");
  courseSessions = await loadTable("course_sessions");
  tasks = await loadTable("tasks");
  notes = await loadTable("notes");
  exams = await loadTable("exams");
  holidays = await loadTable("holidays");
  events = await loadTable("events");
}

async function insertRecord(tableName, payload) {
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
    .insert(record)
    .select()
    .single();

  if (error) {
    alert(error.message || "Save failed.");
    return null;
  }

  return data;
}

async function updateRecord(tableName, id, payload) {
  if (!currentUser) {
    alert("Please sign in first.");
    return null;
  }

  const { data, error } = await supabaseClient
    .from(tableName)
    .update(payload)
    .eq("id", id)
    .eq("user_id", currentUser.id)
    .select()
    .single();

  if (error) {
    alert(error.message || "Update failed.");
    return null;
  }

  return data;
}

async function deleteRecord(tableName, id) {
  if (!currentUser) {
    alert("Please sign in first.");
    return false;
  }

  const { error } = await supabaseClient
    .from(tableName)
    .delete()
    .eq("id", id)
    .eq("user_id", currentUser.id);

  if (error) {
    alert(error.message || "Delete failed.");
    return false;
  }

  return true;
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
  if (taskCourseInput) {
    taskCourseInput.innerHTML = `<option value="">No course</option>`;
    courses.forEach(function (course) {
      const option = document.createElement("option");
      option.value = course.id;
      option.textContent = course.name;
      taskCourseInput.appendChild(option);
    });
  }

  if (examCourseInput) {
    examCourseInput.innerHTML = `<option value="">No course</option>`;
    courses.forEach(function (course) {
      const option = document.createElement("option");
      option.value = course.name;
      option.textContent = course.name;
      examCourseInput.appendChild(option);
    });
  }
}

function updateSessionRepeatUI() {
  const repeatType = sessionRepeatInput ? sessionRepeatInput.value : "";
  if (sessionDayWrap) sessionDayWrap.classList.toggle("hidden", repeatType !== "weekly");
  if (sessionDatesWrap) sessionDatesWrap.classList.toggle("hidden", repeatType !== "specific");
}

function resetCourseSessionInputs() {
  if (sessionTypeInput) sessionTypeInput.value = "";
  if (sessionRepeatInput) sessionRepeatInput.value = "";
  if (sessionDayInput) sessionDayInput.value = "";
  if (sessionDateInput) sessionDateInput.value = "";
  if (sessionStartTimeInput) sessionStartTimeInput.value = "";
  if (sessionEndTimeInput) sessionEndTimeInput.value = "";
  if (sessionLocationInput) sessionLocationInput.value = "";
  pendingSpecificDateList = [];
  renderPendingSpecificDates();
  updateSessionRepeatUI();
}

function renderPendingSpecificDates() {
  if (!pendingSpecificDates) return;

  if (!pendingSpecificDateList.length) {
    pendingSpecificDates.innerHTML = '<div class="empty-state">No specific dates added yet.</div>';
    return;
  }

  pendingSpecificDates.innerHTML = pendingSpecificDateList.map(function (date, index) {
    return `
      <div class="pending-date-chip">
        <span>${escapeHtml(formatShortDate(date))}</span>
        <button type="button" data-remove-specific-date="${index}">✕</button>
      </div>
    `;
  }).join("");
}

function renderPendingSessions() {
  if (!pendingSessionsList) return;

  pendingSessionsList.innerHTML = "";

  if (pendingSessions.length === 0) {
    pendingSessionsList.innerHTML = '<div class="empty-state">No sessions added yet.</div>';
    return;
  }

  pendingSessions.forEach(function (session, index) {
    const repeatText = session.repeat_type === "weekly"
      ? `Weekly on ${session.day_name}`
      : `Specific dates: ${session.session_dates.map(formatShortDate).join(", ")}`;

    const item = document.createElement("div");
    item.className = "pending-session-item";
    item.innerHTML = `
      <strong>${escapeHtml(session.session_type)}</strong>
      <p class="meta">${escapeHtml(repeatText)}</p>
      <p class="meta">${escapeHtml(formatTime(session.start_time))} - ${escapeHtml(formatTime(session.end_time))}</p>
      <p class="meta">${escapeHtml(session.location || "No location")}</p>
      <div class="card-actions">
        <button class="delete-btn" data-remove-session="${index}" type="button">Remove</button>
      </div>
    `;
    pendingSessionsList.appendChild(item);
  });
}

function addSpecificDate() {
  const date = sessionDateInput.value;
  if (!date) {
    alert("Choose a date first.");
    return;
  }

  if (!pendingSpecificDateList.includes(date)) {
    pendingSpecificDateList.push(date);
    pendingSpecificDateList.sort();
  }

  sessionDateInput.value = "";
  renderPendingSpecificDates();
}

function addPendingSession() {
  const session_type = sessionTypeInput.value;
  const repeat_type = sessionRepeatInput.value;
  const day_name = sessionDayInput.value;
  const start_time = sessionStartTimeInput.value;
  const end_time = sessionEndTimeInput.value;
  const location = sessionLocationInput.value.trim();

  if (!session_type || !repeat_type || !start_time || !end_time) {
    alert("Please choose session type, repeat rule, start time, and end time.");
    return;
  }

  if (repeat_type === "weekly" && !day_name) {
    alert("Please choose a weekly day.");
    return;
  }

  if (repeat_type === "specific" && !pendingSpecificDateList.length) {
    alert("Please add at least one specific date.");
    return;
  }

  pendingSessions.push({
    session_type,
    repeat_type,
    day_name: repeat_type === "weekly" ? day_name : null,
    session_dates: repeat_type === "specific" ? pendingSpecificDateList.slice() : [],
    start_time,
    end_time,
    location
  });

  resetCourseSessionInputs();
  renderPendingSessions();
}

if (sessionRepeatInput) {
  sessionRepeatInput.addEventListener("change", updateSessionRepeatUI);
}
if (addSpecificDateBtn) {
  addSpecificDateBtn.addEventListener("click", addSpecificDate);
}
if (addSessionBtn) {
  addSessionBtn.addEventListener("click", addPendingSession);
}

function resetEditState() {
  editState = {
    courseId: null,
    taskId: null,
    noteId: null,
    examId: null,
    holidayId: null,
    eventId: null,
    academicYearId: null,
    semesterId: null
  };
}

function resetCourseModal() {
  editState.courseId = null;
  if (courseModalTitle) courseModalTitle.textContent = "Add Course";
  if (saveCourseBtn) saveCourseBtn.textContent = "Save Course";
  if (courseNameInput) courseNameInput.value = "";
  if (courseCodeInput) courseCodeInput.value = "";
  if (courseInstructorInput) courseInstructorInput.value = "";
  if (courseColorInput) courseColorInput.value = "#2563eb";
  updateColorPreview(courseColorInput, courseColorPreview);
  if (courseSemesterInput) courseSemesterInput.value = "";
  pendingSessions = [];
  renderPendingSessions();
  resetCourseSessionInputs();
}

function resetTaskModal() {
  editState.taskId = null;
  if (taskModalTitle) taskModalTitle.textContent = "Add Task";
  if (addTaskBtn) addTaskBtn.textContent = "Save Task";
  taskTitleInput.value = "";
  taskDetailsInput.value = "";
  taskCourseInput.value = "";
  taskDateInput.value = "";
  taskPriorityInput.value = "";
  taskStatusInput.value = "To Do";
}

function resetNoteModal() {
  editState.noteId = null;
  if (noteModalTitle) noteModalTitle.textContent = "Add Note";
  if (saveNoteBtn) saveNoteBtn.textContent = "Save Note";
  noteTitleInput.value = "";
  noteContentInput.value = "";
}

function resetExamModal() {
  editState.examId = null;
  if (examModalTitle) examModalTitle.textContent = "Add Exam";
  if (saveExamBtn) saveExamBtn.textContent = "Save Exam";
  examTitleInput.value = "";
  examCourseInput.value = "";
  examDateInput.value = "";
  examTimeInput.value = "";
  examDurationInput.value = "";
  examPlaceInput.value = "";
  examSeatNumberInput.value = "";
  examGradeInput.value = "";
  examMarkInput.value = "";
  examNotesInput.value = "";
}

function resetHolidayModal() {
  editState.holidayId = null;
  if (holidayModalTitle) holidayModalTitle.textContent = "Add Holiday";
  if (saveHolidayBtn) saveHolidayBtn.textContent = "Save Holiday";
  holidayTitleInput.value = "";
  holidayStartDateInput.value = "";
  holidayEndDateInput.value = "";
  holidayTypeInput.value = "";
}

function resetEventModal() {
  editState.eventId = null;
  if (eventModalTitle) eventModalTitle.textContent = "Add Event";
  if (saveEventBtn) saveEventBtn.textContent = "Save Event";
  eventTitleInput.value = "";
  eventDateInput.value = "";
  eventStartTimeInput.value = "";
  eventEndTimeInput.value = "";
  eventLocationInput.value = "";
  if (eventColorInput) eventColorInput.value = "#7c3aed";
  updateColorPreview(eventColorInput, eventColorPreview);
  eventDetailsInput.value = "";
}

function resetAcademicYearModal() {
  editState.academicYearId = null;
  if (academicYearModalTitle) academicYearModalTitle.textContent = "Add Academic Year";
  if (saveAcademicYearBtn) saveAcademicYearBtn.textContent = "Save Academic Year";
  academicYearNameInput.value = "";
}

function resetSemesterModal() {
  editState.semesterId = null;
  if (semesterModalTitle) semesterModalTitle.textContent = "Add Semester";
  if (saveSemesterBtn) saveSemesterBtn.textContent = "Save Semester";
  semesterAcademicYearInput.value = "";
  semesterNameInput.value = "";
  semesterStartDateInput.value = "";
  semesterEndDateInput.value = "";
}

async function saveCourse() {
  if (saveLocks.course) return;
  saveLocks.course = true;
  lockButton(saveCourseBtn, true, "Saving...", editState.courseId ? "Update Course" : "Save Course");

  try {
    const name = courseNameInput.value.trim();
    const code = courseCodeInput.value.trim();
    const instructor = courseInstructorInput.value.trim();
    const color = courseColorInput.value;
    const semester_id = courseSemesterInput.value || null;

    if (!name || !code || !semester_id) {
      alert("Please enter course name, code, and semester.");
      return;
    }

    let savedCourse = null;

    if (editState.courseId) {
      savedCourse = await updateRecord("courses", editState.courseId, {
        name,
        code,
        instructor,
        color,
        semester_id
      });

      if (!savedCourse) return;

      const existingSessions = courseSessions.filter(function (session) {
        return session.course_id === editState.courseId;
      });

      for (const session of existingSessions) {
        await deleteRecord("course_sessions", session.id);
      }

      for (const session of pendingSessions) {
        if (session.repeat_type === "weekly") {
          await insertRecord("course_sessions", {
            course_id: editState.courseId,
            session_type: session.session_type,
            repeat_type: "weekly",
            day_name: session.day_name,
            session_date: null,
            start_time: session.start_time,
            end_time: session.end_time,
            location: session.location
          });
        } else {
          for (const singleDate of session.session_dates) {
            await insertRecord("course_sessions", {
              course_id: editState.courseId,
              session_type: session.session_type,
              repeat_type: "specific",
              day_name: null,
              session_date: singleDate,
              start_time: session.start_time,
              end_time: session.end_time,
              location: session.location
            });
          }
        }
      }
    } else {
      savedCourse = await insertRecord("courses", {
        name,
        code,
        instructor,
        color,
        semester_id
      });

      if (!savedCourse) return;

      for (const session of pendingSessions) {
        if (session.repeat_type === "weekly") {
          await insertRecord("course_sessions", {
            course_id: savedCourse.id,
            session_type: session.session_type,
            repeat_type: "weekly",
            day_name: session.day_name,
            session_date: null,
            start_time: session.start_time,
            end_time: session.end_time,
            location: session.location
          });
        } else {
          for (const singleDate of session.session_dates) {
            await insertRecord("course_sessions", {
              course_id: savedCourse.id,
              session_type: session.session_type,
              repeat_type: "specific",
              day_name: null,
              session_date: singleDate,
              start_time: session.start_time,
              end_time: session.end_time,
              location: session.location
            });
          }
        }
      }
    }

    await loadAllData();
    populateCourseOptions();
    renderAll();
    resetCourseModal();
    closeModal("courseModal");
  } finally {
    saveLocks.course = false;
    lockButton(saveCourseBtn, false, "Saving...", editState.courseId ? "Update Course" : "Save Course");
  }
}

if (saveCourseBtn) {
  saveCourseBtn.addEventListener("click", saveCourse);
}

async function saveTask() {
  if (saveLocks.task) return;
  saveLocks.task = true;
  lockButton(addTaskBtn, true, "Saving...", editState.taskId ? "Update Task" : "Save Task");

  try {
    const title = taskTitleInput.value.trim();
    const due_date = taskDateInput.value || null;

    if (!title || !due_date) {
      alert("Please enter a task title and due date.");
      return;
    }

    const payload = {
      title,
      details: taskDetailsInput.value.trim(),
      course_id: taskCourseInput.value || null,
      due_date,
      priority: taskPriorityInput.value || "High",
      status: taskStatusInput.value || "To Do"
    };

    const saved = editState.taskId
      ? await updateRecord("tasks", editState.taskId, payload)
      : await insertRecord("tasks", payload);

    if (!saved) return;

    await loadAllData();
    renderAll();
    resetTaskModal();
    closeModal("taskModal");
  } finally {
    saveLocks.task = false;
    lockButton(addTaskBtn, false, "Saving...", editState.taskId ? "Update Task" : "Save Task");
  }
}

if (addTaskBtn) addTaskBtn.addEventListener("click", saveTask);

async function saveNote() {
  if (saveLocks.note) return;
  saveLocks.note = true;
  lockButton(saveNoteBtn, true, "Saving...", editState.noteId ? "Update Note" : "Save Note");

  try {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();

    if (!title || !content) {
      alert("Please enter a note title and content.");
      return;
    }

    const payload = { title, content };
    const saved = editState.noteId
      ? await updateRecord("notes", editState.noteId, payload)
      : await insertRecord("notes", payload);

    if (!saved) return;

    await loadAllData();
    renderAll();
    resetNoteModal();
    closeModal("noteModal");
  } finally {
    saveLocks.note = false;
    lockButton(saveNoteBtn, false, "Saving...", editState.noteId ? "Update Note" : "Save Note");
  }
}

if (saveNoteBtn) saveNoteBtn.addEventListener("click", saveNote);

async function saveExam() {
  if (saveLocks.exam) return;
  saveLocks.exam = true;
  lockButton(saveExamBtn, true, "Saving...", editState.examId ? "Update Exam" : "Save Exam");

  try {
    const title = examTitleInput.value.trim();
    const exam_date = examDateInput.value || null;

    if (!title || !exam_date) {
      alert("Please enter an exam title and date.");
      return;
    }

    const payload = {
      title,
      course: examCourseInput.value || null,
      exam_date,
      exam_time: examTimeInput.value || null,
      duration_minutes: examDurationInput.value ? Number(examDurationInput.value) : null,
      place: examPlaceInput.value.trim(),
      seat_number: examSeatNumberInput.value.trim(),
      grade: examGradeInput.value.trim(),
      mark: examMarkInput.value ? Number(examMarkInput.value) : null,
      notes: examNotesInput.value.trim()
    };

    const saved = editState.examId
      ? await updateRecord("exams", editState.examId, payload)
      : await insertRecord("exams", payload);

    if (!saved) return;

    await loadAllData();
    renderAll();
    resetExamModal();
    closeModal("examModal");
  } finally {
    saveLocks.exam = false;
    lockButton(saveExamBtn, false, "Saving...", editState.examId ? "Update Exam" : "Save Exam");
  }
}

if (saveExamBtn) saveExamBtn.addEventListener("click", saveExam);

async function saveHoliday() {
  if (saveLocks.holiday) return;
  saveLocks.holiday = true;
  lockButton(saveHolidayBtn, true, "Saving...", editState.holidayId ? "Update Holiday" : "Save Holiday");

  try {
    const title = holidayTitleInput.value.trim();
    const start_date = holidayStartDateInput.value || null;
    const end_date = holidayEndDateInput.value || null;
    const type = holidayTypeInput.value || "";

    if (!title || !start_date || !end_date) {
      alert("Please enter a holiday name, start date, and end date.");
      return;
    }

    if (end_date < start_date) {
      alert("End date cannot be earlier than start date.");
      return;
    }

    const payload = {
      title,
      date: start_date,
      start_date,
      end_date,
      type
    };

    const saved = editState.holidayId
      ? await updateRecord("holidays", editState.holidayId, payload)
      : await insertRecord("holidays", {
          id: `holiday-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
          ...payload
        });

    if (!saved) return;

    await loadAllData();
    renderAll();
    resetHolidayModal();
    closeModal("holidayModal");
  } finally {
    saveLocks.holiday = false;
    lockButton(saveHolidayBtn, false, "Saving...", editState.holidayId ? "Update Holiday" : "Save Holiday");
  }
}

if (saveHolidayBtn) saveHolidayBtn.addEventListener("click", saveHoliday);

async function saveEvent() {
  if (saveLocks.event) return;
  saveLocks.event = true;
  lockButton(saveEventBtn, true, "Saving...", editState.eventId ? "Update Event" : "Save Event");

  try {
    const title = eventTitleInput.value.trim();
    const event_date = eventDateInput.value || null;
    const start_time = eventStartTimeInput.value || null;
    const end_time = eventEndTimeInput.value || null;

    if (!title || !event_date || !start_time || !end_time) {
      alert("Please enter title, date, start time, and end time.");
      return;
    }

    const payload = {
      title,
      event_date,
      start_time,
      end_time,
      location: eventLocationInput.value.trim(),
      color: eventColorInput.value || "#7c3aed",
      details: eventDetailsInput.value.trim()
    };

    const saved = editState.eventId
      ? await updateRecord("events", editState.eventId, payload)
      : await insertRecord("events", payload);

    if (!saved) return;

    await loadAllData();
    renderAll();
    resetEventModal();
    closeModal("eventModal");
  } finally {
    saveLocks.event = false;
    lockButton(saveEventBtn, false, "Saving...", editState.eventId ? "Update Event" : "Save Event");
  }
}

if (saveEventBtn) saveEventBtn.addEventListener("click", saveEvent);

async function saveAcademicYear() {
  if (saveLocks.academicYear) return;
  saveLocks.academicYear = true;
  lockButton(saveAcademicYearBtn, true, "Saving...", editState.academicYearId ? "Update Academic Year" : "Save Academic Year");

  try {
    const name = academicYearNameInput.value.trim();

    if (!name) {
      alert("Please enter an academic year.");
      return;
    }

    const saved = editState.academicYearId
      ? await updateRecord("academic_years", editState.academicYearId, { name })
      : await insertRecord("academic_years", { name });

    if (!saved) return;

    await loadAllData();
    populateSemesterOptions();
    renderAll();
    resetAcademicYearModal();
    closeModal("academicYearModal");
  } finally {
    saveLocks.academicYear = false;
    lockButton(saveAcademicYearBtn, false, "Saving...", editState.academicYearId ? "Update Academic Year" : "Save Academic Year");
  }
}

if (saveAcademicYearBtn) {
  saveAcademicYearBtn.addEventListener("click", saveAcademicYear);
}

async function saveSemester() {
  if (saveLocks.semester) return;
  saveLocks.semester = true;
  lockButton(saveSemesterBtn, true, "Saving...", editState.semesterId ? "Update Semester" : "Save Semester");

  try {
    const academic_year_id = semesterAcademicYearInput.value;
    const name = semesterNameInput.value.trim();
    const start_date = semesterStartDateInput.value || null;
    const end_date = semesterEndDateInput.value || null;

    if (!academic_year_id || !name || !start_date || !end_date) {
      alert("Please choose an academic year and enter semester name, start date, and end date.");
      return;
    }

    const payload = {
      academic_year_id,
      name,
      start_date,
      end_date
    };

    const saved = editState.semesterId
      ? await updateRecord("semesters", editState.semesterId, payload)
      : await insertRecord("semesters", payload);

    if (!saved) return;

    await loadAllData();
    populateSemesterOptions();
    renderAll();
    resetSemesterModal();
    closeModal("semesterModal");
  } finally {
    saveLocks.semester = false;
    lockButton(saveSemesterBtn, false, "Saving...", editState.semesterId ? "Update Semester" : "Save Semester");
  }
}

if (saveSemesterBtn) saveSemesterBtn.addEventListener("click", saveSemester);

function getSessionsForCourse(courseId) {
  return courseSessions.filter(function (session) {
    return session.course_id === courseId;
  });
}

function getSessionsForDate(date) {
  const dateKey = toDateKey(date);
  const dayName = dayNameFromDate(date);

  if (isHolidayDate(dateKey)) {
    return [];
  }

  const items = [];

  courses.forEach(function (course) {
    const sessions = getSessionsForCourse(course.id);

    sessions.forEach(function (session) {
      const weeklyMatch = session.repeat_type === "weekly" && session.day_name === dayName;
      const specificMatch = session.repeat_type === "specific" && session.session_date === dateKey;

      if (weeklyMatch || specificMatch) {
        items.push({
          type: "course",
          id: `course-session-${session.id}-${dateKey}`,
          title: `${course.name} - ${session.session_type}`,
          shortTitle: `${course.name}`,
          timeLabel: `${formatTime(session.start_time)} - ${formatTime(session.end_time)}`,
          location: session.location || "",
          color: course.color || "#5263b2",
          courseName: course.name,
          detailHtml: `
            <p class="meta">Course: ${escapeHtml(course.name)}</p>
            <p class="meta">Code: ${escapeHtml(course.code || "No code")}</p>
            <p class="meta">Instructor: ${escapeHtml(course.instructor || "No instructor")}</p>
            <p class="meta">Session: ${escapeHtml(session.session_type)}</p>
            <p class="meta">Time: ${escapeHtml(formatTime(session.start_time))} - ${escapeHtml(formatTime(session.end_time))}</p>
            <p class="meta">Location: ${escapeHtml(session.location || "No location")}</p>
          `
        });
      }
    });
  });

  return items.sort(function (a, b) {
    return (a.timeLabel || "").localeCompare(b.timeLabel || "");
  });
}

function isPastExam(exam) {
  if (!exam.exam_date) return false;
  const now = new Date();
  const examDateTime = new Date(`${exam.exam_date}T${exam.exam_time || "23:59"}`);
  return examDateTime < now;
}

function getItemsForDate(dateKey) {
  const dateObj = new Date(dateKey + "T00:00:00");
  const courseItems = getSessionsForDate(dateObj);

  const examItems = exams
    .filter(function (exam) {
      return exam.exam_date === dateKey;
    })
    .map(function (exam) {
      const endTime = exam.duration_minutes ? calculateExamEndTime(exam.exam_time, exam.duration_minutes) : "";
      const color = getCourseColorByName(exam.course);
      return {
        type: "exam",
        id: "exam-" + exam.id,
        title: "Exam: " + exam.title,
        shortTitle: "Exam: " + exam.title,
        timeLabel: exam.exam_time
          ? `${formatTime(exam.exam_time)}${endTime ? " - " + formatTime(endTime) : ""}`
          : "Time not set",
        location: exam.place || "",
        color,
        isPast: isPastExam(exam),
        detailHtml: `
          <p class="meta">Course: ${escapeHtml(exam.course || "No course")}</p>
          <p class="meta">Date: ${escapeHtml(formatDate(exam.exam_date))}</p>
          <p class="meta">Start time: ${escapeHtml(exam.exam_time ? formatTime(exam.exam_time) : "No time")}</p>
          <p class="meta">Duration: ${escapeHtml(exam.duration_minutes ? exam.duration_minutes + " minutes" : "No duration")}</p>
          <p class="meta">Place: ${escapeHtml(exam.place || "No place")}</p>
          <p class="meta">Seat: ${escapeHtml(exam.seat_number || "No seat number")}</p>
          <p class="meta">Grade: ${escapeHtml(exam.grade || "No grade")}</p>
          <p class="meta">Mark: ${escapeHtml(exam.mark ?? "No mark")}</p>
          <p class="meta">Notes: ${escapeHtml(exam.notes || "No notes")}</p>
        `
      };
    });

  const eventItems = events
    .filter(function (event) {
      return event.event_date === dateKey;
    })
    .map(function (event) {
      return {
        type: "event",
        id: "event-" + event.id,
        title: event.title,
        shortTitle: event.title,
        timeLabel: `${event.start_time ? formatTime(event.start_time) : ""}${event.end_time ? " - " + formatTime(event.end_time) : ""}`.trim() || "Time not set",
        location: event.location || "",
        color: event.color || "#7c3aed",
        detailHtml: `
          <p class="meta">Date: ${escapeHtml(formatDate(event.event_date))}</p>
          <p class="meta">Time: ${escapeHtml(
            `${event.start_time ? formatTime(event.start_time) : ""}${event.end_time ? " - " + formatTime(event.end_time) : ""}`.trim() || "Time not set"
          )}</p>
          <p class="meta">Location: ${escapeHtml(event.location || "No location")}</p>
          <p class="meta">Details: ${escapeHtml(event.details || "No details")}</p>
        `
      };
    });

  const holidayItems = holidays
    .filter(function (holiday) {
      return buildHolidayDates(holiday).includes(dateKey);
    })
    .map(function (holiday) {
      return {
        type: "holiday",
        id: "holiday-" + holiday.id,
        title: "Holiday: " + holiday.title,
        shortTitle: "Holiday: " + holiday.title,
        timeLabel: holiday.type || "Holiday",
        location: "",
        color: "#dc2626",
        detailHtml: `
          <p class="meta">Start: ${escapeHtml(formatDate(holiday.start_date || holiday.date))}</p>
          <p class="meta">End: ${escapeHtml(formatDate(holiday.end_date || holiday.start_date || holiday.date))}</p>
          <p class="meta">Type: ${escapeHtml(holiday.type || "Holiday")}</p>
          <p class="meta">Courses will not appear during this holiday.</p>
        `
      };
    });

  return courseItems.concat(examItems, eventItems, holidayItems);
}

function openDetailModal(title, html) {
  if (detailTitle) detailTitle.textContent = title || "Details";
  if (detailBody) detailBody.innerHTML = html || "<p class='meta'>No details.</p>";
  openModal("detailModal");
}

function renderScheduleList(container, items) {
  if (!container) return;

  if (!items.length) {
    container.innerHTML = '<div class="empty-state">Nothing scheduled.</div>';
    return;
  }

  container.innerHTML = items.map(function (item) {
    return `
      <button class="day-card clickable-card ${item.isPast ? "past-item" : ""}" type="button" data-detail-title="${escapeHtml(item.title)}" data-detail-html="${escapeHtml(item.detailHtml || "")}">
        <h4 class="task-title">${escapeHtml(item.title)}</h4>
        <p class="meta">${escapeHtml(item.timeLabel || "")}</p>
        <p class="meta">${escapeHtml(item.location || "")}</p>
      </button>
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
          const course = getCourseById(task.course_id);
          const html = `
            <p class="meta">Details: ${escapeHtml(task.details || "No details")}</p>
            <p class="meta">Course: ${escapeHtml(course ? course.name : "No course")}</p>
            <p class="meta">Due: ${escapeHtml(task.due_date ? formatDate(task.due_date) : "No due date")}</p>
            <p class="meta">Priority: ${escapeHtml(task.priority || "No priority")}</p>
            <p class="meta">Status: ${escapeHtml(task.status || "To Do")}</p>
          `;
          return `
            <button class="day-card clickable-card" type="button" data-detail-title="${escapeHtml(task.title)}" data-detail-html="${escapeHtml(html)}">
              <h4 class="task-title">${escapeHtml(task.title)}</h4>
              <p class="meta">${escapeHtml(task.due_date ? formatDate(task.due_date) : "No due date")}</p>
            </button>
          `;
        }).join("")
      : '<div class="empty-state">No upcoming tasks.</div>';
  }

  if (dashboardUpcomingExams) {
    dashboardUpcomingExams.innerHTML = exams.length
      ? exams
          .slice()
          .sort(function (a, b) {
            return `${a.exam_date || ""} ${a.exam_time || ""}`.localeCompare(`${b.exam_date || ""} ${b.exam_time || ""}`);
          })
          .slice(0, 5)
          .map(function (exam) {
            const html = `
              <p class="meta">Course: ${escapeHtml(exam.course || "No course")}</p>
              <p class="meta">Date: ${escapeHtml(exam.exam_date ? formatDate(exam.exam_date) : "No date")}</p>
              <p class="meta">Start time: ${escapeHtml(exam.exam_time ? formatTime(exam.exam_time) : "No time")}</p>
              <p class="meta">Duration: ${escapeHtml(exam.duration_minutes ? exam.duration_minutes + " minutes" : "No duration")}</p>
              <p class="meta">Place: ${escapeHtml(exam.place || "No place")}</p>
              <p class="meta">Notes: ${escapeHtml(exam.notes || "No notes")}</p>
            `;
            return `
              <button class="day-card clickable-card ${isPastExam(exam) ? "past-item" : ""}" type="button" data-detail-title="${escapeHtml(exam.title)}" data-detail-html="${escapeHtml(html)}">
                <h4 class="task-title">${escapeHtml(exam.title)}</h4>
                <p class="meta">${escapeHtml(exam.exam_date ? formatDate(exam.exam_date) : "No date")}</p>
                <p class="meta">${escapeHtml(exam.exam_time ? formatTime(exam.exam_time) : "No time")}</p>
              </button>
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
    const sessions = getSessionsForCourse(course.id);
    const lineColor = course.color || "#5666dd";
    const textColor = getReadableTextColor(lineColor);

    return `
      <div class="course-card">
        <div class="course-color-line" style="background:${escapeHtml(lineColor)};"></div>
        <div class="item-head">
          <div class="item-title-wrap">
            <div class="badge-row">
              <span class="course-badge" style="background:${escapeHtml(lineColor)};color:${escapeHtml(textColor)}">${escapeHtml(course.name)}</span>
            </div>
            <p class="meta">${escapeHtml(course.code || "No code")}</p>
            <p class="meta">${escapeHtml(course.instructor || "No instructor")}</p>
          </div>
          ${buildItemMenu("course", course.id)}
        </div>
        <div class="task-card-expanded">
          ${
            sessions.length
              ? sessions.map(function (session) {
                  return `
                    <div class="detail-item">
                      <strong>${escapeHtml(session.session_type)}</strong>
                      <p class="meta">
                        ${session.repeat_type === "weekly"
                          ? `Weekly on ${escapeHtml(session.day_name || "")}`
                          : `Specific date: ${escapeHtml(session.session_date || "")}`}
                      </p>
                      <p class="meta">${escapeHtml(formatTime(session.start_time))} - ${escapeHtml(formatTime(session.end_time))}</p>
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
        <div class="item-head">
          <div class="item-title-wrap">
            <div class="badge-row">
              <span class="priority-badge ${priorityClass}">${escapeHtml(task.priority || "No priority")}</span>
              <span class="status-badge ${statusClass}">${escapeHtml(task.status || "To Do")}</span>
              ${course ? createCourseChip(course) : ""}
            </div>
            <h4 class="task-title ${task.status === "Done" ? "task-done-title" : ""}">${escapeHtml(task.title)}</h4>
            <p class="meta">${escapeHtml(task.details || "No details")}</p>
            <p class="meta">Course: ${escapeHtml(course ? course.name : "No course")}</p>
            <p class="meta">Due: ${escapeHtml(task.due_date ? formatDate(task.due_date) : "No due date")}</p>
          </div>
          ${buildItemMenu("task", task.id)}
        </div>
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
            <div class="item-head">
              <div class="item-title-wrap">
                <h4 class="task-title">${escapeHtml(note.title)}</h4>
                <p class="meta">${escapeHtml(note.content || "No content")}</p>
              </div>
              ${buildItemMenu("note", note.id)}
            </div>
          </div>
        `;
      }).join("")
    : '<div class="empty-state">No notes yet.</div>';
}

function renderExams() {
  if (!examsList) return;

  examsList.innerHTML = exams.length
    ? exams.map(function (exam) {
        const endTime = exam.duration_minutes ? calculateExamEndTime(exam.exam_time, exam.duration_minutes) : "";
        const course = getCourseByName(exam.course);
        return `
          <div class="course-card ${isPastExam(exam) ? "past-item" : ""}">
            <div class="item-head">
              <div class="item-title-wrap">
                <div class="badge-row">
                  ${course ? createCourseChip(course) : ""}
                </div>
                <h4 class="task-title">${escapeHtml(exam.title)}</h4>
                <p class="meta">Course: ${escapeHtml(exam.course || "No course")}</p>
                <p class="meta">Date: ${escapeHtml(exam.exam_date ? formatDate(exam.exam_date) : "No date")}</p>
                <p class="meta">Time: ${escapeHtml(exam.exam_time ? formatTime(exam.exam_time) : "No time")}${endTime ? " - " + escapeHtml(formatTime(endTime)) : ""}</p>
                <p class="meta">Duration: ${escapeHtml(exam.duration_minutes ? exam.duration_minutes + " minutes" : "No duration")}</p>
                <p class="meta">Place: ${escapeHtml(exam.place || "No place")}</p>
                <p class="meta">Seat: ${escapeHtml(exam.seat_number || "No seat number")}</p>
                <p class="meta">Grade: ${escapeHtml(exam.grade || "No grade")}</p>
                <p class="meta">Mark: ${escapeHtml(exam.mark ?? "No mark")}</p>
                <p class="meta">Notes: ${escapeHtml(exam.notes || "No notes")}</p>
              </div>
              ${buildItemMenu("exam", exam.id)}
            </div>
          </div>
        `;
      }).join("")
    : '<div class="empty-state">No exams yet.</div>';
}

function renderHolidays() {
  if (!holidaysList) return;

  holidaysList.innerHTML = holidays.length
    ? holidays
        .slice()
        .sort(function (a, b) {
          return (a.start_date || a.date || "").localeCompare(b.start_date || b.date || "");
        })
        .map(function (holiday) {
          return `
            <div class="course-card">
              <div class="item-head">
                <div class="item-title-wrap">
                  <h4 class="task-title">${escapeHtml(holiday.title)}</h4>
                  <p class="meta">Start: ${escapeHtml(holiday.start_date ? formatDate(holiday.start_date) : holiday.date ? formatDate(holiday.date) : "No start date")}</p>
                  <p class="meta">End: ${escapeHtml(holiday.end_date ? formatDate(holiday.end_date) : holiday.start_date ? formatDate(holiday.start_date) : holiday.date ? formatDate(holiday.date) : "No end date")}</p>
                  <p class="meta">Type: ${escapeHtml(holiday.type || "Holiday")}</p>
                  <p class="meta">Courses will not appear during this holiday.</p>
                </div>
                ${buildItemMenu("holiday", holiday.id)}
              </div>
            </div>
          `;
        })
        .join("")
    : '<div class="empty-state">No holidays yet.</div>';
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
        <div class="item-head">
          <div class="item-title-wrap">
            <h4 class="task-title">${escapeHtml(year.name)}</h4>
          </div>
          ${buildItemMenu("academic-year", year.id)}
        </div>
        <div class="task-card-expanded">
          ${
            yearSemesters.length
              ? yearSemesters.map(function (semester) {
                  return `
                    <div class="semester-box">
                      <div class="item-head">
                        <div class="item-title-wrap">
                          <strong>${escapeHtml(semester.name)}</strong>
                          <p class="meta">${escapeHtml(semester.start_date ? formatDate(semester.start_date) : "No start")} - ${escapeHtml(semester.end_date ? formatDate(semester.end_date) : "No end")}</p>
                        </div>
                        ${buildItemMenu("semester", semester.id)}
                      </div>
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
  const itemClass = item.type;
  const bgColor = item.color ||
    (item.type === "course" ? "#5263b2" :
    item.type === "exam" ? "#0f766e" :
    item.type === "event" ? "#7c3aed" :
    "#dc2626");
  const textColor = getReadableTextColor(bgColor);

  return `
    <button
      class="calendar-item ${itemClass}"
      type="button"
      style="background:${escapeHtml(bgColor)};color:${escapeHtml(textColor)}"
      data-detail-title="${escapeHtml(item.title)}"
      data-detail-html="${escapeHtml(item.detailHtml || "")}"
    >
      <span>${escapeHtml(item.shortTitle || item.title)}</span>
      <small>${escapeHtml(item.timeLabel || "")}</small>
      ${item.location ? `<small>${escapeHtml(item.location)}</small>` : ""}
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
    const holiday = getHolidayForDate(key);

    cells.push(`
      <div class="calendar-cell ${isToday ? "today" : ""} ${isOtherMonth ? "other-month" : ""} ${holiday ? "holiday-cell" : ""}">
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
    const key = toDateKey(date);
    const items = getItemsForDate(key);
    const holiday = getHolidayForDate(key);

    columns.push(`
      <div class="week-day-column ${holiday ? "holiday-cell" : ""}">
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

  const key = toDateKey(currentCalendarDate);
  const items = getItemsForDate(key);
  const holiday = getHolidayForDate(key);

  dayCalendarGrid.innerHTML = `
    <div class="day-view-card ${holiday ? "holiday-cell" : ""}">
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

function openEditCourse(id) {
  const course = courses.find(function (item) { return item.id === id; });
  if (!course) return;

  editState.courseId = id;
  if (courseModalTitle) courseModalTitle.textContent = "Edit Course";
  if (saveCourseBtn) saveCourseBtn.textContent = "Update Course";
  courseNameInput.value = course.name || "";
  courseCodeInput.value = course.code || "";
  courseInstructorInput.value = course.instructor || "";
  courseColorInput.value = course.color || "#2563eb";
  updateColorPreview(courseColorInput, courseColorPreview);
  courseSemesterInput.value = course.semester_id || "";

  pendingSessions = [];
  const sessions = getSessionsForCourse(id);
  const groupedWeekly = sessions.filter(s => s.repeat_type === "weekly");
  const groupedSpecificMap = {};

  groupedWeekly.forEach(function (session) {
    pendingSessions.push({
      session_type: session.session_type,
      repeat_type: "weekly",
      day_name: session.day_name,
      session_dates: [],
      start_time: session.start_time,
      end_time: session.end_time,
      location: session.location || ""
    });
  });

  sessions.filter(s => s.repeat_type === "specific").forEach(function (session) {
    const key = [session.session_type, session.start_time, session.end_time, session.location || ""].join("|");
    if (!groupedSpecificMap[key]) {
      groupedSpecificMap[key] = {
        session_type: session.session_type,
        repeat_type: "specific",
        day_name: null,
        session_dates: [],
        start_time: session.start_time,
        end_time: session.end_time,
        location: session.location || ""
      };
    }
    groupedSpecificMap[key].session_dates.push(session.session_date);
  });

  Object.values(groupedSpecificMap).forEach(function (session) {
    session.session_dates.sort();
    pendingSessions.push(session);
  });

  renderPendingSessions();
  updateSessionRepeatUI();
  openModal("courseModal");
}

function openEditTask(id) {
  const task = tasks.find(function (item) { return item.id === id; });
  if (!task) return;

  editState.taskId = id;
  if (taskModalTitle) taskModalTitle.textContent = "Edit Task";
  if (addTaskBtn) addTaskBtn.textContent = "Update Task";
  taskTitleInput.value = task.title || "";
  taskDetailsInput.value = task.details || "";
  taskCourseInput.value = task.course_id || "";
  taskDateInput.value = task.due_date || "";
  taskPriorityInput.value = task.priority || "High";
  taskStatusInput.value = task.status || "To Do";
  openModal("taskModal");
}

function openEditNote(id) {
  const note = notes.find(function (item) { return item.id === id; });
  if (!note) return;

  editState.noteId = id;
  if (noteModalTitle) noteModalTitle.textContent = "Edit Note";
  if (saveNoteBtn) saveNoteBtn.textContent = "Update Note";
  noteTitleInput.value = note.title || "";
  noteContentInput.value = note.content || "";
  openModal("noteModal");
}

function openEditExam(id) {
  const exam = exams.find(function (item) { return item.id === id; });
  if (!exam) return;

  editState.examId = id;
  if (examModalTitle) examModalTitle.textContent = "Edit Exam";
  if (saveExamBtn) saveExamBtn.textContent = "Update Exam";
  examTitleInput.value = exam.title || "";
  examCourseInput.value = exam.course || "";
  examDateInput.value = exam.exam_date || "";
  examTimeInput.value = exam.exam_time || "";
  examDurationInput.value = exam.duration_minutes ?? "";
  examPlaceInput.value = exam.place || "";
  examSeatNumberInput.value = exam.seat_number || "";
  examGradeInput.value = exam.grade || "";
  examMarkInput.value = exam.mark ?? "";
  examNotesInput.value = exam.notes || "";
  openModal("examModal");
}

function openEditHoliday(id) {
  const holiday = holidays.find(function (item) { return item.id === id; });
  if (!holiday) return;

  editState.holidayId = id;
  if (holidayModalTitle) holidayModalTitle.textContent = "Edit Holiday";
  if (saveHolidayBtn) saveHolidayBtn.textContent = "Update Holiday";
  holidayTitleInput.value = holiday.title || "";
  holidayStartDateInput.value = holiday.start_date || holiday.date || "";
  holidayEndDateInput.value = holiday.end_date || holiday.start_date || holiday.date || "";
  holidayTypeInput.value = holiday.type || "";
  openModal("holidayModal");
}

function openEditEvent(id) {
  const event = events.find(function (item) { return item.id === id; });
  if (!event) return;

  editState.eventId = id;
  if (eventModalTitle) eventModalTitle.textContent = "Edit Event";
  if (saveEventBtn) saveEventBtn.textContent = "Update Event";
  eventTitleInput.value = event.title || "";
  eventDateInput.value = event.event_date || "";
  eventStartTimeInput.value = event.start_time || "";
  eventEndTimeInput.value = event.end_time || "";
  eventLocationInput.value = event.location || "";
  eventColorInput.value = event.color || "#7c3aed";
  updateColorPreview(eventColorInput, eventColorPreview);
  eventDetailsInput.value = event.details || "";
  openModal("eventModal");
}

function openEditAcademicYear(id) {
  const year = academicYears.find(function (item) { return item.id === id; });
  if (!year) return;

  editState.academicYearId = id;
  if (academicYearModalTitle) academicYearModalTitle.textContent = "Edit Academic Year";
  if (saveAcademicYearBtn) saveAcademicYearBtn.textContent = "Update Academic Year";
  academicYearNameInput.value = year.name || "";
  openModal("academicYearModal");
}

function openEditSemester(id) {
  const semester = semesters.find(function (item) { return item.id === id; });
  if (!semester) return;

  editState.semesterId = id;
  if (semesterModalTitle) semesterModalTitle.textContent = "Edit Semester";
  if (saveSemesterBtn) saveSemesterBtn.textContent = "Update Semester";
  semesterAcademicYearInput.value = semester.academic_year_id || "";
  semesterNameInput.value = semester.name || "";
  semesterStartDateInput.value = semester.start_date || "";
  semesterEndDateInput.value = semester.end_date || "";
  openModal("semesterModal");
}

async function handleDelete(type, id) {
  const confirmed = window.confirm("Delete this item?");
  if (!confirmed) return;

  if (type === "course") {
    const sessions = courseSessions.filter(function (session) {
      return session.course_id === id;
    });
    for (const session of sessions) {
      await deleteRecord("course_sessions", session.id);
    }
    await deleteRecord("courses", id);
  }

  if (type === "task") await deleteRecord("tasks", id);
  if (type === "note") await deleteRecord("notes", id);
  if (type === "exam") await deleteRecord("exams", id);
  if (type === "holiday") await deleteRecord("holidays", id);
  if (type === "event") await deleteRecord("events", id);
  if (type === "academic-year") {
    const relatedSemesters = semesters.filter(function (semester) {
      return semester.academic_year_id === id;
    });
    for (const semester of relatedSemesters) {
      await deleteRecord("semesters", semester.id);
    }
    await deleteRecord("academic_years", id);
  }
  if (type === "semester") await deleteRecord("semesters", id);

  await loadAllData();
  populateSemesterOptions();
  populateCourseOptions();
  renderAll();
}

document.addEventListener("click", async function (e) {
  const menuToggle = e.target.closest("[data-menu-toggle]");
  if (menuToggle) {
    e.stopPropagation();
    const type = menuToggle.dataset.menuToggle;
    const id = menuToggle.dataset.id;
    const targetMenu = document.querySelector(`.item-menu[data-menu="${type}"][data-id="${id}"]`);
    const alreadyOpen = targetMenu?.classList.contains("show");
    clearOpenMenus();
    if (targetMenu && !alreadyOpen) targetMenu.classList.add("show");
    return;
  }

  const editBtn = e.target.closest("[data-edit-type]");
  if (editBtn) {
    const type = editBtn.dataset.editType;
    const id = editBtn.dataset.id;
    clearOpenMenus();

    if (type === "course") openEditCourse(id);
    if (type === "task") openEditTask(id);
    if (type === "note") openEditNote(id);
    if (type === "exam") openEditExam(id);
    if (type === "holiday") openEditHoliday(id);
    if (type === "event") openEditEvent(id);
    if (type === "academic-year") openEditAcademicYear(id);
    if (type === "semester") openEditSemester(id);
    return;
  }

  const deleteBtn = e.target.closest("[data-delete-type]");
  if (deleteBtn) {
    const type = deleteBtn.dataset.deleteType;
    const id = deleteBtn.dataset.id;
    clearOpenMenus();
    await handleDelete(type, id);
    return;
  }

  const removeSessionBtn = e.target.closest("[data-remove-session]");
  if (removeSessionBtn) {
    const index = Number(removeSessionBtn.dataset.removeSession);
    pendingSessions.splice(index, 1);
    renderPendingSessions();
    return;
  }

  const removeSpecificDateBtn = e.target.closest("[data-remove-specific-date]");
  if (removeSpecificDateBtn) {
    const index = Number(removeSpecificDateBtn.dataset.removeSpecificDate);
    pendingSpecificDateList.splice(index, 1);
    renderPendingSpecificDates();
    return;
  }

  const detailTrigger = e.target.closest("[data-detail-title]");
  if (detailTrigger) {
    const title = detailTrigger.dataset.detailTitle || "Details";
    const html = (detailTrigger.dataset.detailHtml || "")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">")
      .replaceAll("&amp;", "&")
      .replaceAll("&quot;", '"')
      .replaceAll("&#39;", "'");
    openDetailModal(title, html);
    return;
  }

  clearOpenMenus();
});

function renderAll() {
  populateSemesterOptions();
  populateCourseOptions();
  renderPendingSpecificDates();
  renderPendingSessions();
  renderDashboard();
  renderCourses();
  renderTasks();
  renderNotes();
  renderExams();
  renderHolidays();
  renderAcademicYears();
  renderCalendar();
}

if (courseColorInput) {
  courseColorInput.addEventListener("input", function () {
    updateColorPreview(courseColorInput, courseColorPreview);
  });
}

if (eventColorInput) {
  eventColorInput.addEventListener("input", function () {
    updateColorPreview(eventColorInput, eventColorPreview);
  });
}

document.querySelectorAll('[data-open-modal="courseModal"]').forEach(function (btn) {
  btn.addEventListener("click", function () {
    resetCourseModal();
  });
});
document.querySelectorAll('[data-open-modal="taskModal"]').forEach(function (btn) {
  btn.addEventListener("click", function () {
    resetTaskModal();
  });
});
document.querySelectorAll('[data-open-modal="noteModal"]').forEach(function (btn) {
  btn.addEventListener("click", function () {
    resetNoteModal();
  });
});
document.querySelectorAll('[data-open-modal="examModal"]').forEach(function (btn) {
  btn.addEventListener("click", function () {
    resetExamModal();
  });
});
document.querySelectorAll('[data-open-modal="holidayModal"]').forEach(function (btn) {
  btn.addEventListener("click", function () {
    resetHolidayModal();
  });
});
document.querySelectorAll('[data-open-modal="eventModal"]').forEach(function (btn) {
  btn.addEventListener("click", function () {
    resetEventModal();
  });
});
document.querySelectorAll('[data-open-modal="academicYearModal"]').forEach(function (btn) {
  btn.addEventListener("click", function () {
    resetAcademicYearModal();
  });
});
document.querySelectorAll('[data-open-modal="semesterModal"]').forEach(function (btn) {
  btn.addEventListener("click", function () {
    resetSemesterModal();
  });
});

resetCourseModal();
resetTaskModal();
resetNoteModal();
resetExamModal();
resetHolidayModal();
resetEventModal();
resetAcademicYearModal();
resetSemesterModal();
getCurrentSession();
showTab("dashboard");
