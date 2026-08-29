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

const taskSortFilter = $("taskSortFilter");
const taskCourseFilter = $("taskCourseFilter");
const taskPriorityFilter = $("taskPriorityFilter");

const noteTitleInput = $("noteTitle");
const noteCourseInput = $("noteCourse");
const noteColorInput = $("noteColor");
const noteColorPreview = $("noteColorPreview");
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

let showArchivedTasks = false;
let showArchivedExams = false;
let showArchivedCourses = false;

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

function formatWeekRangeCompact(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = start.toLocaleDateString([], { month: "long" });
  const endMonth = end.toLocaleDateString([], { month: "long" });
  const endYear = end.getFullYear();

  if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
    return `${startDay}-${endDay} ${endMonth} ${endYear}`;
  }

  if (start.getFullYear() === end.getFullYear()) {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${endYear}`;
  }

  return `${startDay} ${startMonth} ${start.getFullYear()} - ${endDay} ${endMonth} ${endYear}`;
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

function getSessionsForCourse(courseId) {
  return courseSessions.filter(function (session) {
    return session.course_id === courseId;
  });
}

function courseColor(course) {
  return course && course.color ? course.color : "#5666dd";
}

function getCourseById(courseId) {
  return courses.find(function (course) {
    return course.id === courseId;
  }) || null;
}

function getSemesterById(semesterId) {
  return semesters.find(function (semester) {
    return semester.id === semesterId;
  }) || null;
}

function findCourseByName(name) {
  return courses.find(function (course) {
    return course.name === name;
  }) || null;
}

function getExamCourse(exam) {
  return findCourseByName(exam.course) || null;
}

function getExamColor(exam) {
  const course = getExamCourse(exam);
  return course ? courseColor(course) : "#dc2626";
}

function getExamCourseLabel(exam) {
  const course = getExamCourse(exam);
  if (course) return `${course.code || "CODE"} — ${course.name}`;
  return exam.course || "No course";
}

function isDateWithinSemester(dateKey, semesterId) {
  if (!semesterId || !dateKey) return true;
  const semester = getSemesterById(semesterId);
  if (!semester || !semester.start_date || !semester.end_date) return true;
  return dateKey >= semester.start_date && dateKey <= semester.end_date;
}

function isPastExam(exam) {
  if (!exam.exam_date) return false;
  const now = new Date();
  const examDateTime = new Date(`${exam.exam_date}T${exam.exam_time || "23:59"}`);
  return examDateTime < now;
}

function isTaskArchived(task) {
  if (!task || !task.due_date) return false;
  const todayKey = toDateKey(new Date());
  return task.status === "Done" && task.due_date < todayKey;
}
function isCourseArchived(course) {
  if (!course || !course.semester_id) return false;
  const semester = getSemesterById(course.semester_id);
  if (!semester || !semester.end_date) return false;

  const todayKey = toDateKey(new Date());
  return semester.end_date < todayKey;
}

function getActiveCourses() {
  return courses.filter(function (course) {
    return !isCourseArchived(course);
  });
}

function getArchivedCourses() {
  return courses
    .filter(function (course) {
      return isCourseArchived(course);
    })
    .slice()
    .sort(function (a, b) {
      const semesterA = getSemesterById(a.semester_id);
      const semesterB = getSemesterById(b.semester_id);
      const endA = semesterA?.end_date || "9999-99-99";
      const endB = semesterB?.end_date || "9999-99-99";
      const first = endB.localeCompare(endA);
      if (first !== 0) return first;
      return (a.code || "").localeCompare(b.code || "") || (a.name || "").localeCompare(b.name || "");
    });
}
function shouldShowTaskOnDashboard(task) {
  if (!task) return false;
  if (isTaskArchived(task)) return false;
  return task.status !== "Done";
}

function shouldShowExamOnDashboard(exam) {
  return !isPastExam(exam);
}

function getTaskColor(task) {
  const course = getCourseById(task.course_id);
  if (course && course.color) return course.color;
  return "#ffffff";
}

function getNoteLinkedCourse(note) {
  return null;
}

function taskPriorityRank(priority) {
  const rank = { High: 1, Medium: 2, Low: 3 };
  return rank[priority] || 99;
}

function compareTaskDates(a, b) {
  const first = (a.due_date || "9999-99-99").localeCompare(b.due_date || "9999-99-99");
  if (first !== 0) return first;
  const second = taskPriorityRank(a.priority) - taskPriorityRank(b.priority);
  if (second !== 0) return second;
  return (a.title || "").localeCompare(b.title || "");
}

function compareExamDates(a, b) {
  const first = (a.exam_date || "9999-99-99").localeCompare(b.exam_date || "9999-99-99");
  if (first !== 0) return first;
  const second = (a.exam_time || "99:99").localeCompare(b.exam_time || "99:99");
  if (second !== 0) return second;
  return (a.title || "").localeCompare(b.title || "");
}

function setColorPreview(input, preview) {
  if (!input || !preview) return;
  preview.style.background = input.value || "#5666dd";
}

function syncNoteColorToSelectedCourse() {
  if (!noteCourseInput || !noteColorInput) return;
  const course = getCourseById(noteCourseInput.value);
  if (course && course.color) {
    noteColorInput.value = course.color;
  } else {
    noteColorInput.value = "#7c3aed";
  }
  setColorPreview(noteColorInput, noteColorPreview);
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

function generateId() {
  return crypto.randomUUID();
}

function replaceItemInArray(list, updatedItem) {
  return list.map(function (item) {
    return item.id === updatedItem.id ? updatedItem : item;
  });
}

function removeItemFromArray(list, id) {
  return list.filter(function (item) {
    return item.id !== id;
  });
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
    if (btn.dataset.closeModal === "detailModal") hideDetailActions();
  });
});

document.querySelectorAll(".modal").forEach(function (modal) {
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.classList.add("hidden");
      if (modal.id === "detailModal") hideDetailActions();
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
    if (window.innerWidth <= 640) tabNav.classList.toggle("menu-open");
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
  if (currentUser) await loadAllData();
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
  const [
    loadedAcademicYears,
    loadedSemesters,
    loadedCourses,
    loadedCourseSessions,
    loadedTasks,
    loadedNotes,
    loadedExams,
    loadedHolidays,
    loadedEvents
  ] = await Promise.all([
    loadTable("academic_years"),
    loadTable("semesters"),
    loadTable("courses"),
    loadTable("course_sessions"),
    loadTable("tasks"),
    loadTable("notes"),
    loadTable("exams"),
    loadTable("holidays"),
    loadTable("events")
  ]);

  academicYears = loadedAcademicYears;
  semesters = loadedSemesters;
  courses = loadedCourses;
  courseSessions = loadedCourseSessions;
  tasks = loadedTasks;
  notes = loadedNotes;
  exams = loadedExams;
  holidays = loadedHolidays;
  events = loadedEvents;
}

async function insertRecord(tableName, payload) {
  if (!currentUser) {
    alert("Please sign in first.");
    return null;
  }

  const record = { ...payload, user_id: currentUser.id };
  const { data, error } = await supabaseClient.from(tableName).insert(record).select().single();

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

async function deleteCourseWithSessions(courseId) {
  const { error: sessionError } = await supabaseClient
    .from("course_sessions")
    .delete()
    .eq("course_id", courseId)
    .eq("user_id", currentUser.id);

  if (sessionError) {
    alert(sessionError.message || "Could not delete course sessions.");
    return false;
  }

  const ok = await deleteRecord("courses", courseId);
  if (!ok) return false;

  courseSessions = courseSessions.filter(function (session) {
    return session.course_id !== courseId;
  });
  courses = removeItemFromArray(courses, courseId);
  tasks = tasks.map(function (task) {
    return task.course_id === courseId ? { ...task, course_id: null } : task;
  });

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
      option.textContent = `${course.code} — ${course.name}`;
      taskCourseInput.appendChild(option);
    });
  }

  if (examCourseInput) {
    examCourseInput.innerHTML = `<option value="">No course</option>`;
    courses.forEach(function (course) {
      const option = document.createElement("option");
      option.value = course.name;
      option.textContent = `${course.code} — ${course.name}`;
      examCourseInput.appendChild(option);
    });
  }

  if (noteCourseInput) {
    noteCourseInput.innerHTML = `<option value="">No course</option>`;
    courses.forEach(function (course) {
      const option = document.createElement("option");
      option.value = course.id;
      option.textContent = `${course.code} — ${course.name}`;
      noteCourseInput.appendChild(option);
    });
  }

  if (taskCourseFilter) {
    const selected = taskCourseFilter.value;
    taskCourseFilter.innerHTML = `<option value="">All courses</option>`;
    courses.forEach(function (course) {
      const option = document.createElement("option");
      option.value = course.id;
      option.textContent = `${course.code} — ${course.name}`;
      taskCourseFilter.appendChild(option);
    });
    taskCourseFilter.value = selected;
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
        <button type="button" data-remove-specific-date="${index}">×</button>
      </div>
    `;
  }).join("");
}

