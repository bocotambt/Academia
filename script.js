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
const detailActions = $("detailActions");
const detailEditBtn = $("detailEditBtn");
const detailDeleteBtn = $("detailDeleteBtn");

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
const examDurationInput = $("examDuration");
const examPlaceInput = $("examPlace");
const examSeatNumberInput = $("examSeatNumber");
const examGradeInput = $("examGrade");
const examMarkInput = $("examMark");
const examNotesInput = $("examNotes");
const saveExamBtn = $("saveExamBtn");

const holidayTitleInput = $("holidayTitle");
const holidayStartDateInput = $("holidayStartDate");
const holidayEndDateInput = $("holidayEndDate");
const holidayTypeInput = $("holidayType");
const saveHolidayBtn = $("saveHolidayBtn");

const eventTitleInput = $("eventTitle");
const eventDateInput = $("eventDate");
const eventStartTimeInput = $("eventStartTime");
const eventEndTimeInput = $("eventEndTime");
const eventLocationInput = $("eventLocation");
const eventDetailsInput = $("eventDetails");
const eventColorInput = $("eventColor");
const eventColorPreview = $("eventColorPreview");
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

let activeDetailRecord = null;
let activeSaveRequests = new Set();

let editingCourseId = null;
let editingTaskId = null;
let editingNoteId = null;
let editingExamId = null;
let editingHolidayId = null;
let editingEventId = null;
let editingAcademicYearId = null;
let editingSemesterId = null;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function decodeHtml(value) {
  return String(value ?? "")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&");
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

function courseColor(course) {
  return course && course.color ? course.color : "#5666dd";
}

function getCourseById(courseId) {
  return courses.find(function (course) {
    return course.id === courseId;
  }) || null;
}

function getCourseByName(name) {
  return courses.find(function (course) {
    return course.name === name;
  }) || null;
}

function setColorPreview(input, preview) {
  if (!input || !preview) return;
  preview.style.background = input.value || "#5666dd";
}

function setButtonBusy(button, busy, label) {
  if (!button) return;
  if (busy) {
    button.dataset.originalText = button.textContent;
    button.disabled = true;
    button.classList.add("save-disabled");
    button.textContent = label || "Saving...";
  } else {
    button.disabled = false;
    button.classList.remove("save-disabled");
    button.textContent = button.dataset.originalText || button.textContent;
  }
}

function openModal(modalId) {
  const modal = $(modalId);
  if (modal) modal.classList.remove("hidden");
}

function closeModal(modalId) {
  const modal = $(modalId);
  if (modal) modal.classList.add("hidden");
}

function hideDetailActions() {
  activeDetailRecord = null;
  if (detailActions) detailActions.classList.add("hidden");
}

document.querySelectorAll("[data-open-modal]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    openModal(btn.dataset.openModal);
  });
});

document.querySelectorAll("[data-close-modal]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    closeModal(btn.dataset.closeModal);
    if (btn.dataset.closeModal === "detailModal") {
      hideDetailActions();
    }
  });
});

document.querySelectorAll(".modal").forEach(function (modal) {
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.classList.add("hidden");
      if (modal.id === "detailModal") {
        hideDetailActions();
      }
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
  if (!currentUser || !id) return null;

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
  if (!currentUser || !id) return false;

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
    const currentValue = courseSemesterInput.value;
    courseSemesterInput.innerHTML = `<option value="">Choose semester</option>`;
    semesters.forEach(function (semester) {
      const option = document.createElement("option");
      option.value = semester.id;
      option.textContent = semester.name;
      courseSemesterInput.appendChild(option);
    });
    if ([...courseSemesterInput.options].some(function (opt) { return opt.value === currentValue; })) {
      courseSemesterInput.value = currentValue;
    }
  }

  if (semesterAcademicYearInput) {
    const currentValue = semesterAcademicYearInput.value;
    semesterAcademicYearInput.innerHTML = `<option value="">Choose academic year</option>`;
    academicYears.forEach(function (year) {
      const option = document.createElement("option");
      option.value = year.id;
      option.textContent = year.name;
      semesterAcademicYearInput.appendChild(option);
    });
    if ([...semesterAcademicYearInput.options].some(function (opt) { return opt.value === currentValue; })) {
      semesterAcademicYearInput.value = currentValue;
    }
  }
}

function populateCourseOptions() {
  if (taskCourseInput) {
    const currentValue = taskCourseInput.value;
    taskCourseInput.innerHTML = `<option value="">No course</option>`;
    courses.forEach(function (course) {
      const option = document.createElement("option");
      option.value = course.id;
      option.textContent = course.name;
      taskCourseInput.appendChild(option);
    });
    if ([...taskCourseInput.options].some(function (opt) { return opt.value === currentValue; })) {
      taskCourseInput.value = currentValue;
    }
  }

  if (examCourseInput) {
    const currentValue = examCourseInput.value;
    examCourseInput.innerHTML = `<option value="">No course</option>`;
    courses.forEach(function (course) {
      const option = document.createElement("option");
      option.value = course.name;
      option.textContent = course.name;
      examCourseInput.appendChild(option);
    });
    if ([...examCourseInput.options].some(function (opt) { return opt.value === currentValue; })) {
      examCourseInput.value = currentValue;
    }
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
if (courseColorInput) {
  courseColorInput.addEventListener("input", function () {
    setColorPreview(courseColorInput, courseColorPreview);
  });
}
if (eventColorInput) {
  eventColorInput.addEventListener("input", function () {
    setColorPreview(eventColorInput, eventColorPreview);
  });
}

function resetCourseModal() {
  editingCourseId = null;
  if (courseNameInput) courseNameInput.value = "";
  if (courseCodeInput) courseCodeInput.value = "";
  if (courseInstructorInput) courseInstructorInput.value = "";
  if (courseColorInput) courseColorInput.value = "#2563eb";
  if (courseSemesterInput) courseSemesterInput.value = "";
  pendingSessions = [];
  renderPendingSessions();
  resetCourseSessionInputs();
  setColorPreview(courseColorInput, courseColorPreview);
}

function resetTaskModal() {
  editingTaskId = null;
  if (taskTitleInput) taskTitleInput.value = "";
  if (taskDetailsInput) taskDetailsInput.value = "";
  if (taskCourseInput) taskCourseInput.value = "";
  if (taskDateInput) taskDateInput.value = "";
  if (taskPriorityInput) taskPriorityInput.value = "High";
  if (taskStatusInput) taskStatusInput.value = "To Do";
}

function resetNoteModal() {
  editingNoteId = null;
  if (noteTitleInput) noteTitleInput.value = "";
  if (noteContentInput) noteContentInput.value = "";
}

function resetExamModal() {
  editingExamId = null;
  if (examTitleInput) examTitleInput.value = "";
  if (examCourseInput) examCourseInput.value = "";
  if (examDateInput) examDateInput.value = "";
  if (examTimeInput) examTimeInput.value = "";
  if (examDurationInput) examDurationInput.value = "";
  if (examPlaceInput) examPlaceInput.value = "";
  if (examSeatNumberInput) examSeatNumberInput.value = "";
  if (examGradeInput) examGradeInput.value = "";
  if (examMarkInput) examMarkInput.value = "";
  if (examNotesInput) examNotesInput.value = "";
}

function resetHolidayModal() {
  editingHolidayId = null;
  if (holidayTitleInput) holidayTitleInput.value = "";
  if (holidayStartDateInput) holidayStartDateInput.value = "";
  if (holidayEndDateInput) holidayEndDateInput.value = "";
  if (holidayTypeInput) holidayTypeInput.value = "";
}

function resetEventModal() {
  editingEventId = null;
  if (eventTitleInput) eventTitleInput.value = "";
  if (eventDateInput) eventDateInput.value = "";
  if (eventStartTimeInput) eventStartTimeInput.value = "";
  if (eventEndTimeInput) eventEndTimeInput.value = "";
  if (eventLocationInput) eventLocationInput.value = "";
  if (eventDetailsInput) eventDetailsInput.value = "";
  if (eventColorInput) eventColorInput.value = "#7c3aed";
  setColorPreview(eventColorInput, eventColorPreview);
}

function resetAcademicYearModal() {
  editingAcademicYearId = null;
  if (academicYearNameInput) academicYearNameInput.value = "";
}

function resetSemesterModal() {
  editingSemesterId = null;
  if (semesterAcademicYearInput) semesterAcademicYearInput.value = "";
  if (semesterNameInput) semesterNameInput.value = "";
  if (semesterStartDateInput) semesterStartDateInput.value = "";
  if (semesterEndDateInput) semesterEndDateInput.value = "";
}

async function saveCourse() {
  if (activeSaveRequests.has("course")) return;
  activeSaveRequests.add("course");
  setButtonBusy(saveCourseBtn, true, editingCourseId ? "Updating..." : "Saving...");

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

    if (editingCourseId) {
      savedCourse = await updateRecord("courses", editingCourseId, {
        name,
        code,
        instructor,
        color,
        semester_id
      });

      if (!savedCourse) return;

      const oldSessions = courseSessions.filter(function (session) {
        return session.course_id === editingCourseId;
      });

      for (const session of oldSessions) {
        await deleteRecord("course_sessions", session.id);
      }
    } else {
      savedCourse = await insertRecord("courses", {
        name,
        code,
        instructor,
        color,
        semester_id
      });
    }

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

    await loadAllData();
    populateCourseOptions();
    renderAll();
    resetCourseModal();
    closeModal("courseModal");
  } finally {
    activeSaveRequests.delete("course");
    setButtonBusy(saveCourseBtn, false);
  }
}

if (saveCourseBtn) {
  saveCourseBtn.addEventListener("click", saveCourse);
}

async function saveTask() {
  if (activeSaveRequests.has("task")) return;
  activeSaveRequests.add("task");
  setButtonBusy(addTaskBtn, true, editingTaskId ? "Updating..." : "Saving...");

  try {
    const title = taskTitleInput.value.trim();
    const due_date = taskDateInput.value || null;

    if (!title || !due_date) {
      alert("Please enter a task title and due date.");
      return;
    }

    let saved = null;

    if (editingTaskId) {
      saved = await updateRecord("tasks", editingTaskId, {
        title,
        details: taskDetailsInput.value.trim(),
        course_id: taskCourseInput.value || null,
        due_date,
        priority: taskPriorityInput.value || "High",
        status: taskStatusInput.value || "To Do"
      });
    } else {
      saved = await insertRecord("tasks", {
        title,
        details: taskDetailsInput.value.trim(),
        course_id: taskCourseInput.value || null,
        due_date,
        priority: taskPriorityInput.value || "High",
        status: taskStatusInput.value || "To Do"
      });
    }

    if (!saved) return;

    resetTaskModal();
    await loadAllData();
    renderAll();
    closeModal("taskModal");
  } finally {
    activeSaveRequests.delete("task");
    setButtonBusy(addTaskBtn, false);
  }
}

if (addTaskBtn) addTaskBtn.addEventListener("click", saveTask);

async function saveNote() {
  if (activeSaveRequests.has("note")) return;
  activeSaveRequests.add("note");
  setButtonBusy(saveNoteBtn, true, editingNoteId ? "Updating..." : "Saving...");

  try {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();

    if (!title || !content) {
      alert("Please enter a note title and content.");
      return;
    }

    let saved = null;

    if (editingNoteId) {
      saved = await updateRecord("notes", editingNoteId, { title, content });
    } else {
      saved = await insertRecord("notes", { title, content });
    }

    if (!saved) return;

    resetNoteModal();
    await loadAllData();
    renderAll();
    closeModal("noteModal");
  } finally {
    activeSaveRequests.delete("note");
    setButtonBusy(saveNoteBtn, false);
  }
}

if (saveNoteBtn) saveNoteBtn.addEventListener("click", saveNote);

async function saveExam() {
  if (activeSaveRequests.has("exam")) return;
  activeSaveRequests.add("exam");
  setButtonBusy(saveExamBtn, true, editingExamId ? "Updating..." : "Saving...");

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

    let saved = null;

    if (editingExamId) {
      saved = await updateRecord("exams", editingExamId, payload);
    } else {
      saved = await insertRecord("exams", payload);
    }

    if (!saved) return;

    resetExamModal();
    await loadAllData();
    renderAll();
    closeModal("examModal");
  } finally {
    activeSaveRequests.delete("exam");
    setButtonBusy(saveExamBtn, false);
  }
}