function renderPendingSessions() {
  if (!pendingSessionsList) return;
  pendingSessionsList.innerHTML = "";

  if (!pendingSessions.length) {
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
  const session_type = sessionTypeInput.value.trim();
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

if (sessionRepeatInput) sessionRepeatInput.addEventListener("change", updateSessionRepeatUI);
if (addSpecificDateBtn) addSpecificDateBtn.addEventListener("click", addSpecificDate);
if (addSessionBtn) addSessionBtn.addEventListener("click", addPendingSession);

function resetCourseModal() {
  editingCourseId = null;
  if (courseNameInput) courseNameInput.value = "";
  if (courseCodeInput) courseCodeInput.value = "";
  if (courseInstructorInput) courseInstructorInput.value = "";
  if (courseColorInput) courseColorInput.value = "#2563eb";
  if (courseSemesterInput) courseSemesterInput.value = "";
  if (saveCourseBtn) saveCourseBtn.textContent = "Save Course";
  setColorPreview(courseColorInput, courseColorPreview);
  pendingSessions = [];
  renderPendingSessions();
  resetCourseSessionInputs();
}

function resetTaskModal() {
  editingTaskId = null;
  taskTitleInput.value = "";
  taskDetailsInput.value = "";
  taskCourseInput.value = "";
  taskDateInput.value = "";
  taskPriorityInput.value = "High";
  taskStatusInput.value = "To Do";
  addTaskBtn.textContent = "Save Task";
}

function resetNoteModal() {
  editingNoteId = null;
  noteTitleInput.value = "";
  noteContentInput.value = "";
  if (noteCourseInput) noteCourseInput.value = "";
  if (noteColorInput) noteColorInput.value = "#7c3aed";
  saveNoteBtn.textContent = "Save Note";
  setColorPreview(noteColorInput, noteColorPreview);
}

function resetExamModal() {
  editingExamId = null;
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
  saveExamBtn.textContent = "Save Exam";
}

function resetHolidayModal() {
  editingHolidayId = null;
  holidayTitleInput.value = "";
  holidayStartDateInput.value = "";
  holidayEndDateInput.value = "";
  saveHolidayBtn.textContent = "Save Holiday";
}

function resetEventModal() {
  editingEventId = null;
  eventTitleInput.value = "";
  eventDateInput.value = "";
  eventStartTimeInput.value = "";
  eventEndTimeInput.value = "";
  eventLocationInput.value = "";
  eventDetailsInput.value = "";
  if (eventColorInput) eventColorInput.value = "#7c3aed";
  if (saveEventBtn) saveEventBtn.textContent = "Save Event";
  setColorPreview(eventColorInput, eventColorPreview);
}

function resetAcademicYearModal() {
  editingAcademicYearId = null;
  academicYearNameInput.value = "";
  saveAcademicYearBtn.textContent = "Save Academic Year";
}

function resetSemesterModal() {
  editingSemesterId = null;
  semesterAcademicYearInput.value = "";
  semesterNameInput.value = "";
  semesterStartDateInput.value = "";
  semesterEndDateInput.value = "";
  saveSemesterBtn.textContent = "Save Semester";
}

function fillCourseModal(course) {
  editingCourseId = course.id;
  courseNameInput.value = course.name || "";
  courseCodeInput.value = course.code || "";
  courseInstructorInput.value = course.instructor || "";
  courseColorInput.value = course.color || "#2563eb";
  courseSemesterInput.value = course.semester_id || "";
  saveCourseBtn.textContent = "Update Course";
  setColorPreview(courseColorInput, courseColorPreview);

  pendingSessions = courseSessions
    .filter(function (s) { return s.course_id === course.id; })
    .reduce(function (acc, session) {
      if (session.repeat_type === "weekly") {
        acc.push({
          session_type: session.session_type,
          repeat_type: "weekly",
          day_name: session.day_name,
          session_dates: [],
          start_time: session.start_time,
          end_time: session.end_time,
          location: session.location || ""
        });
      } else {
        const match = acc.find(function (item) {
          return item.repeat_type === "specific"
            && item.session_type === session.session_type
            && item.start_time === session.start_time
            && item.end_time === session.end_time
            && (item.location || "") === (session.location || "");
        });

        if (match) {
          match.session_dates.push(session.session_date);
        } else {
          acc.push({
            session_type: session.session_type,
            repeat_type: "specific",
            day_name: null,
            session_dates: [session.session_date],
            start_time: session.start_time,
            end_time: session.end_time,
            location: session.location || ""
          });
        }
      }
      return acc;
    }, []);

  renderPendingSessions();
  resetCourseSessionInputs();
}

function fillTaskModal(task) {
  editingTaskId = task.id;
  taskTitleInput.value = task.title || "";
  taskDetailsInput.value = task.details || "";
  taskCourseInput.value = task.course_id || "";
  taskDateInput.value = task.due_date || "";
  taskPriorityInput.value = task.priority || "High";
  taskStatusInput.value = task.status || "To Do";
  addTaskBtn.textContent = "Update Task";
}

function fillNoteModal(note) {
  editingNoteId = note.id;
  noteTitleInput.value = note.title || "";
  noteContentInput.value = note.content || "";
  const linkedCourse = getNoteLinkedCourse(note);
  if (noteCourseInput) noteCourseInput.value = linkedCourse ? linkedCourse.id : "";
  if (noteColorInput) {
    noteColorInput.value = linkedCourse && linkedCourse.color ? linkedCourse.color : (note.color || "#7c3aed");
  }
  saveNoteBtn.textContent = "Update Note";
  setColorPreview(noteColorInput, noteColorPreview);
}

function fillExamModal(exam) {
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
  saveExamBtn.textContent = "Update Exam";
}

function fillHolidayModal(holiday) {
  editingHolidayId = holiday.id;
  holidayTitleInput.value = holiday.title || "";
  holidayStartDateInput.value = holiday.start_date || holiday.date || "";
  holidayEndDateInput.value = holiday.end_date || holiday.start_date || holiday.date || "";
  saveHolidayBtn.textContent = "Update Holiday";
}

function fillEventModal(event) {
  editingEventId = event.id;
  eventTitleInput.value = event.title || "";
  eventDateInput.value = event.event_date || "";
  eventStartTimeInput.value = event.start_time || "";
  eventEndTimeInput.value = event.end_time || "";
  eventLocationInput.value = event.location || "";
  eventDetailsInput.value = event.details || "";
  eventColorInput.value = event.color || "#7c3aed";
  saveEventBtn.textContent = "Update Event";
  setColorPreview(eventColorInput, eventColorPreview);
}

function fillAcademicYearModal(year) {
  editingAcademicYearId = year.id;
  academicYearNameInput.value = year.name || "";
  saveAcademicYearBtn.textContent = "Update Academic Year";
}

function fillSemesterModal(semester) {
  editingSemesterId = semester.id;
  semesterAcademicYearInput.value = semester.academic_year_id || "";
  semesterNameInput.value = semester.name || "";
  semesterStartDateInput.value = semester.start_date || "";
  semesterEndDateInput.value = semester.end_date || "";
  saveSemesterBtn.textContent = "Update Semester";
}

async function withSaveLock(lockKey, button, loadingLabel, callback) {
  if (activeSaveRequests.has(lockKey)) return;
  activeSaveRequests.add(lockKey);
  setButtonBusy(button, true, loadingLabel);
  try {
    await callback();
  } finally {
    activeSaveRequests.delete(lockKey);
    setButtonBusy(button, false);
  }
}

async function saveCourse() {
  await withSaveLock("course-save", saveCourseBtn, editingCourseId ? "Updating..." : "Saving...", async function () {
    const name = courseNameInput.value.trim();
    const code = courseCodeInput.value.trim();
    const instructor = courseInstructorInput.value.trim();
    const color = courseColorInput.value;
    const semester_id = courseSemesterInput.value || null;

    if (!name || !code || !semester_id) {
      alert("Please enter course name, code, and semester.");
      return;
    }

    let courseId = editingCourseId;
    let savedCourseRecord = null;

    if (editingCourseId) {
      const updated = await updateRecord("courses", editingCourseId, {
        name,
        code,
        instructor,
        color,
        semester_id
      });
      if (!updated) return;
      courseId = editingCourseId;
      savedCourseRecord = updated;

      const { error: deleteSessionsError } = await supabaseClient
        .from("course_sessions")
        .delete()
        .eq("course_id", editingCourseId)
        .eq("user_id", currentUser.id);

      if (deleteSessionsError) {
        alert(deleteSessionsError.message || "Could not update course sessions.");
        return;
      }

      courseSessions = courseSessions.filter(function (session) {
        return session.course_id !== editingCourseId;
      });
    } else {
      const savedCourse = await insertRecord("courses", {
        name,
        code,
        instructor,
        color,
        semester_id
      });
      if (!savedCourse) return;
      courseId = savedCourse.id;
      savedCourseRecord = savedCourse;
    }

    const insertedSessions = [];

    for (const session of pendingSessions) {
      if (session.repeat_type === "weekly") {
        const inserted = await insertRecord("course_sessions", {
          course_id: courseId,
          session_type: session.session_type,
          repeat_type: "weekly",
          day_name: session.day_name,
          session_date: null,
          start_time: session.start_time,
          end_time: session.end_time,
          location: session.location
        });
        if (!inserted) return;
        insertedSessions.push(inserted);
      } else {
        for (const singleDate of session.session_dates) {
          const inserted = await insertRecord("course_sessions", {
            course_id: courseId,
            session_type: session.session_type,
            repeat_type: "specific",
            day_name: null,
            session_date: singleDate,
            start_time: session.start_time,
            end_time: session.end_time,
            location: session.location
          });
          if (!inserted) return;
          insertedSessions.push(inserted);
        }
      }
    }

    if (editingCourseId) {
      courses = replaceItemInArray(courses, savedCourseRecord);
    } else {
      courses = [...courses, savedCourseRecord];
    }

    courseSessions = [...courseSessions, ...insertedSessions];
    renderAll();
    resetCourseModal();
    closeModal("courseModal");
  });
}

if (saveCourseBtn) saveCourseBtn.addEventListener("click", saveCourse);

async function saveTask() {
  await withSaveLock("task-save", addTaskBtn, editingTaskId ? "Updating..." : "Saving...", async function () {
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

    const saved = editingTaskId
      ? await updateRecord("tasks", editingTaskId, payload)
      : await insertRecord("tasks", payload);

    if (!saved) return;

    if (editingTaskId) {
      tasks = replaceItemInArray(tasks, saved);
    } else {
      tasks = [...tasks, saved];
    }

    resetTaskModal();
    renderAll();
    closeModal("taskModal");
  });
}

if (addTaskBtn) addTaskBtn.addEventListener("click", saveTask);

async function updateTaskStatus(taskId, status) {
  const task = tasks.find(function (item) {
    return item.id === taskId;
  });
  if (!task || task.status === status) return;

  const previousStatus = task.status;
  tasks = tasks.map(function (item) {
    return item.id === taskId ? { ...item, status } : item;
  });
  renderAll();

  const updated = await updateRecord("tasks", taskId, { status });
  if (!updated) {
    tasks = tasks.map(function (item) {
      return item.id === taskId ? { ...item, status: previousStatus } : item;
    });
    renderAll();
    return;
  }

  tasks = replaceItemInArray(tasks, updated);
  renderAll();
}

async function saveNote() {
  await withSaveLock("note-save", saveNoteBtn, editingNoteId ? "Updating..." : "Saving...", async function () {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    const linkedCourse = noteCourseInput ? getCourseById(noteCourseInput.value || "") : null;

    if (!title || !content) {
      alert("Please enter a note title and content.");
      return;
    }

    const payload = {
  title,
  content,
  color: linkedCourse && linkedCourse.color
    ? linkedCourse.color
    : (noteColorInput ? noteColorInput.value : "#7c3aed")
};

    const saved = editingNoteId
      ? await updateRecord("notes", editingNoteId, payload)
      : await insertRecord("notes", payload);

    if (!saved) return;

    if (editingNoteId) {
      notes = replaceItemInArray(notes, saved);
    } else {
      notes = [...notes, saved];
    }

    resetNoteModal();
    renderAll();
    closeModal("noteModal");
  });
}

if (saveNoteBtn) saveNoteBtn.addEventListener("click", saveNote);

async function saveExam() {
  await withSaveLock("exam-save", saveExamBtn, editingExamId ? "Updating..." : "Saving...", async function () {
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

    const saved = editingExamId
      ? await updateRecord("exams", editingExamId, payload)
      : await insertRecord("exams", payload);

    if (!saved) return;

    if (editingExamId) {
      exams = replaceItemInArray(exams, saved);
    } else {
      exams = [...exams, saved];
    }

    resetExamModal();
    renderAll();
    closeModal("examModal");
  });
}

if (saveExamBtn) saveExamBtn.addEventListener("click", saveExam);

async function saveHoliday() {
  await withSaveLock("holiday-save", saveHolidayBtn, editingHolidayId ? "Updating..." : "Saving...", async function () {
    const title = holidayTitleInput.value.trim();
    const start_date = holidayStartDateInput.value || null;
    const end_date = holidayEndDateInput.value || start_date || null;

    if (!title || !start_date) {
      alert("Please enter a holiday name and start date.");
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
      end_date
    };

    const saved = editingHolidayId
      ? await updateRecord("holidays", editingHolidayId, payload)
      : await insertRecord("holidays", { id: generateId(), ...payload });

    if (!saved) return;

    if (editingHolidayId) {
      holidays = replaceItemInArray(holidays, saved);
    } else {
      holidays = [...holidays, saved];
    }

    resetHolidayModal();
    renderAll();
    closeModal("holidayModal");
  });
}

if (saveHolidayBtn) saveHolidayBtn.addEventListener("click", saveHoliday);

async function saveEvent() {
  await withSaveLock("event-save", saveEventBtn, editingEventId ? "Updating..." : "Saving...", async function () {
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
      details: eventDetailsInput.value.trim(),
      color: eventColorInput ? eventColorInput.value : "#7c3aed"
    };

    const saved = editingEventId
      ? await updateRecord("events", editingEventId, payload)
      : await insertRecord("events", payload);

    if (!saved) return;

    if (editingEventId) {
      events = replaceItemInArray(events, saved);
    } else {
      events = [...events, saved];
    }

    resetEventModal();
    renderAll();
    closeModal("eventModal");
  });
}

if (saveEventBtn) saveEventBtn.addEventListener("click", saveEvent);

async function saveAcademicYear() {
  await withSaveLock("year-save", saveAcademicYearBtn, editingAcademicYearId ? "Updating..." : "Saving...", async function () {
    const name = academicYearNameInput.value.trim();

    if (!name) {
      alert("Please enter an academic year.");
      return;
    }

    const payload = { name };
    const saved = editingAcademicYearId
      ? await updateRecord("academic_years", editingAcademicYearId, payload)
      : await insertRecord("academic_years", payload);

    if (!saved) return;

    if (editingAcademicYearId) {
      academicYears = replaceItemInArray(academicYears, saved);
    } else {
      academicYears = [...academicYears, saved];
    }

    resetAcademicYearModal();
    renderAll();
    closeModal("academicYearModal");
  });
}

if (saveAcademicYearBtn) saveAcademicYearBtn.addEventListener("click", saveAcademicYear);

async function saveSemester() {
  await withSaveLock("semester-save", saveSemesterBtn, editingSemesterId ? "Updating..." : "Saving...", async function () {
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

    const saved = editingSemesterId
      ? await updateRecord("semesters", editingSemesterId, payload)
      : await insertRecord("semesters", payload);

    if (!saved) return;

    if (editingSemesterId) {
      semesters = replaceItemInArray(semesters, saved);
    } else {
      semesters = [...semesters, saved];
    }

    resetSemesterModal();
    renderAll();
    closeModal("semesterModal");
  });
}

if (saveSemesterBtn) saveSemesterBtn.addEventListener("click", saveSemester);

function getSessionsForDate(date) {
  const dateKey = toDateKey(date);
  const dayName = dayNameFromDate(date);

  if (isHolidayDate(dateKey)) return [];

  const items = [];

  courses.forEach(function (course) {
    const sessions = getSessionsForCourse(course.id);
    sessions.forEach(function (session) {
      const weeklyMatch = session.repeat_type === "weekly" && session.day_name === dayName && isDateWithinSemester(dateKey, course.semester_id);
      const specificMatch = session.repeat_type === "specific" && session.session_date === dateKey;

      if (weeklyMatch || specificMatch) {
        items.push({
          type: "course",
          id: `course-session-${session.id}-${dateKey}`,
          title: `${course.name} - ${session.session_type}`,
          shortTitle: `${course.name}`,
          monthSubtitle: `${session.session_type}`,
          weekShortTitle: `${course.code || "CODE"} - ${course.name}`,
          timeLabel: `${formatTime(session.start_time)} - ${formatTime(session.end_time)}`,
          startTimeSort: session.start_time || "99:99",
          location: session.location || "",
          color: courseColor(course),
          detailHtml: `
            <p class="meta">Course: ${escapeHtml(course.name)}</p>
            <p class="meta">Code: ${escapeHtml(course.code || "No code")}</p>
            <p class="meta">Instructor: ${escapeHtml(course.instructor || "No instructor")}</p>
            <p class="meta">Semester: ${escapeHtml(getSemesterById(course.semester_id)?.name || "No semester")}</p>
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

function getItemsForDate(dateKey) {
  const dateObj = new Date(dateKey + "T00:00:00");
  const courseItems = getSessionsForDate(dateObj);

  const taskItems = tasks
    .filter(function (task) {
      return task.due_date === dateKey && !isTaskArchived(task);
    })
    .map(function (task) {
      const course = getCourseById(task.course_id);
      return {
        type: "task",
        id: `task-${task.id}`,
        title: `Task: ${task.title}`,
        shortTitle: `Task: ${task.title}`,
        monthSubtitle: task.priority || "Task",
        weekShortTitle: `Task: ${task.title}`,
        timeLabel: `Due date${course ? ` · ${course.code}` : ""}`,
        startTimeSort: "97:00",
        location: "",
        color: getTaskColor(task),
        detailHtml: `
          <p class="meta">Details: ${escapeHtml(task.details || "No details")}</p>
          <p class="meta">Course: ${escapeHtml(course ? `${course.code} — ${course.name}` : "No course")}</p>
          <p class="meta">Due: ${escapeHtml(task.due_date ? formatDate(task.due_date) : "No due date")}</p>
          <p class="meta">Priority: ${escapeHtml(task.priority || "No priority")}</p>
          <p class="meta">Status: ${escapeHtml(task.status || "To Do")}</p>
        `
      };
    });

  const examItems = exams
    .filter(function (exam) { return exam.exam_date === dateKey; })
    .map(function (exam) {
      const endTime = exam.duration_minutes ? calculateExamEndTime(exam.exam_time, exam.duration_minutes) : "";
      const course = getExamCourse(exam);
      const courseCode = course?.code || "";
      return {
        type: "exam",
        id: `exam-${exam.id}`,
        title: `Exam: ${exam.title}`,
        shortTitle: `Exam: ${exam.title}`,
        monthSubtitle: courseCode || exam.course || "Exam",
        weekShortTitle: `${courseCode ? `${courseCode} — ` : ""}Exam: ${exam.title}`,
        timeLabel: exam.exam_time ? `${formatTime(exam.exam_time)}${endTime ? " - " + formatTime(endTime) : ""}` : "Time not set",
        startTimeSort: exam.exam_time || "99:99",
        location: exam.place || "",
        color: getExamColor(exam),
        detailHtml: `
          <p class="meta">Course: ${escapeHtml(getExamCourseLabel(exam))}</p>
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
    .filter(function (event) { return event.event_date === dateKey; })
    .map(function (event) {
      return {
        type: "event",
        id: `event-${event.id}`,
        title: event.title,
        shortTitle: event.title,
        timeLabel: event.start_time ? `${formatTime(event.start_time)}${event.end_time ? " - " + formatTime(event.end_time) : ""}` : "Time not set",
        startTimeSort: event.start_time || "99:99",
        location: event.location || "",
        color: event.color || "#7c3aed",
        detailHtml: `
          <p class="meta">Date: ${escapeHtml(formatDate(event.event_date))}</p>
          <p class="meta">Time: ${escapeHtml(event.start_time ? formatTime(event.start_time) : "No time")}${event.end_time ? " - " + escapeHtml(formatTime(event.end_time)) : ""}</p>
          <p class="meta">Location: ${escapeHtml(event.location || "No location")}</p>
          <p class="meta">Details: ${escapeHtml(event.details || "No details")}</p>
        `
      };
    });

  const holidayItems = holidays
    .filter(function (holiday) { return buildHolidayDates(holiday).includes(dateKey); })
    .map(function (holiday) {
      return {
        type: "holiday",
        id: `holiday-${holiday.id}`,
        title: `Holiday: ${holiday.title}`,
        shortTitle: `Holiday: ${holiday.title}`,
        timeLabel: "Holiday",
        startTimeSort: "99:99",
        location: "",
        color: "#dc2626",
        detailHtml: `
          <p class="meta">Start: ${escapeHtml(formatDate(holiday.start_date || holiday.date))}</p>
          <p class="meta">End: ${escapeHtml(formatDate(holiday.end_date || holiday.start_date || holiday.date))}</p>
          <p class="meta">Courses will not appear during this holiday.</p>
        `
      };
    });

  return courseItems
    .concat(taskItems, examItems, eventItems, holidayItems)
    .sort(function (a, b) {
      const timeCompare = (a.startTimeSort || "99:99").localeCompare(b.startTimeSort || "99:99");
      if (timeCompare !== 0) return timeCompare;
      return a.title.localeCompare(b.title);
    });
}

function openDetailModal(title, html, recordMeta) {
  if (detailTitle) detailTitle.textContent = title || "Details";
  if (detailBody) detailBody.innerHTML = html || '<p class="meta">No details.</p>';
  activeDetailRecord = recordMeta || null;

  if (detailActions && recordMeta && recordMeta.canEdit) {
    detailActions.classList.remove("hidden");
  } else if (detailActions) {
    detailActions.classList.add("hidden");
  }

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
      <button
        class="day-card clickable-card ${item.isPast ? "past-item" : ""}"
        type="button"
        data-detail-title="${escapeHtml(item.title)}"
        data-detail-html="${escapeHtml(item.detailHtml)}"
      >
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
    .filter(shouldShowTaskOnDashboard)
    .slice()
    .sort(compareTaskDates)
    .slice(0, 5);

  if (dashboardUpcomingTasks) {
    dashboardUpcomingTasks.innerHTML = upcomingTasks.length
      ? upcomingTasks.map(function (task) {
          const course = getCourseById(task.course_id);
          const html = `
            <p class="meta">Details: ${escapeHtml(task.details || "No details")}</p>
            <p class="meta">Course: ${escapeHtml(course ? `${course.code} — ${course.name}` : "No course")}</p>
            <p class="meta">Due: ${escapeHtml(task.due_date ? formatDate(task.due_date) : "No due date")}</p>
            <p class="meta">Priority: ${escapeHtml(task.priority || "No priority")}</p>
            <p class="meta">Status: ${escapeHtml(task.status || "To Do")}</p>
          `;
          return `
            <button
              class="day-card clickable-card"
              type="button"
              data-detail-title="${escapeHtml(task.title)}"
              data-detail-html="${escapeHtml(html)}"
            >
              <h4 class="task-title">${escapeHtml(task.title)}</h4>
              <p class="meta">${escapeHtml(task.due_date ? formatDate(task.due_date) : "No due date")}</p>
            </button>
          `;
        }).join("")
      : '<div class="empty-state">No upcoming tasks.</div>';
  }

  const upcomingExams = exams
    .filter(shouldShowExamOnDashboard)
    .slice()
    .sort(compareExamDates)
    .slice(0, 5);

  if (dashboardUpcomingExams) {
    dashboardUpcomingExams.innerHTML = upcomingExams.length
      ? upcomingExams.map(function (exam) {
          const html = `
            <p class="meta">Course: ${escapeHtml(getExamCourseLabel(exam))}</p>
            <p class="meta">Date: ${escapeHtml(exam.exam_date ? formatDate(exam.exam_date) : "No date")}</p>
            <p class="meta">Start time: ${escapeHtml(exam.exam_time ? formatTime(exam.exam_time) : "No time")}</p>
            <p class="meta">Duration: ${escapeHtml(exam.duration_minutes ? exam.duration_minutes + " minutes" : "No duration")}</p>
            <p class="meta">Place: ${escapeHtml(exam.place || "No place")}</p>
            <p class="meta">Notes: ${escapeHtml(exam.notes || "No notes")}</p>
          `;
          return `
            <button
              class="day-card clickable-card"
              type="button"
              data-detail-title="${escapeHtml(exam.title)}"
              data-detail-html="${escapeHtml(html)}"
            >
              <h4 class="task-title">${escapeHtml(exam.title)}</h4>
              <p class="meta">${escapeHtml(exam.exam_date ? formatDate(exam.exam_date) : "No date")}</p>
              <p class="meta">${escapeHtml(exam.exam_time ? formatTime(exam.exam_time) : "No time")}</p>
            </button>
          `;
        }).join("")
      : '<div class="empty-state">No upcoming exams.</div>';
  }
}

function renderCourses() {
  if (!coursesList) return;

  if (!courses.length) {
    coursesList.className = "stack-list";
    coursesList.innerHTML = '<div class="empty-state">No courses yet.</div>';
    return;
  }

  coursesList.className = "stack-list cards-grid-3";

  coursesList.innerHTML = courses.map(function (course) {
    const sessions = getSessionsForCourse(course.id);
    const semester = semesters.find(function (s) { return s.id === course.semester_id; });

    const detailHtml = `
      <p class="meta">Code: ${escapeHtml(course.code || "No code")}</p>
      <p class="meta">Instructor: ${escapeHtml(course.instructor || "No instructor")}</p>
      <p class="meta">Semester: ${escapeHtml(semester ? semester.name : "No semester")}</p>
      <p class="meta">Sessions: ${escapeHtml(String(sessions.length))}</p>
    `;

    return `
      <div class="course-card compact-card">
        <div class="course-color-line" style="background:${escapeHtml(courseColor(course))};"></div>
        <div class="course-header-line">
          <div>
            <div class="badge-row">
              <span class="course-badge" style="background:${escapeHtml(courseColor(course))};">
                <span class="course-code-chip">${escapeHtml(course.code || "CODE")}</span>
              </span>
            </div>
            <h4 class="course-name-strong">${escapeHtml(course.name)}</h4>
            <p class="meta">${escapeHtml(course.instructor || "No instructor")}</p>
            <p class="meta">Semester: ${escapeHtml(semester ? semester.name : "No semester")}</p>
          </div>
          <button
            class="edit-menu-btn"
            type="button"
            data-open-record-detail="1"
            data-record-type="course"
            data-record-id="${escapeHtml(course.id)}"
            data-detail-title="${escapeHtml(course.name)}"
            data-detail-html="${escapeHtml(detailHtml)}"
            aria-label="Open course actions"
          >⋯</button>
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

function getFilteredAndSortedActiveTasks() {
  let visibleTasks = tasks.filter(function (task) {
    return !isTaskArchived(task);
  });

  if (taskCourseFilter && taskCourseFilter.value) {
    visibleTasks = visibleTasks.filter(function (task) {
      return task.course_id === taskCourseFilter.value;
    });
  }

  if (taskPriorityFilter && taskPriorityFilter.value) {
    visibleTasks = visibleTasks.filter(function (task) {
      return task.priority === taskPriorityFilter.value;
    });
  }

  const sortMode = taskSortFilter ? taskSortFilter.value : "date";

  visibleTasks = visibleTasks.slice().sort(function (a, b) {
    if (sortMode === "course") {
      const courseA = getCourseById(a.course_id);
      const courseB = getCourseById(b.course_id);
      const labelA = courseA ? `${courseA.code} ${courseA.name}` : "ZZZ No course";
      const labelB = courseB ? `${courseB.code} ${courseB.name}` : "ZZZ No course";
      const first = labelA.localeCompare(labelB);
      if (first !== 0) return first;
      return compareTaskDates(a, b);
    }

    if (sortMode === "priority") {
      const first = taskPriorityRank(a.priority) - taskPriorityRank(b.priority);
      if (first !== 0) return first;
      return compareTaskDates(a, b);
    }

    return compareTaskDates(a, b);
  });

  return visibleTasks;
}

function renderTasks() {
  if (!plannerList) return;

  const visibleTasks = getFilteredAndSortedActiveTasks();
  const archivedTasks = tasks
    .filter(function (task) {
      return isTaskArchived(task);
    })
    .slice()
    .sort(compareTaskDates);

  plannerList.className = "stack-list";

  if (!visibleTasks.length && !archivedTasks.length) {
    plannerList.innerHTML = '<div class="empty-state">No tasks yet.</div>';
    return;
  }

  const renderTaskCard = function (task, archived) {
    const course = getCourseById(task.course_id);
    const priorityClass = task.priority === "High"
      ? "priority-high"
      : task.priority === "Medium"
        ? "priority-medium"
        : "priority-low";
    const statusClass = task.status === "Done"
      ? "status-done"
      : task.status === "In Progress"
        ? "status-progress"
        : "status-todo";
    const taskAccent = getTaskColor(task);
    const noCourseClass = course ? "" : "no-course-task";

    const detailHtml = `
      <p class="meta">Details: ${escapeHtml(task.details || "No details")}</p>
      <p class="meta">Course: ${escapeHtml(course ? `${course.code} — ${course.name}` : "No course")}</p>
      <p class="meta">Due: ${escapeHtml(task.due_date ? formatDate(task.due_date) : "No due date")}</p>
      <p class="meta">Priority: ${escapeHtml(task.priority || "No priority")}</p>
      <p class="meta">Status: ${escapeHtml(task.status || "To Do")}</p>
    `;

    return `
      <div class="task-card compact-card ${noCourseClass} ${archived ? "past-item" : ""}">
        <div class="task-color-line" style="background:${escapeHtml(taskAccent)};"></div>
        <div class="task-header-line">
          <div>
            <div class="badge-row">
              <span class="priority-badge ${priorityClass}">${escapeHtml(task.priority || "No priority")}</span>
              <span class="status-badge ${statusClass}">${escapeHtml(task.status || "To Do")}</span>
              ${archived ? '<span class="archive-badge">Past task</span>' : ""}
            </div>
            <h4 class="task-title ${task.status === "Done" ? "task-done-title" : ""}">${escapeHtml(task.title)}</h4>
            <p class="meta">${escapeHtml(task.details || "No details")}</p>
            <p class="meta">${escapeHtml(course ? `${course.code} — ${course.name}` : "No course")}</p>
            <p class="meta">${escapeHtml(task.due_date ? formatDate(task.due_date) : "No due date")}</p>
            <div class="task-quick-actions">
              <button class="task-status-btn ${task.status === "To Do" ? "active-status-btn" : ""}" type="button" data-task-status-id="${escapeHtml(task.id)}" data-task-status-value="To Do">To Do</button>
              <button class="task-status-btn ${task.status === "In Progress" ? "active-status-btn" : ""}" type="button" data-task-status-id="${escapeHtml(task.id)}" data-task-status-value="In Progress">In Progress</button>
              <button class="task-status-btn ${task.status === "Done" ? "active-status-btn" : ""}" type="button" data-task-status-id="${escapeHtml(task.id)}" data-task-status-value="Done">Done</button>
            </div>
          </div>
          <button
            class="edit-menu-btn"
            type="button"
            data-open-record-detail="1"
            data-record-type="task"
            data-record-id="${escapeHtml(task.id)}"
            data-detail-title="${escapeHtml(task.title)}"
            data-detail-html="${escapeHtml(detailHtml)}"
            aria-label="Open task actions"
          >⋯</button>
        </div>
      </div>
    `;
  };

  plannerList.innerHTML = `
    ${
      visibleTasks.length
        ? `<div class="cards-grid-3">${visibleTasks.map(function (task) { return renderTaskCard(task, false); }).join("")}</div>`
        : '<div class="empty-state">No tasks match your filter.</div>'
    }

    ${
      archivedTasks.length
        ? `
          <div class="archived-section">
            <button class="archive-toggle-btn" type="button" data-toggle-archive="tasks">
              ${showArchivedTasks ? "Hide past tasks" : `Show past tasks (${archivedTasks.length})`}
            </button>

            ${
              showArchivedTasks
                ? `<div class="archive-list cards-grid-3">${archivedTasks.map(function (task) { return renderTaskCard(task, true); }).join("")}</div>`
                : ""
            }
          </div>
        `
        : ""
    }
  `;
}

function renderNotes() {
  if (!notesList) return;

  if (!notes.length) {
    notesList.className = "stack-list";
    notesList.innerHTML = '<div class="empty-state">No notes yet.</div>';
    return;
  }

  notesList.className = "stack-list cards-grid-3";

  notesList.innerHTML = notes.map(function (note) {
    const course = getNoteLinkedCourse(note);
    const noteColor = course ? courseColor(course) : (note.color || "#7c3aed");

    const detailHtml = `
      <p class="meta">Course: ${escapeHtml(course ? `${course.code} — ${course.name}` : "No course")}</p>
      <p class="meta">${escapeHtml(note.content || "No content")}</p>
    `;

    return `
      <div class="note-card compact-card ${course ? "course-note" : ""}" style="--note-color:${escapeHtml(noteColor)};">
        <div class="note-color-line" style="background:${escapeHtml(noteColor)};"></div>
        <div class="note-header-line">
          <div>
            <h4 class="task-title">${escapeHtml(note.title)}</h4>
            <p class="meta note-course-label">${escapeHtml(course ? `${course.code} — ${course.name}` : "General note")}</p>
            <p class="meta">${escapeHtml(note.content || "No content")}</p>
          </div>
          <button
            class="edit-menu-btn"
            type="button"
            data-open-record-detail="1"
            data-record-type="note"
            data-record-id="${escapeHtml(note.id)}"
            data-detail-title="${escapeHtml(note.title)}"
            data-detail-html="${escapeHtml(detailHtml)}"
            aria-label="Open note actions"
          >⋯</button>
        </div>
      </div>
    `;
  }).join("");
}

function renderExams() {
  if (!examsList) return;

  const activeExams = exams
    .filter(function (exam) {
      return !isPastExam(exam);
    })
    .slice()
    .sort(compareExamDates);

  const archivedExams = exams
    .filter(function (exam) {
      return isPastExam(exam);
    })
    .slice()
    .sort(compareExamDates);

  examsList.className = "stack-list";

  const renderExamCard = function (exam, archived) {
    const endTime = exam.duration_minutes ? calculateExamEndTime(exam.exam_time, exam.duration_minutes) : "";
    const examColor = getExamColor(exam);
    const course = getExamCourse(exam);

    const detailHtml = `
      <p class="meta">Course: ${escapeHtml(getExamCourseLabel(exam))}</p>
      <p class="meta">Date: ${escapeHtml(exam.exam_date ? formatDate(exam.exam_date) : "No date")}</p>
      <p class="meta">Time: ${escapeHtml(exam.exam_time ? formatTime(exam.exam_time) : "No time")}${endTime ? " - " + escapeHtml(formatTime(endTime)) : ""}</p>
      <p class="meta">Duration: ${escapeHtml(exam.duration_minutes ? exam.duration_minutes + " minutes" : "No duration")}</p>
      <p class="meta">Place: ${escapeHtml(exam.place || "No place")}</p>
      <p class="meta">Seat: ${escapeHtml(exam.seat_number || "No seat number")}</p>
      <p class="meta">Grade: ${escapeHtml(exam.grade || "No grade")}</p>
      <p class="meta">Mark: ${escapeHtml(exam.mark ?? "No mark")}</p>
      <p class="meta">Notes: ${escapeHtml(exam.notes || "No notes")}</p>
    `;

    return `
      <div class="exam-card compact-card ${archived ? "past-item" : ""}">
        <div class="exam-color-line" style="background:${escapeHtml(examColor)};"></div>
        <div class="exam-header-line">
          <div>
            <div class="badge-row">
              ${
                course
                  ? `<span class="exam-course-badge" style="background:${escapeHtml(examColor)};">${escapeHtml(course.code || "CODE")}</span>`
                  : '<span class="exam-course-badge" style="background:#dc2626;">EXAM</span>'
              }
              ${archived ? '<span class="archive-badge">Past exam</span>' : ""}
            </div>
            <h4 class="task-title">${escapeHtml(exam.title)}</h4>
            <p class="meta">Course: ${escapeHtml(getExamCourseLabel(exam))}</p>
            <p class="meta">Date: ${escapeHtml(exam.exam_date ? formatDate(exam.exam_date) : "No date")}</p>
            <p class="meta">Time: ${escapeHtml(exam.exam_time ? formatTime(exam.exam_time) : "No time")}${endTime ? " - " + escapeHtml(formatTime(endTime)) : ""}</p>
            <p class="meta">Place: ${escapeHtml(exam.place || "No place")}</p>
          </div>
          <button
            class="edit-menu-btn"
            type="button"
            data-open-record-detail="1"
            data-record-type="exam"
            data-record-id="${escapeHtml(exam.id)}"
            data-detail-title="${escapeHtml(exam.title)}"
            data-detail-html="${escapeHtml(detailHtml)}"
            aria-label="Open exam actions"
          >⋯</button>
        </div>
      </div>
    `;
  };

  if (!activeExams.length && !archivedExams.length) {
    examsList.innerHTML = '<div class="empty-state">No exams yet.</div>';
    return;
  }

  examsList.innerHTML = `
    ${
      activeExams.length
        ? `<div class="cards-grid-3">${activeExams.map(function (exam) { return renderExamCard(exam, false); }).join("")}</div>`
        : '<div class="empty-state">No upcoming exams.</div>'
    }

    ${
      archivedExams.length
        ? `
          <div class="archived-section">
            <button class="archive-toggle-btn" type="button" data-toggle-archive="exams">
              ${showArchivedExams ? "Hide past exams" : `Show past exams (${archivedExams.length})`}
            </button>

            ${
              showArchivedExams
                ? `<div class="archive-list cards-grid-3">${archivedExams.map(function (exam) { return renderExamCard(exam, true); }).join("")}</div>`
                : ""
            }
          </div>
        `
        : ""
    }
  `;
}

function renderHolidays() {
  if (!holidaysList) return;

  if (!holidays.length) {
    holidaysList.className = "stack-list";
    holidaysList.innerHTML = '<div class="empty-state">No holidays yet.</div>';
    return;
  }

  holidaysList.className = "stack-list cards-grid-2";

  holidaysList.innerHTML = holidays
    .slice()
    .sort(function (a, b) {
      return (a.start_date || a.date || "").localeCompare(b.start_date || b.date || "");
    })
    .map(function (holiday) {
      const detailHtml = `
        <p class="meta">Start: ${escapeHtml(holiday.start_date ? formatDate(holiday.start_date) : holiday.date ? formatDate(holiday.date) : "No start date")}</p>
        <p class="meta">End: ${escapeHtml(holiday.end_date ? formatDate(holiday.end_date) : holiday.start_date ? formatDate(holiday.start_date) : holiday.date ? formatDate(holiday.date) : "No end date")}</p>
        <p class="meta">Courses will not appear during this holiday.</p>
      `;
      return `
  <div class="holiday-card compact-card">
    <div class="holiday-color-line holiday-accent"></div>
    <div class="holiday-header-line">
      <div>
        <h4 class="task-title">${escapeHtml(holiday.title)}</h4>
        <p class="meta">Start: ${escapeHtml(holiday.start_date ? formatDate(holiday.start_date) : holiday.date ? formatDate(holiday.date) : "No start date")}</p>
        <p class="meta">End: ${escapeHtml(holiday.end_date ? formatDate(holiday.end_date) : holiday.start_date ? formatDate(holiday.start_date) : holiday.date ? formatDate(holiday.date) : "No end date")}</p>
      </div>
      <button
        class="edit-menu-btn"
        type="button"
        data-open-record-detail="1"
        data-record-type="holiday"
        data-record-id="${escapeHtml(holiday.id)}"
        data-detail-title="${escapeHtml(holiday.title)}"
        data-detail-html="${escapeHtml(detailHtml)}"
        aria-label="Open holiday actions"
      >⋯</button>
    </div>
  </div>
`;
    }).join("");
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

    const detailHtml = `<p class="meta">Academic year: ${escapeHtml(year.name)}</p>`;

    return `
      <div class="academic-card">
        <div class="card-head">
          <div>
            <h4 class="task-title">${escapeHtml(year.name)}</h4>
          </div>
          <button
            class="edit-menu-btn"
            type="button"
            data-open-record-detail="1"
            data-record-type="academic-year"
            data-record-id="${escapeHtml(year.id)}"
            data-detail-title="${escapeHtml(year.name)}"
            data-detail-html="${escapeHtml(detailHtml)}"
            aria-label="Open academic year actions"
          >⋯</button>
        </div>

        <div class="task-card-expanded">
          ${
            yearSemesters.length
              ? yearSemesters.map(function (semester) {
                  const semesterDetailHtml = `
                    <p class="meta">Academic year: ${escapeHtml(year.name)}</p>
                    <p class="meta">Semester: ${escapeHtml(semester.name)}</p>
                    <p class="meta">Start: ${escapeHtml(semester.start_date ? formatDate(semester.start_date) : "No start")}</p>
                    <p class="meta">End: ${escapeHtml(semester.end_date ? formatDate(semester.end_date) : "No end")}</p>
                  `;
                  return `
                    <div class="semester-box">
                      <div class="card-head">
                        <div>
                          <strong>${escapeHtml(semester.name)}</strong>
                          <p class="meta">${escapeHtml(semester.start_date ? formatDate(semester.start_date) : "No start")} - ${escapeHtml(semester.end_date ? formatDate(semester.end_date) : "No end")}</p>
                        </div>
                        <button
                          class="edit-menu-btn"
                          type="button"
                          data-open-record-detail="1"
                          data-record-type="semester"
                          data-record-id="${escapeHtml(semester.id)}"
                          data-detail-title="${escapeHtml(semester.name)}"
                          data-detail-html="${escapeHtml(semesterDetailHtml)}"
                          aria-label="Open semester actions"
                        >⋯</button>
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

function buildCalendarItemHtml(item, compact) {
  const isTask = item.type === "task";
  const style = isTask
    ? `style="--task-color:${escapeHtml(item.color || "#64748b")};"`
    : `style="background:${escapeHtml(item.color || "#64748b")}; color:${item.color === "#ffffff" ? "#0f172a" : "#ffffff"};${item.color === "#ffffff" ? " border:1px solid #cbd5e1;" : ""}"`;

  if (compact) {
    const compactTitle = item.shortTitle || item.title;
    const compactSubtitle =
      item.type === "course" || item.type === "exam" || item.type === "task"
        ? (item.monthSubtitle || "")
        : (item.startTimeSort && item.startTimeSort !== "99:99" ? formatTime(item.startTimeSort) : "");

    return `
      <button
        class="calendar-item calendar-item-compact ${item.type === "holiday" ? "holiday-accent" : ""} ${item.type === "task" ? "calendar-task-item" : ""} ${item.type === "exam" ? "calendar-exam-item" : ""}"
        ${style}
        type="button"
        data-detail-title="${escapeHtml(item.title)}"
        data-detail-html="${escapeHtml(item.detailHtml)}"
        title="${escapeHtml(item.title)}"
      >
        <span class="calendar-item-title">${escapeHtml(compactTitle)}</span>
        ${compactSubtitle ? `<span class="calendar-item-subtitle">${escapeHtml(compactSubtitle)}</span>` : ""}
      </button>
    `;
  }

  const fullTitle =
    item.type === "course" || item.type === "exam" || item.type === "task"
      ? (item.weekShortTitle || item.title)
      : (item.title || "");

  return `
    <button
      class="calendar-item ${item.type === "holiday" ? "holiday-accent" : ""} ${item.type === "task" ? "calendar-task-item" : ""} ${item.type === "exam" ? "calendar-exam-item" : ""}"
      ${style}
      type="button"
      data-detail-title="${escapeHtml(item.title)}"
      data-detail-html="${escapeHtml(item.detailHtml)}"
    >
      <span class="calendar-item-title">${escapeHtml(fullTitle)}</span>
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
    const isTodayCell = isSameDate(cellDate, today);
    const isOtherMonth = cellDate.getMonth() !== month;
    const holiday = getHolidayForDate(key);

    cells.push(`
      <div class="calendar-cell calendar-cell-fixed ${isTodayCell ? "today" : ""} ${isOtherMonth ? "other-month" : ""} ${holiday ? "holiday-cell" : ""}">
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
              ${items.length - 3} more
            </button>
          ` : ""}
        </div>
      </div>
    `);
  }

  calendarGrid.innerHTML = cells.join("");
  calendarMonthLabel.textContent = currentCalendarDate.toLocaleDateString([], { month: "long", year: "numeric" });
}

function renderWeekView() {
  if (!weekCalendarGrid || !calendarMonthLabel) return;

  const today = new Date(currentCalendarDate);
  const day = today.getDay();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - day);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const columns = [];

  for (let i = 0; i < 7; i += 1) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    const key = toDateKey(date);
    const items = getItemsForDate(key);
    const holiday = getHolidayForDate(key);

    columns.push(`
      <div class="week-day-column ${holiday ? "holiday-cell" : ""}">
        <div class="week-day-title">${escapeHtml(date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }))}</div>
        <div class="week-items">
          ${items.length ? items.map(function (item) { return buildCalendarItemHtml(item, false); }).join("") : '<div class="empty-state">No items</div>'}
        </div>
      </div>
    `);
  }

  weekCalendarGrid.innerHTML = columns.join("");
  calendarMonthLabel.textContent = formatWeekRangeCompact(weekStart, weekEnd);
}

function renderDayView() {
  if (!dayCalendarGrid || !calendarMonthLabel) return;

  const key = toDateKey(currentCalendarDate);
  const items = getItemsForDate(key);
  const holiday = getHolidayForDate(key);

  dayCalendarGrid.innerHTML = `
    <div class="day-view-card ${holiday ? "holiday-cell" : ""}">
      <div class="day-view-title">${escapeHtml(currentCalendarDate.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" }))}</div>
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

function getRecordMeta(type, id) {
  return { type, id, canEdit: true };
}

function handleEditRecord(record) {
  if (!record) return;
  closeModal("detailModal");

  if (record.type === "course") {
    const item = courses.find(function (x) { return x.id === record.id; });
    if (!item) return;
    fillCourseModal(item);
    openModal("courseModal");
  }

  if (record.type === "task") {
    const item = tasks.find(function (x) { return x.id === record.id; });
    if (!item) return;
    fillTaskModal(item);
    openModal("taskModal");
  }

  if (record.type === "note") {
    const item = notes.find(function (x) { return x.id === record.id; });
    if (!item) return;
    fillNoteModal(item);
    openModal("noteModal");
  }

  if (record.type === "exam") {
    const item = exams.find(function (x) { return x.id === record.id; });
    if (!item) return;
    fillExamModal(item);
    openModal("examModal");
  }

  if (record.type === "holiday") {
    const item = holidays.find(function (x) { return x.id === record.id; });
    if (!item) return;
    fillHolidayModal(item);
    openModal("holidayModal");
  }

  if (record.type === "event") {
    const item = events.find(function (x) { return x.id === record.id; });
    if (!item) return;
    fillEventModal(item);
    openModal("eventModal");
  }

  if (record.type === "academic-year") {
    const item = academicYears.find(function (x) { return x.id === record.id; });
    if (!item) return;
    fillAcademicYearModal(item);
    openModal("academicYearModal");
  }

  if (record.type === "semester") {
    const item = semesters.find(function (x) { return x.id === record.id; });
    if (!item) return;
    fillSemesterModal(item);
    openModal("semesterModal");
  }
}

async function handleDeleteRecord(record) {
  if (!record) return;
  const ok = confirm("Delete this item?");
  if (!ok) return;

  let deleted = false;

  if (record.type === "course") deleted = await deleteCourseWithSessions(record.id);
  if (record.type === "task") {
    deleted = await deleteRecord("tasks", record.id);
    if (deleted) tasks = removeItemFromArray(tasks, record.id);
  }
  if (record.type === "note") {
    deleted = await deleteRecord("notes", record.id);
    if (deleted) notes = removeItemFromArray(notes, record.id);
  }
  if (record.type === "exam") {
    deleted = await deleteRecord("exams", record.id);
    if (deleted) exams = removeItemFromArray(exams, record.id);
  }
  if (record.type === "holiday") {
    deleted = await deleteRecord("holidays", record.id);
    if (deleted) holidays = removeItemFromArray(holidays, record.id);
  }
  if (record.type === "event") {
    deleted = await deleteRecord("events", record.id);
    if (deleted) events = removeItemFromArray(events, record.id);
  }
  if (record.type === "academic-year") {
    deleted = await deleteRecord("academic_years", record.id);
    if (deleted) {
      academicYears = removeItemFromArray(academicYears, record.id);
      semesters = semesters.filter(function (semester) {
        return semester.academic_year_id !== record.id;
      });
    }
  }
  if (record.type === "semester") {
    deleted = await deleteRecord("semesters", record.id);
    if (deleted) {
      semesters = removeItemFromArray(semesters, record.id);
      courses = courses.map(function (course) {
        return course.semester_id === record.id ? { ...course, semester_id: null } : course;
      });
    }
  }

  if (!deleted) return;

  closeModal("detailModal");
  hideDetailActions();
  renderAll();
}

if (detailEditBtn) {
  detailEditBtn.addEventListener("click", function () {
    handleEditRecord(activeDetailRecord);
  });
}

if (detailDeleteBtn) {
  detailDeleteBtn.addEventListener("click", function () {
    handleDeleteRecord(activeDetailRecord);
  });
}

document.addEventListener("click", async function (e) {
  const statusBtn = e.target.closest("[data-task-status-id]");
  if (statusBtn) {
    await updateTaskStatus(
      statusBtn.dataset.taskStatusId,
      statusBtn.dataset.taskStatusValue
    );
    return;
  }

  const archiveToggle = e.target.closest("[data-toggle-archive]");
  if (archiveToggle) {
    if (archiveToggle.dataset.toggleArchive === "tasks") {
      showArchivedTasks = !showArchivedTasks;
      renderTasks();
    }
    if (archiveToggle.dataset.toggleArchive === "exams") {
      showArchivedExams = !showArchivedExams;
      renderExams();
    }
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

  const recordDetailTrigger = e.target.closest("[data-open-record-detail]");
  if (recordDetailTrigger) {
    const title = recordDetailTrigger.dataset.detailTitle || "Details";
    const html = decodeHtml(recordDetailTrigger.dataset.detailHtml || "");
    const type = recordDetailTrigger.dataset.recordType;
    const id = recordDetailTrigger.dataset.recordId;
    openDetailModal(title, html, getRecordMeta(type, id));
    return;
  }

  const detailTrigger = e.target.closest("[data-detail-title]");
  if (detailTrigger) {
    if (detailTrigger.hasAttribute("data-open-record-detail")) return;
    const title = detailTrigger.dataset.detailTitle || "Details";
    const html = decodeHtml(detailTrigger.dataset.detailHtml || "");
    openDetailModal(title, html, null);
  }
});

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

if (noteColorInput) {
  noteColorInput.addEventListener("input", function () {
    setColorPreview(noteColorInput, noteColorPreview);
  });
}

if (noteCourseInput) {
  noteCourseInput.addEventListener("change", syncNoteColorToSelectedCourse);
}

if (taskSortFilter) {
  taskSortFilter.addEventListener("change", renderTasks);
}
if (taskCourseFilter) {
  taskCourseFilter.addEventListener("change", renderTasks);
}
if (taskPriorityFilter) {
  taskPriorityFilter.addEventListener("change", renderTasks);
}

document.querySelector('[data-open-modal="courseModal"]')?.addEventListener("click", resetCourseModal);
document.querySelector('[data-open-modal="taskModal"]')?.addEventListener("click", resetTaskModal);
document.querySelector('[data-open-modal="noteModal"]')?.addEventListener("click", resetNoteModal);
document.querySelector('[data-open-modal="examModal"]')?.addEventListener("click", resetExamModal);
document.querySelector('[data-open-modal="holidayModal"]')?.addEventListener("click", resetHolidayModal);
document.querySelector('[data-open-modal="eventModal"]')?.addEventListener("click", resetEventModal);
document.querySelector('[data-open-modal="academicYearModal"]')?.addEventListener("click", resetAcademicYearModal);
document.querySelector('[data-open-modal="semesterModal"]')?.addEventListener("click", resetSemesterModal);

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
  setColorPreview(courseColorInput, courseColorPreview);
  setColorPreview(eventColorInput, eventColorPreview);
  setColorPreview(noteColorInput, noteColorPreview);
}

getCurrentSession();
showTab("dashboard");