if (saveExamBtn) saveExamBtn.addEventListener("click", saveExam);

async function saveHoliday() {
  if (activeSaveRequests.has("holiday")) return;
  activeSaveRequests.add("holiday");
  setButtonBusy(saveHolidayBtn, true, editingHolidayId ? "Updating..." : "Saving...");

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

    let saved = null;

    if (editingHolidayId) {
      saved = await updateRecord("holidays", editingHolidayId, {
        title,
        date: start_date,
        start_date,
        end_date,
        type
      });
    } else {
      saved = await insertRecord("holidays", {
        id: `holiday-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
        title,
        date: start_date,
        start_date,
        end_date,
        type
      });
    }

    if (!saved) return;

    resetHolidayModal();
    await loadAllData();
    renderAll();
    closeModal("holidayModal");
  } finally {
    activeSaveRequests.delete("holiday");
    setButtonBusy(saveHolidayBtn, false);
  }
}

if (saveHolidayBtn) saveHolidayBtn.addEventListener("click", saveHoliday);

async function saveEvent() {
  if (activeSaveRequests.has("event")) return;
  activeSaveRequests.add("event");
  setButtonBusy(saveEventBtn, true, editingEventId ? "Updating..." : "Saving...");

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
      color: eventColorInput ? eventColorInput.value || "#7c3aed" : "#7c3aed",
      details: eventDetailsInput.value.trim()
    };

    let saved = null;

    if (editingEventId) {
      saved = await updateRecord("events", editingEventId, payload);
    } else {
      saved = await insertRecord("events", payload);
    }

    if (!saved) return;

    resetEventModal();
    await loadAllData();
    renderAll();
    closeModal("eventModal");
  } finally {
    activeSaveRequests.delete("event");
    setButtonBusy(saveEventBtn, false);
  }
}

if (saveEventBtn) saveEventBtn.addEventListener("click", saveEvent);

async function saveAcademicYear() {
  if (activeSaveRequests.has("academicYear")) return;
  activeSaveRequests.add("academicYear");
  setButtonBusy(saveAcademicYearBtn, true, editingAcademicYearId ? "Updating..." : "Saving...");

  try {
    const name = academicYearNameInput.value.trim();

    if (!name) {
      alert("Please enter an academic year.");
      return;
    }

    let saved = null;

    if (editingAcademicYearId) {
      saved = await updateRecord("academic_years", editingAcademicYearId, { name });
    } else {
      saved = await insertRecord("academic_years", { name });
    }

    if (!saved) return;

    resetAcademicYearModal();
    await loadAllData();
    populateSemesterOptions();
    renderAll();
    closeModal("academicYearModal");
  } finally {
    activeSaveRequests.delete("academicYear");
    setButtonBusy(saveAcademicYearBtn, false);
  }
}

if (saveAcademicYearBtn) {
  saveAcademicYearBtn.addEventListener("click", saveAcademicYear);
}

async function saveSemester() {
  if (activeSaveRequests.has("semester")) return;
  activeSaveRequests.add("semester");
  setButtonBusy(saveSemesterBtn, true, editingSemesterId ? "Updating..." : "Saving...");

  try {
    const academic_year_id = semesterAcademicYearInput.value;
    const name = semesterNameInput.value.trim();
    const start_date = semesterStartDateInput.value || null;
    const end_date = semesterEndDateInput.value || null;

    if (!academic_year_id || !name || !start_date || !end_date) {
      alert("Please choose an academic year and enter semester name, start date, and end date.");
      return;
    }

    let saved = null;

    if (editingSemesterId) {
      saved = await updateRecord("semesters", editingSemesterId, {
        academic_year_id,
        name,
        start_date,
        end_date
      });
    } else {
      saved = await insertRecord("semesters", {
        academic_year_id,
        name,
        start_date,
        end_date
      });
    }

    if (!saved) return;

    resetSemesterModal();
    await loadAllData();
    populateSemesterOptions();
    renderAll();
    closeModal("semesterModal");
  } finally {
    activeSaveRequests.delete("semester");
    setButtonBusy(saveSemesterBtn, false);
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
          shortTitle: course.name,
          timeLabel: `${formatTime(session.start_time)} - ${formatTime(session.end_time)}`,
          startTimeSort: session.start_time || "99:99",
          location: session.location || "",
          courseName: course.name,
          color: courseColor(course),
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
    return (a.startTimeSort || "99:99").localeCompare(b.startTimeSort || "99:99");
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
      const examCourseRecord = getCourseByName(exam.course);
      return {
        type: "exam",
        id: "exam-" + exam.id,
        title: "Exam: " + exam.title,
        shortTitle: "Exam: " + exam.title,
        timeLabel: exam.exam_time
          ? `${formatTime(exam.exam_time)}${endTime ? " - " + formatTime(endTime) : ""}`
          : "Time not set",
        startTimeSort: exam.exam_time || "99:99",
        location: exam.place || "",
        color: courseColor(examCourseRecord),
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
        startTimeSort: event.start_time || "99:99",
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
        startTimeSort: "99:99",
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

  return courseItems
    .concat(examItems, eventItems, holidayItems)
    .sort(function (a, b) {
      const timeCompare = (a.startTimeSort || "99:99").localeCompare(b.startTimeSort || "99:99");
      if (timeCompare !== 0) return timeCompare;

      const typeRank = { course: 1, exam: 2, event: 3, holiday: 4 };
      const aRank = typeRank[a.type] || 99;
      const bRank = typeRank[b.type] || 99;
      if (aRank !== bRank) return aRank - bRank;

      return (a.title || "").localeCompare(b.title || "");
    });
}

function openDetailModal(title, html) {
  if (detailTitle) detailTitle.textContent = title || "Details";
  if (detailBody) detailBody.innerHTML = html || "<p class='meta'>No details.</p>";
  openModal("detailModal");
}

function buildRecordDetailHtml(type, record) {
  if (type === "course") {
    const sessions = getSessionsForCourse(record.id);
    return `
      <div class="course-color-line" style="background:${escapeHtml(record.color || "#5666dd")}"></div>
      <p class="meta">Code: ${escapeHtml(record.code || "No code")}</p>
      <p class="meta">Instructor: ${escapeHtml(record.instructor || "No instructor")}</p>
      <p class="meta">Semester: ${escapeHtml((semesters.find(function (s) { return s.id === record.semester_id; }) || {}).name || "No semester")}</p>
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
    `;
  }

  if (type === "task") {
    const course = getCourseById(record.course_id);
    return `
      <p class="meta">Details: ${escapeHtml(record.details || "No details")}</p>
      <p class="meta">Course: ${escapeHtml(course ? course.name : "No course")}</p>
      <p class="meta">Due: ${escapeHtml(record.due_date ? formatDate(record.due_date) : "No due date")}</p>
      <p class="meta">Priority: ${escapeHtml(record.priority || "No priority")}</p>
      <p class="meta">Status: ${escapeHtml(record.status || "To Do")}</p>
    `;
  }

  if (type === "note") {
    return `
      <p class="meta">${escapeHtml(record.content || "No content")}</p>
    `;
  }

  if (type === "exam") {
    const endTime = record.duration_minutes ? calculateExamEndTime(record.exam_time, record.duration_minutes) : "";
    return `
      <p class="meta">Course: ${escapeHtml(record.course || "No course")}</p>
      <p class="meta">Date: ${escapeHtml(record.exam_date ? formatDate(record.exam_date) : "No date")}</p>
      <p class="meta">Time: ${escapeHtml(record.exam_time ? formatTime(record.exam_time) : "No time")}${endTime ? " - " + escapeHtml(formatTime(endTime)) : ""}</p>
      <p class="meta">Duration: ${escapeHtml(record.duration_minutes ? record.duration_minutes + " minutes" : "No duration")}</p>
      <p class="meta">Place: ${escapeHtml(record.place || "No place")}</p>
      <p class="meta">Seat: ${escapeHtml(record.seat_number || "No seat number")}</p>
      <p class="meta">Grade: ${escapeHtml(record.grade || "No grade")}</p>
      <p class="meta">Mark: ${escapeHtml(record.mark ?? "No mark")}</p>
      <p class="meta">Notes: ${escapeHtml(record.notes || "No notes")}</p>
    `;
  }

  if (type === "holiday") {
    return `
      <p class="meta">Start: ${escapeHtml(record.start_date ? formatDate(record.start_date) : record.date ? formatDate(record.date) : "No start date")}</p>
      <p class="meta">End: ${escapeHtml(record.end_date ? formatDate(record.end_date) : record.start_date ? formatDate(record.start_date) : record.date ? formatDate(record.date) : "No end date")}</p>
      <p class="meta">Type: ${escapeHtml(record.type || "Holiday")}</p>
      <p class="meta">Courses will not appear during this holiday.</p>
    `;
  }

  if (type === "event") {
    return `
      <div class="course-color-line" style="background:${escapeHtml(record.color || "#7c3aed")}"></div>
      <p class="meta">Date: ${escapeHtml(record.event_date ? formatDate(record.event_date) : "No date")}</p>
      <p class="meta">Time: ${escapeHtml(record.start_time ? formatTime(record.start_time) : "No time")}${record.end_time ? " - " + escapeHtml(formatTime(record.end_time)) : ""}</p>
      <p class="meta">Location: ${escapeHtml(record.location || "No location")}</p>
      <p class="meta">Details: ${escapeHtml(record.details || "No details")}</p>
    `;
  }

  if (type === "academicYear") {
    const yearSemesters = semesters.filter(function (semester) {
      return semester.academic_year_id === record.id;
    });

    return `
      <p class="meta">Academic year: ${escapeHtml(record.name)}</p>
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
    `;
  }

  if (type === "semester") {
    const year = academicYears.find(function (item) {
      return item.id === record.academic_year_id;
    });

    return `
      <p class="meta">Academic year: ${escapeHtml(year ? year.name : "No academic year")}</p>
      <p class="meta">Semester: ${escapeHtml(record.name || "No semester name")}</p>
      <p class="meta">Start: ${escapeHtml(record.start_date ? formatDate(record.start_date) : "No start")}</p>
      <p class="meta">End: ${escapeHtml(record.end_date ? formatDate(record.end_date) : "No end")}</p>
    `;
  }

  return `<p class="meta">No details.</p>`;
}

function openRecordDetail(recordType, record) {
  activeDetailRecord = { type: recordType, record };
  if (detailActions) detailActions.classList.remove("hidden");
  openDetailModal(record.title || record.name || "Details", buildRecordDetailHtml(recordType, record));
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

    return `
      <div class="course-card">
        <div class="course-color-line" style="background:${escapeHtml(course.color || "#5666dd")}"></div>
        <div class="card-head">
          <div>
            <div class="badge-row">
              <span class="course-badge" style="background:${escapeHtml(course.color || "#5666dd")}">${escapeHtml(course.name)}</span>
            </div>
            <p class="meta">${escapeHtml(course.code || "No code")}</p>
            <p class="meta">${escapeHtml(course.instructor || "No instructor")}</p>
          </div>
          <button class="edit-menu-btn" type="button" data-record-type="course" data-record-id="${escapeHtml(course.id)}" aria-label="Open course details">⋯</button>
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
    const taskColor = courseColor(course);
    const priorityClass =
      task.priority === "High" ? "priority-high" :
      task.priority === "Medium" ? "priority-medium" :
      "priority-low";

    const statusClass =
      task.status === "Done" ? "status-done" :
      task.status === "In Progress" ? "status-progress" :
      "status-todo";

    return `
      <div class="course-card" style="border-top: 6px solid ${escapeHtml(taskColor)}">
        <div class="card-head">
          <div>
            <div class="badge-row">
              <span class="priority-badge ${priorityClass}">${escapeHtml(task.priority || "No priority")}</span>
              <span class="status-badge ${statusClass}">${escapeHtml(task.status || "To Do")}</span>
            </div>
            <h4 class="task-title ${task.status === "Done" ? "task-done-title" : ""}">${escapeHtml(task.title)}</h4>
            <p class="meta">${escapeHtml(task.details || "No details")}</p>
            <p class="meta">Course: ${escapeHtml(course ? course.name : "No course")}</p>
            <p class="meta">Due: ${escapeHtml(task.due_date ? formatDate(task.due_date) : "No due date")}</p>
          </div>
          <button class="edit-menu-btn" type="button" data-record-type="task" data-record-id="${escapeHtml(task.id)}" aria-label="Open task details">⋯</button>
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
            <div class="card-head">
              <div>
                <h4 class="task-title">${escapeHtml(note.title)}</h4>
                <p class="meta">${escapeHtml(note.content || "No content")}</p>
              </div>
              <button class="edit-menu-btn" type="button" data-record-type="note" data-record-id="${escapeHtml(note.id)}" aria-label="Open note details">⋯</button>
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
        const examCourseRecord = getCourseByName(exam.course);
        const examColor = courseColor(examCourseRecord);

        return `
          <div class="course-card ${isPastExam(exam) ? "past-item" : ""}" style="border-top: 6px solid ${escapeHtml(examColor)}">
            <div class="card-head">
              <div>
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
              <button class="edit-menu-btn" type="button" data-record-type="exam" data-record-id="${escapeHtml(exam.id)}" aria-label="Open exam details">⋯</button>
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
              <div class="card-head">
                <div>
                  <h4 class="task-title">${escapeHtml(holiday.title)}</h4>
                  <p class="meta">Start: ${escapeHtml(holiday.start_date ? formatDate(holiday.start_date) : holiday.date ? formatDate(holiday.date) : "No start date")}</p>
                  <p class="meta">End: ${escapeHtml(holiday.end_date ? formatDate(holiday.end_date) : holiday.start_date ? formatDate(holiday.start_date) : holiday.date ? formatDate(holiday.date) : "No end date")}</p>
                  <p class="meta">Type: ${escapeHtml(holiday.type || "Holiday")}</p>
                  <p class="meta">Courses will not appear during this holiday.</p>
                </div>
                <button class="edit-menu-btn" type="button" data-record-type="holiday" data-record-id="${escapeHtml(holiday.id)}" aria-label="Open holiday details">⋯</button>
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
        <div class="card-head">
          <div>
            <h4 class="task-title">${escapeHtml(year.name)}</h4>
            <div class="task-card-expanded">
              ${
                yearSemesters.length
                  ? yearSemesters.map(function (semester) {
                      return `
                        <div class="semester-box">
                          <div class="card-head">
                            <div>
                              <strong>${escapeHtml(semester.name)}</strong>
                              <p class="meta">${escapeHtml(semester.start_date ? formatDate(semester.start_date) : "No start")} - ${escapeHtml(semester.end_date ? formatDate(semester.end_date) : "No end")}</p>
                            </div>
                            <button class="edit-menu-btn" type="button" data-record-type="semester" data-record-id="${escapeHtml(semester.id)}" aria-label="Open semester details">⋯</button>
                          </div>
                        </div>
                      `;
                    }).join("")
                  : '<div class="empty-state">No semesters yet.</div>'
              }
            </div>
          </div>
          <button class="edit-menu-btn" type="button" data-record-type="academicYear" data-record-id="${escapeHtml(year.id)}" aria-label="Open academic year details">⋯</button>
        </div>
      </div>
    `;
  }).join("");
}

function buildCalendarItemHtml(item, compact) {
  let itemClass = "event";
  if (item.type === "course") itemClass = "course";
  if (item.type === "exam") itemClass = "exam";
  if (item.type === "event") itemClass = "event";
  if (item.type === "holiday") itemClass = "holiday";

  const itemColor =
    item.color ||
    (item.type === "holiday" ? "#dc2626" :
    item.type === "event" ? "#7c3aed" :
    item.type === "exam" ? "#0f766e" :
    "#5666dd");

  if (compact) {
    const compactText = item.type === "holiday"
      ? item.shortTitle || item.title
      : `${item.startTimeSort && item.startTimeSort !== "99:99" ? formatTime(item.startTimeSort) + " " : ""}${item.shortTitle || item.title}`;

    return `
      <button
        class="calendar-item ${itemClass} calendar-item-compact"
        style="background:${escapeHtml(itemColor)}"
        type="button"
        data-detail-title="${escapeHtml(item.title)}"
        data-detail-html="${escapeHtml(item.detailHtml || "")}"
        title="${escapeHtml(item.title)}"
      >
        <span>${escapeHtml(compactText)}</span>
      </button>
    `;
  }

  return `
    <button
      class="calendar-item ${itemClass}"
      style="background:${escapeHtml(itemColor)}"
      type="button"
      data-detail-title="${escapeHtml(item.title)}"
      data-detail-html="${escapeHtml(item.detailHtml || "")}"
    >
      <span>${escapeHtml(item.title)}</span>
      <small>${escapeHtml(item.timeLabel || "")}</small>
      ${item.location ? `<small>${escapeHtml(item.location)}</small>` : ""}
    </button>
  `;
}

function buildMoreItemsDetailHtml(items) {
  return items.map(function (item) {
    return `
      <div class="detail-item">
        <strong>${escapeHtml(item.title)}</strong>
        <p class="meta">${escapeHtml(item.timeLabel || "No time")}</p>
        ${item.location ? `<p class="meta">${escapeHtml(item.location)}</p>` : ""}
      </div>
    `;
  }).join("");
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
      <div class="calendar-cell calendar-cell-fixed ${isToday ? "today" : ""} ${isOtherMonth ? "other-month" : ""} ${holiday ? "holiday-cell" : ""}">
        <div class="calendar-date">${cellDate.getDate()}</div>
        <div class="calendar-items calendar-items-compact">
          ${items.slice(0, 3).map(function (item) { return buildCalendarItemHtml(item, true); }).join("")}
          ${items.length > 3 ? `
            <button
              class="calendar-more-btn"
              type="button"
              data-detail-title="${escapeHtml("More for " + formatDate(key))}"
              data-detail-html="${escapeHtml(buildMoreItemsDetailHtml(items))}"
            >
              +${items.length - 3} more
            </button>
          ` : ""}
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
          ${items.length ? items.map(function (item) { return buildCalendarItemHtml(item, false); }).join("") : '<div class="empty-state">No items</div>'}
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
        ${items.length ? items.map(function (item) { return buildCalendarItemHtml(item, false); }).join("") : '<div class="empty-state">No items</div>'}
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

function fillCourseModalForEdit(course) {
  editingCourseId = course.id;
  courseNameInput.value = course.name || "";
  courseCodeInput.value = course.code || "";
  courseInstructorInput.value = course.instructor || "";
  courseColorInput.value = course.color || "#2563eb";
  courseSemesterInput.value = course.semester_id || "";
  setColorPreview(courseColorInput, courseColorPreview);

  const sessions = getSessionsForCourse(course.id);
  pendingSessions = [];
  pendingSpecificDateList = [];

  sessions.forEach(function (session) {
    const existingSpecific = pendingSessions.find(function (item) {
      return (
        item.session_type === session.session_type &&
        item.repeat_type === "specific" &&
        item.start_time === session.start_time &&
        item.end_time === session.end_time &&
        (item.location || "") === (session.location || "")
      );
    });

    if (session.repeat_type === "weekly") {
      pendingSessions.push({
        session_type: session.session_type,
        repeat_type: "weekly",
        day_name: session.day_name,
        session_dates: [],
        start_time: session.start_time,
        end_time: session.end_time,
        location: session.location || ""
      });
    } else if (existingSpecific) {
      existingSpecific.session_dates.push(session.session_date);
      existingSpecific.session_dates.sort();
    } else {
      pendingSessions.push({
        session_type: session.session_type,
        repeat_type: "specific",
        day_name: null,
        session_dates: session.session_date ? [session.session_date] : [],
        start_time: session.start_time,
        end_time: session.end_time,
        location: session.location || ""
      });
    }
  });

  renderPendingSessions();
  renderPendingSpecificDates();
  updateSessionRepeatUI();
  openModal("courseModal");
}

function fillTaskModalForEdit(task) {
  editingTaskId = task.id;
  taskTitleInput.value = task.title || "";
  taskDetailsInput.value = task.details || "";
  taskCourseInput.value = task.course_id || "";
  taskDateInput.value = task.due_date || "";
  taskPriorityInput.value = task.priority || "High";
  taskStatusInput.value = task.status || "To Do";
  openModal("taskModal");
}

function fillNoteModalForEdit(note) {
  editingNoteId = note.id;
  noteTitleInput.value = note.title || "";
  noteContentInput.value = note.content || "";
  openModal("noteModal");
}

function fillExamModalForEdit(exam) {
  editingExamId = exam.id;
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

function fillHolidayModalForEdit(holiday) {
  editingHolidayId = holiday.id;
  holidayTitleInput.value = holiday.title || "";
  holidayStartDateInput.value = holiday.start_date || holiday.date || "";
  holidayEndDateInput.value = holiday.end_date || holiday.start_date || holiday.date || "";
  holidayTypeInput.value = holiday.type || "";
  openModal("holidayModal");
}

function fillEventModalForEdit(event) {
  editingEventId = event.id;
  eventTitleInput.value = event.title || "";
  eventDateInput.value = event.event_date || "";
  eventStartTimeInput.value = event.start_time || "";
  eventEndTimeInput.value = event.end_time || "";
  eventLocationInput.value = event.location || "";
  eventDetailsInput.value = event.details || "";
  if (eventColorInput) eventColorInput.value = event.color || "#7c3aed";
  setColorPreview(eventColorInput, eventColorPreview);
  openModal("eventModal");
}

function fillAcademicYearModalForEdit(year) {
  editingAcademicYearId = year.id;
  academicYearNameInput.value = year.name || "";
  openModal("academicYearModal");
}

function fillSemesterModalForEdit(semester) {
  editingSemesterId = semester.id;
  semesterAcademicYearInput.value = semester.academic_year_id || "";
  semesterNameInput.value = semester.name || "";
  semesterStartDateInput.value = semester.start_date || "";
  semesterEndDateInput.value = semester.end_date || "";
  openModal("semesterModal");
}

function getRecordByTypeAndId(type, id) {
  if (type === "course") return courses.find(function (item) { return String(item.id) === String(id); }) || null;
  if (type === "task") return tasks.find(function (item) { return String(item.id) === String(id); }) || null;
  if (type === "note") return notes.find(function (item) { return String(item.id) === String(id); }) || null;
  if (type === "exam") return exams.find(function (item) { return String(item.id) === String(id); }) || null;
  if (type === "holiday") return holidays.find(function (item) { return String(item.id) === String(id); }) || null;
  if (type === "event") return events.find(function (item) { return String(item.id) === String(id); }) || null;
  if (type === "academicYear") return academicYears.find(function (item) { return String(item.id) === String(id); }) || null;
  if (type === "semester") return semesters.find(function (item) { return String(item.id) === String(id); }) || null;
  return null;
}

function startEditRecord(type, record) {
  if (!record) return;

  if (type === "course") return fillCourseModalForEdit(record);
  if (type === "task") return fillTaskModalForEdit(record);
  if (type === "note") return fillNoteModalForEdit(record);
  if (type === "exam") return fillExamModalForEdit(record);
  if (type === "holiday") return fillHolidayModalForEdit(record);
  if (type === "event") return fillEventModalForEdit(record);
  if (type === "academicYear") return fillAcademicYearModalForEdit(record);
  if (type === "semester") return fillSemesterModalForEdit(record);
}

async function removeRecordWithDependencies(type, record) {
  if (!record) return false;

  if (type === "course") {
    const sessions = courseSessions.filter(function (session) {
      return session.course_id === record.id;
    });

    for (const session of sessions) {
      const ok = await deleteRecord("course_sessions", session.id);
      if (!ok) return false;
    }

    return await deleteRecord("courses", record.id);
  }

  if (type === "task") return await deleteRecord("tasks", record.id);
  if (type === "note") return await deleteRecord("notes", record.id);
  if (type === "exam") return await deleteRecord("exams", record.id);
  if (type === "holiday") return await deleteRecord("holidays", record.id);
  if (type === "event") return await deleteRecord("events", record.id);

  if (type === "academicYear") {
    const linkedSemesters = semesters.filter(function (semester) {
      return semester.academic_year_id === record.id;
    });

    for (const semester of linkedSemesters) {
      const ok = await deleteRecord("semesters", semester.id);
      if (!ok) return false;
    }

    return await deleteRecord("academic_years", record.id);
  }

  if (type === "semester") return await deleteRecord("semesters", record.id);

  return false;
}

if (detailEditBtn) {
  detailEditBtn.addEventListener("click", function () {
    if (!activeDetailRecord) return;
    closeModal("detailModal");
    startEditRecord(activeDetailRecord.type, activeDetailRecord.record);
  });
}

if (detailDeleteBtn) {
  detailDeleteBtn.addEventListener("click", async function () {
    if (!activeDetailRecord) return;

    const confirmed = window.confirm("Delete this item?");
    if (!confirmed) return;

    const deleted = await removeRecordWithDependencies(activeDetailRecord.type, activeDetailRecord.record);
    if (!deleted) return;

    closeModal("detailModal");
    hideDetailActions();
    await loadAllData();
    renderAll();
  });
}

document.addEventListener("click", function (e) {
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

  const recordBtn = e.target.closest("[data-record-type][data-record-id]");
  if (recordBtn) {
    const type = recordBtn.dataset.recordType;
    const id = recordBtn.dataset.recordId;
    const record = getRecordByTypeAndId(type, id);
    if (record) {
      openRecordDetail(type, record);
    }
    return;
  }

  const detailTrigger = e.target.closest("[data-detail-title]");
  if (detailTrigger) {
    hideDetailActions();
    const title = detailTrigger.dataset.detailTitle || "Details";
    const html = decodeHtml(detailTrigger.dataset.detailHtml || "");
    openDetailModal(title, html);
  }
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
