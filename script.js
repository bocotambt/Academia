document.addEventListener("DOMContentLoaded", function () {
  const SUPABASE_URL = "https://fdijdgvsqfzgzzwlvqff.supabase.co";
  const SUPABASE_KEY = "sb_publishable_qkCIilGuoTE3FgWWzeqKLw_4R9ERznE";
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  function $(id) {
    return document.getElementById(id);
  }

  let currentUser = null;
  let academicYears = [];
  let semesters = [];
  let courses = [];
  let notes = [];
  let tasks = [];
  let exams = [];
  let courseSessions = [];
  let currentCalendarDate = new Date();
  let currentCalendarView = "month";
  let editingTaskId = null;
  let editingExamId = null;
  let editingCourseId = null;
  let editingNoteId = null;
  let editingAcademicYearId = null;
  let editingSemesterId = null;
  let pendingSessions = [];

  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  const tabNav = $("tabNav");
  const menuToggleBtn = $("menuToggleBtn");
  const brandUserArea = $("brandUserArea");
  const brandSignedInText = $("brandSignedInText");
  const authBox = $("authBox");
  const openModalButtons = document.querySelectorAll(".open-modal-btn");
  const closeModalButtons = document.querySelectorAll(".close-modal-btn");

  const pageTitle = $("pageTitle");
  const plannerList = $("plannerList");
  const coursesList = $("coursesList");
  const notesList = $("notesList");
  const examsList = $("examsList");
  const academicYearsList = $("academicYearsList");
  const dashboardUpcomingTasks = $("dashboardUpcomingTasks");
  const dashboardUpcomingExams = $("dashboardUpcomingExams");
  const dashboardToday = $("dashboardToday");
  const dashboardTomorrow = $("dashboardTomorrow");

  const authSignedOut = $("authSignedOut");
  const authSignedIn = $("authSignedIn");
  const authEmail = $("authEmail");
  const authPassword = $("authPassword");
  const authMessage = $("authMessage");
  const authMessageSignedIn = $("authMessageSignedIn");
  const signUpBtn = $("signUpBtn");
  const signInBtn = $("signInBtn");
  const signOutBtn = $("signOutBtn");

  const academicYearNameInput = $("academicYearName");
  const saveAcademicYearBtn = $("saveAcademicYearBtn");

  const semesterAcademicYearInput = $("semesterAcademicYear");
  const semesterNameInput = $("semesterName");
  const semesterStartDateInput = $("semesterStartDate");
  const semesterEndDateInput = $("semesterEndDate");
  const saveSemesterBtn = $("saveSemesterBtn");

  const courseNameInput = $("courseName");
  const courseCodeInput = $("courseCode");
  const courseInstructorInput = $("courseInstructor");
  const courseColorInput = $("courseColor");
  const courseSemesterInput = $("courseSemester");
  const sessionTypeInput = $("sessionType");
  const sessionRepeatInput = $("sessionRepeat");
  const sessionDayInput = $("sessionDay");
  const sessionDateInput = $("sessionDate");
  const sessionStartTimeInput = $("sessionStartTime");
  const sessionEndTimeInput = $("sessionEndTime");
  const sessionLocationInput = $("sessionLocation");
  const addSessionBtn = $("addSessionBtn");
  const pendingSessionsList = $("pendingSessionsList");
  const saveCourseBtn = $("saveCourseBtn");

  const noteTitleInput = $("noteTitle");
  const noteContentInput = $("noteContent");
  const saveNoteBtn = $("saveNoteBtn");

  const taskTitleInput = $("taskTitle");
  const taskDetailsInput = $("taskDetails");
  const taskCourseInput = $("taskCourse");
  const taskDateInput = $("taskDate");
  const taskPriorityInput = $("taskPriority");
  const taskStatusInput = $("taskStatus");
  const addTaskBtn = $("addTaskBtn");

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

  function showAuthMessage(message, isError) {
    if (authMessage) {
      authMessage.textContent = message;
      authMessage.style.color = isError ? "#b91c1c" : "#0f766e";
    }
    if (authMessageSignedIn) {
      authMessageSignedIn.textContent = message;
      authMessageSignedIn.style.color = isError ? "#b91c1c" : "#0f766e";
    }
  }

  function setAuthUI(user) {
    currentUser = user || null;

    if (currentUser) {
      authSignedOut.classList.add("hidden");
      authSignedIn.classList.remove("hidden");
      brandUserArea.classList.remove("hidden");
      brandSignedInText.textContent = "Signed in as " + (currentUser.email || "");
      signOutBtn.classList.remove("hidden");
      authBox.classList.add("hidden");
    } else {
      authSignedOut.classList.remove("hidden");
      authSignedIn.classList.add("hidden");
      brandUserArea.classList.add("hidden");
      brandSignedInText.textContent = "";
      signOutBtn.classList.add("hidden");
      authBox.classList.remove("hidden");
    }
  }

  async function signUp() {
    const email = authEmail.value.trim();
    const password = authPassword.value.trim();

    if (!email || !password) {
      showAuthMessage("Enter email and password first.", true);
      return;
    }

    showAuthMessage("Creating account...", false);

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

    showAuthMessage("Sign-up submitted. Check your email and click the confirmation link.", false);
  }

  async function signIn() {
    const email = authEmail.value.trim();
    const password = authPassword.value.trim();

    if (!email || !password) {
      showAuthMessage("Enter email and password first.", true);
      return;
    }

    showAuthMessage("Signing in...", false);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      showAuthMessage(error.message, true);
      return;
    }

    showAuthMessage("Signed in.", false);
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showAuthMessage(error.message, true);
      return;
    }
    showAuthMessage("Signed out.", false);
  }

  async function getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user || null;
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

  function isWithinNext3Weeks(dateString) {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const threeWeeks = new Date(today);
    threeWeeks.setDate(threeWeeks.getDate() + 21);
    const itemDate = new Date(dateString + "T00:00:00");
    return itemDate >= today && itemDate <= threeWeeks;
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

  function resetAcademicYearModal() {
    academicYearNameInput.value = "";
    editingAcademicYearId = null;
    saveAcademicYearBtn.textContent = "Save Academic Year";
  }

  function resetSemesterModal() {
    semesterAcademicYearInput.value = "";
    semesterNameInput.value = "";
    semesterStartDateInput.value = "";
    semesterEndDateInput.value = "";
    editingSemesterId = null;
    saveSemesterBtn.textContent = "Save Semester";
  }

  function resetCourseSessionInputs() {
    sessionTypeInput.value = "";
    sessionRepeatInput.value = "";
    sessionDayInput.value = "";
    sessionDateInput.value = "";
    sessionStartTimeInput.value = "";
    sessionEndTimeInput.value = "";
    sessionLocationInput.value = "";
  }

  function resetCourseModal() {
    courseNameInput.value = "";
    courseCodeInput.value = "";
    courseInstructorInput.value = "";
    courseColorInput.value = "#2563eb";
    courseSemesterInput.value = "";
    editingCourseId = null;
    pendingSessions = [];
    renderPendingSessions();
    resetCourseSessionInputs();
    saveCourseBtn.textContent = "Save Course";
  }

  function resetNoteModal() {
    noteTitleInput.value = "";
    noteContentInput.value = "";
    editingNoteId = null;
    saveNoteBtn.textContent = "Save Note";
  }

  function resetTaskModal() {
    taskTitleInput.value = "";
    taskDetailsInput.value = "";
    taskCourseInput.value = "";
    taskDateInput.value = "";
    taskPriorityInput.value = "";
    taskStatusInput.value = "";
    editingTaskId = null;
    addTaskBtn.textContent = "Save Task";
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
    saveExamBtn.textContent = "Save Exam";
  }

  openModalButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const modalId = btn.dataset.openModal;
      if (modalId === "academicYearModal") resetAcademicYearModal();
      if (modalId === "semesterModal") resetSemesterModal();
      if (modalId === "courseModal") resetCourseModal();
      if (modalId === "noteModal") resetNoteModal();
      if (modalId === "taskModal") resetTaskModal();
      if (modalId === "examModal") resetExamModal();
      refreshAcademicYearOptions();
      refreshSemesterOptions();
      refreshTaskCourseOptions();
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
      courses: "Courses",
      planner: "Tasks",
      notes: "Notes",
      exams: "Exams",
      academic: "Academic Settings",
      calendar: "Calendar"
    };

    if (pageTitle) pageTitle.textContent = titles[tabId] || "Academia";
    if (tabId === "calendar") renderCalendar();

    if (window.innerWidth <= 640 && tabNav) {
      tabNav.classList.remove("menu-open");
    }
  }

  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      showTab(button.dataset.tab);
    });
  });

  function refreshAcademicYearOptions() {
    semesterAcademicYearInput.innerHTML = `
      <option value="" selected disabled>Select academic year</option>
    `;
    academicYears.forEach(function (year) {
      const option = document.createElement("option");
      option.value = year.id;
      option.textContent = year.name;
      semesterAcademicYearInput.appendChild(option);
    });
  }

  function refreshSemesterOptions() {
    courseSemesterInput.innerHTML = `
      <option value="">No semester</option>
    `;
    semesters.forEach(function (semester) {
      const year = academicYears.find(function (item) {
        return item.id === semester.academicYearId;
      });
      const option = document.createElement("option");
      option.value = semester.id;
      option.textContent = year ? semester.name + " — " + year.name : semester.name;
      courseSemesterInput.appendChild(option);
    });
  }

  function refreshTaskCourseOptions() {
    taskCourseInput.innerHTML = `
      <option value="">No course</option>
    `;
    courses.forEach(function (course) {
      const option = document.createElement("option");
      option.value = course.id;
      option.textContent = course.name + (course.code ? " (" + course.code + ")" : "");
      taskCourseInput.appendChild(option);
    });
  }

  function renderPendingSessions() {
    pendingSessionsList.innerHTML = "";
    if (pendingSessions.length === 0) {
      pendingSessionsList.innerHTML = `<div class="empty-state">No sessions added yet.</div>`;
      return;
    }

    pendingSessions.forEach(function (session, index) {
      const box = document.createElement("div");
      box.className = "pending-session-item";
      box.innerHTML = `
        <strong>${session.sessionType}</strong>
        <div class="meta">Repeat: ${session.repeatType === "weekly" ? "Weekly" : "Specific date"}</div>
        <div class="meta">${session.repeatType === "weekly" ? "Day: " + (session.dayOfWeek || "Not set") : "Date: " + (session.specificDate || "Not set")}</div>
        <div class="meta">Time: ${session.startTime || "?"} - ${session.endTime || "?"}</div>
        <div class="meta">Location: ${session.location || "Not set"}</div>
        <div class="card-actions" style="margin-top:10px;">
          <button class="delete-btn" data-remove-pending-session="${index}" type="button">Remove</button>
        </div>
      `;
      pendingSessionsList.appendChild(box);
    });
  }

  function getCourseName(courseId) {
    if (!courseId) return "No course";
    const course = courses.find(function (item) {
      return item.id === courseId;
    });
    return course ? course.name : "Unknown course";
  }

  function getCourseColor(courseId) {
    const course = courses.find(function (item) {
      return item.id === courseId;
    });
    return course ? course.color || "#4f5fd7" : "#4f5fd7";
  }

  async function loadAcademicYears() {
    if (!currentUser) {
      academicYears = [];
      renderAcademic();
      refreshAcademicYearOptions();
      return;
    }

    const { data, error } = await supabase
      .from("academic_years")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      showAuthMessage(error.message, true);
      academicYears = [];
      renderAcademic();
      return;
    }

    academicYears = (data || []).map(function (item) {
      return { id: item.id, name: item.name };
    });

    renderAcademic();
    refreshAcademicYearOptions();
  }

  async function loadSemesters() {
    if (!currentUser) {
      semesters = [];
      renderAcademic();
      refreshSemesterOptions();
      return;
    }

    const { data, error } = await supabase
      .from("semesters")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      showAuthMessage(error.message, true);
      semesters = [];
      renderAcademic();
      return;
    }

    semesters = (data || []).map(function (item) {
      return {
        id: item.id,
        academicYearId: item.academic_year_id,
        name: item.name,
        startDate: item.start_date || "",
        endDate: item.end_date || ""
      };
    });

    renderAcademic();
    refreshSemesterOptions();
  }

  async function loadCourses() {
    if (!currentUser) {
      courses = [];
      renderCourses();
      refreshTaskCourseOptions();
      renderCalendar();
      return;
    }

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      showAuthMessage(error.message, true);
      courses = [];
      renderCourses();
      return;
    }

    courses = (data || []).map(function (item) {
      return {
        id: item.id,
        semesterId: item.semester_id || "",
        name: item.name,
        code: item.code || "",
        instructor: item.instructor || "",
        color: item.color || "#4f5fd7"
      };
    });

    renderCourses();
    refreshTaskCourseOptions();
    renderTasks();
    renderCalendar();
  }

  async function loadCourseSessions() {
    if (!currentUser) {
      courseSessions = [];
      renderCourses();
      renderCalendar();
      return;
    }

    const { data, error } = await supabase
      .from("course_sessions")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      showAuthMessage(error.message, true);
      courseSessions = [];
      return;
    }

    courseSessions = (data || []).map(function (item) {
      return {
        id: item.id,
        courseId: item.course_id,
        sessionType: item.session_type,
        repeatType: item.repeat_type,
        dayOfWeek: item.day_of_week || "",
        specificDate: item.specific_date || "",
        startTime: item.start_time || "",
        endTime: item.end_time || "",
        location: item.location || ""
      };
    });

    renderCourses();
    renderCalendar();
  }

  async function loadNotes() {
    if (!currentUser) {
      notes = [];
      renderNotes();
      return;
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      showAuthMessage(error.message, true);
      notes = [];
      renderNotes();
      return;
    }

    notes = (data || []).map(function (item) {
      return {
        id: item.id,
        title: item.title || "",
        content: item.content || ""
      };
    });

    renderNotes();
  }

  async function loadTasks() {
    if (!currentUser) {
      tasks = [];
      renderTasks();
      renderDashboard();
      renderCalendar();
      return;
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("due_date", { ascending: true });

    if (error) {
      showAuthMessage(error.message, true);
      tasks = [];
      renderTasks();
      return;
    }

    tasks = (data || []).map(function (item) {
      return {
        id: item.id,
        title: item.title,
        details: item.details || "",
        courseId: item.course_id || "",
        date: item.due_date,
        priority: item.priority || "High",
        status: item.status || "To Do"
      };
    });

    renderTasks();
    renderDashboard();
    renderCalendar();
  }

  async function loadExams() {
    if (!currentUser) {
      exams = [];
      renderExams();
      renderDashboard();
      renderCalendar();
      return;
    }

    const { data, error } = await supabase
      .from("exams")
      .select("*")
      .order("exam_date", { ascending: true });

    if (error) {
      showAuthMessage(error.message, true);
      exams = [];
      renderExams();
      return;
    }

    exams = (data || []).map(function (item) {
      return {
        id: item.id,
        title: item.title,
        course: item.course || "",
        date: item.exam_date,
        time: item.exam_time || "",
        place: item.place || "",
        seatNumber: item.seat_number || "",
        grade: item.grade || "",
        mark: item.mark ?? "",
        notes: item.notes || ""
      };
    });

    renderExams();
    renderDashboard();
    renderCalendar();
  }

  async function saveAcademicYear() {
    const name = academicYearNameInput.value.trim();
    if (!currentUser) return alert("Please sign in first.");
    if (!name) return alert("Please enter an academic year name.");

    let error;
    if (editingAcademicYearId) {
      ({ error } = await supabase.from("academic_years").update({ name }).eq("id", editingAcademicYearId));
    } else {
      ({ error } = await supabase.from("academic_years").insert({ user_id: currentUser.id, name }));
    }

    if (error) return alert(error.message);

    closeModal("academicYearModal");
    resetAcademicYearModal();
    await loadAcademicYears();
  }

  async function saveSemester() {
    const academicYearId = semesterAcademicYearInput.value;
    const name = semesterNameInput.value.trim();
    const startDate = semesterStartDateInput.value || null;
    const endDate = semesterEndDateInput.value || null;

    if (!currentUser) return alert("Please sign in first.");
    if (!academicYearId || !name) return alert("Please select an academic year and enter a semester name.");

    let error;
    if (editingSemesterId) {
      ({ error } = await supabase.from("semesters").update({
        academic_year_id: academicYearId,
        name,
        start_date: startDate,
        end_date: endDate
      }).eq("id", editingSemesterId));
    } else {
      ({ error } = await supabase.from("semesters").insert({
        user_id: currentUser.id,
        academic_year_id: academicYearId,
        name,
        start_date: startDate,
        end_date: endDate
      }));
    }

    if (error) return alert(error.message);

    closeModal("semesterModal");
    resetSemesterModal();
    await loadSemesters();
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

  async function saveCourse() {
    const name = courseNameInput.value.trim();
    const code = courseCodeInput.value.trim();
    const instructor = courseInstructorInput.value.trim();
    const color = courseColorInput.value || "#4f5fd7";
    const semesterId = courseSemesterInput.value || null;

    if (!currentUser) return alert("Please sign in first.");
    if (!name) return alert("Please enter a course name.");

    let courseId = editingCourseId;
    let error;

    if (editingCourseId) {
      ({ error } = await supabase.from("courses").update({
        semester_id: semesterId,
        name,
        code,
        instructor,
        color
      }).eq("id", editingCourseId));
      if (error) return alert(error.message);

      const deleteOld = await supabase.from("course_sessions").delete().eq("course_id", editingCourseId);
      if (deleteOld.error) return alert(deleteOld.error.message);
    } else {
      const inserted = await supabase
        .from("courses")
        .insert({
          user_id: currentUser.id,
          semester_id: semesterId,
          name,
          code,
          instructor,
          color
        })
        .select()
        .single();

      if (inserted.error) return alert(inserted.error.message);
      courseId = inserted.data.id;
    }

    if (pendingSessions.length > 0) {
      const sessionRows = pendingSessions.map(function (session) {
        return {
          user_id: currentUser.id,
          course_id: courseId,
          session_type: session.sessionType,
          repeat_type: session.repeatType,
          day_of_week: session.dayOfWeek || null,
          specific_date: session.specificDate || null,
          start_time: session.startTime || null,
          end_time: session.endTime || null,
          location: session.location || null
        };
      });

      const sessionInsert = await supabase.from("course_sessions").insert(sessionRows);
      if (sessionInsert.error) return alert(sessionInsert.error.message);
    }

    closeModal("courseModal");
    resetCourseModal();
    await loadCourses();
    await loadCourseSessions();
  }

  async function saveNote() {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();

    if (!currentUser) return alert("Please sign in first.");
    if (!title && !content) return alert("Please enter a note title or note content.");

    let error;
    if (editingNoteId) {
      ({ error } = await supabase.from("notes").update({ title, content }).eq("id", editingNoteId));
    } else {
      ({ error } = await supabase.from("notes").insert({
        user_id: currentUser.id,
        title,
        content
      }));
    }

    if (error) return alert(error.message);

    closeModal("noteModal");
    resetNoteModal();
    await loadNotes();
  }

  async function saveTask() {
    const title = taskTitleInput.value.trim();
    const details = taskDetailsInput.value.trim();
    const courseId = taskCourseInput.value || null;
    const date = taskDateInput.value;
    const priority = taskPriorityInput.value || "High";
    const status = taskStatusInput.value || "To Do";

    if (!currentUser) return alert("Please sign in first.");
    if (!title || !date) return alert("Please enter both task title and due date.");

    let error;
    if (editingTaskId) {
      ({ error } = await supabase.from("tasks").update({
        title,
        details,
        course_id: courseId,
        due_date: date,
        priority,
        status
      }).eq("id", editingTaskId));
    } else {
      ({ error } = await supabase.from("tasks").insert({
        user_id: currentUser.id,
        title,
        details,
        course_id: courseId,
        due_date: date,
        priority,
        status
      }));
    }

    if (error) return alert(error.message);

    closeModal("taskModal");
    resetTaskModal();
    await loadTasks();
  }

  async function saveExam() {
    const title = examTitleInput.value.trim();
    const course = examCourseInput.value.trim();
    const date = examDateInput.value;
    const time = examTimeInput.value;
    const place = examPlaceInput.value.trim();
    const seatNumber = examSeatNumberInput.value.trim();
    const grade = examGradeInput.value.trim();
    const mark = examMarkInput.value.trim();
    const notesValue = examNotesInput.value.trim();

    if (!currentUser) return alert("Please sign in first.");
    if (!title || !date) return alert("Please enter both exam title and exam date.");

    let error;
    if (editingExamId) {
      ({ error } = await supabase.from("exams").update({
        title,
        course,
        exam_date: date,
        exam_time: time,
        place,
        seat_number: seatNumber,
        grade,
        mark: mark === "" ? null : mark,
        notes: notesValue
      }).eq("id", editingExamId));
    } else {
      ({ error } = await supabase.from("exams").insert({
        user_id: currentUser.id,
        title,
        course,
        exam_date: date,
        exam_time: time,
        place,
        seat_number: seatNumber,
        grade,
        mark: mark === "" ? null : mark,
        notes: notesValue
      }));
    }

    if (error) return alert(error.message);

    closeModal("examModal");
    resetExamModal();
    await loadExams();
  }

  async function deleteAcademicYear(id) {
    const { error } = await supabase.from("academic_years").delete().eq("id", id);
    if (error) return alert(error.message);
    await loadAcademicYears();
    await loadSemesters();
    await loadCourses();
    await loadCourseSessions();
  }

  async function deleteSemester(id) {
    const { error } = await supabase.from("semesters").delete().eq("id", id);
    if (error) return alert(error.message);
    await loadSemesters();
    await loadCourses();
    await loadCourseSessions();
  }

  async function deleteCourse(id) {
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) return alert(error.message);
    await loadCourses();
    await loadCourseSessions();
    await loadTasks();
  }

  async function deleteNote(id) {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) return alert(error.message);
    await loadNotes();
  }

  async function deleteTaskFromSupabase(id) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) return alert(error.message);
    await loadTasks();
  }

  async function deleteExamFromSupabase(id) {
    const { error } = await supabase.from("exams").delete().eq("id", id);
    if (error) return alert(error.message);
    await loadExams();
  }

  async function updateTaskStatus(id, status) {
    const { error } = await supabase.from("tasks").update({ status }).eq("id", id);
    if (error) return alert(error.message);
    await loadTasks();
  }

  function editAcademicYear(id) {
    const item = academicYears.find(function (year) { return year.id === id; });
    if (!item) return;
    academicYearNameInput.value = item.name || "";
    editingAcademicYearId = id;
    saveAcademicYearBtn.textContent = "Update Academic Year";
    openModal("academicYearModal");
  }

  function editSemester(id) {
    const item = semesters.find(function (semester) { return semester.id === id; });
    if (!item) return;
    refreshAcademicYearOptions();
    semesterAcademicYearInput.value = item.academicYearId || "";
    semesterNameInput.value = item.name || "";
    semesterStartDateInput.value = item.startDate || "";
    semesterEndDateInput.value = item.endDate || "";
    editingSemesterId = id;
    saveSemesterBtn.textContent = "Update Semester";
    openModal("semesterModal");
  }

  function editCourse(id) {
    const item = courses.find(function (course) { return course.id === id; });
    if (!item) return;

    const existingSessions = courseSessions.filter(function (session) {
      return session.courseId === id;
    });

    refreshSemesterOptions();
    courseNameInput.value = item.name || "";
    courseCodeInput.value = item.code || "";
    courseInstructorInput.value = item.instructor || "";
    courseColorInput.value = item.color || "#4f5fd7";
    courseSemesterInput.value = item.semesterId || "";
    editingCourseId = id;
    pendingSessions = existingSessions.map(function (session) {
      return {
        sessionType: session.sessionType,
        repeatType: session.repeatType,
        dayOfWeek: session.dayOfWeek,
        specificDate: session.specificDate,
        startTime: session.startTime,
        endTime: session.endTime,
        location: session.location
      };
    });
    renderPendingSessions();
    saveCourseBtn.textContent = "Update Course";
    openModal("courseModal");
  }

  function editNote(id) {
    const item = notes.find(function (note) { return note.id === id; });
    if (!item) return;
    noteTitleInput.value = item.title || "";
    noteContentInput.value = item.content || "";
    editingNoteId = id;
    saveNoteBtn.textContent = "Update Note";
    openModal("noteModal");
  }

  function editTask(id) {
    const task = tasks.find(function (item) { return String(item.id) === String(id); });
    if (!task) return;
    refreshTaskCourseOptions();
    taskTitleInput.value = task.title || "";
    taskDetailsInput.value = task.details || "";
    taskCourseInput.value = task.courseId || "";
    taskDateInput.value = task.date || "";
    taskPriorityInput.value = task.priority || "High";
    taskStatusInput.value = task.status || "To Do";
    editingTaskId = id;
    addTaskBtn.textContent = "Update Task";
    openModal("taskModal");
  }

  function editExam(id) {
    const exam = exams.find(function (item) { return String(item.id) === String(id); });
    if (!exam) return;
    examTitleInput.value = exam.title || "";
    examCourseInput.value = exam.course || "";
    examDateInput.value = exam.date || "";
    examTimeInput.value = exam.time || "";
    examPlaceInput.value = exam.place || "";
    examSeatNumberInput.value = exam.seatNumber || "";
    examGradeInput.value = exam.grade || "";
    examMarkInput.value = exam.mark || "";
    examNotesInput.value = exam.notes || "";
    editingExamId = id;
    saveExamBtn.textContent = "Update Exam";
    openModal("examModal");
  }

  function openTaskDetails(task) {
    showDetailModal(task.title, [
      ["Type", "Task"],
      ["Title", task.title],
      ["Course", getCourseName(task.courseId)],
      ["Due Date", task.date],
      ["Priority", task.priority],
      ["Status", task.status],
      ["Details", task.details || "No details added."]
    ]);
  }

  function openExamDetails(exam) {
    showDetailModal(exam.title, [
      ["Type", "Exam"],
      ["Course", exam.course || "No course entered"],
      ["Date", exam.date || "No date entered"],
      ["Time", exam.time || "No time entered"],
      ["Place", exam.place || "No place entered"],
      ["Seat Number", exam.seatNumber || "No seat number entered"],
      ["Grade", exam.grade || "Not entered"],
      ["Mark", exam.mark !== "" && exam.mark !== null ? exam.mark : "Not entered"],
      ["Notes", exam.notes || "No notes added."]
    ]);
  }

  function renderCourses() {
    coursesList.innerHTML = "";

    if (!currentUser) {
      coursesList.innerHTML = '<div class="empty-state">Please sign in to view courses.</div>';
      return;
    }

    if (courses.length === 0) {
      coursesList.innerHTML = '<div class="empty-state">No courses added yet.</div>';
      return;
    }

    courses.forEach(function (course) {
      const semester = semesters.find(function (item) {
        return item.id === course.semesterId;
      });

      const sessions = courseSessions.filter(function (session) {
        return session.courseId === course.id;
      });

      const sessionsHtml = sessions.length
        ? sessions.map(function (session) {
            return `
              <div class="detail-item" style="margin-top:10px;">
                <strong>${session.sessionType}</strong>
                <div class="meta">Repeat: ${session.repeatType === "weekly" ? "Weekly" : "Specific date"}</div>
                <div class="meta">${session.repeatType === "weekly" ? "Day: " + (session.dayOfWeek || "Not set") : "Date: " + (session.specificDate || "Not set")}</div>
                <div class="meta">Time: ${session.startTime || "?"} - ${session.endTime || "?"}</div>
                <div class="meta">Location: ${session.location || "Not set"}</div>
              </div>
            `;
          }).join("")
        : '<div class="empty-state">No sessions yet.</div>';

      const card = document.createElement("div");
      card.className = "course-card";
      card.innerHTML = `
        <h3 class="task-title">${course.name}</h3>
        <div class="badge-row">
          ${course.code ? `<span class="course-badge" style="background:${course.color};">${course.code}</span>` : ""}
        </div>
        <p class="meta">Instructor: ${course.instructor || "Not set"}</p>
        <p class="meta">Semester: ${semester ? semester.name : "Not set"}</p>
        ${sessionsHtml}
        <div class="card-actions" style="margin-top:12px;">
          <button class="edit-btn" data-edit-course="${course.id}" type="button">Edit</button>
          <button class="delete-btn" data-delete-course="${course.id}" type="button">Delete</button>
        </div>
      `;
      coursesList.appendChild(card);
    });
  }

  function renderNotes() {
    notesList.innerHTML = "";

    if (!currentUser) {
      notesList.innerHTML = '<div class="empty-state">Please sign in to view notes.</div>';
      return;
    }

    if (notes.length === 0) {
      notesList.innerHTML = '<div class="empty-state">No notes added yet.</div>';
      return;
    }

    notes.forEach(function (note) {
      const card = document.createElement("div");
      card.className = "note-card";
      card.innerHTML = `
        <h3 class="task-title">${note.title || "Untitled Note"}</h3>
        <p class="meta">${(note.content || "").replace(/\n/g, "<br>") || "No content added."}</p>
        <div class="card-actions">
          <button class="edit-btn" data-edit-note="${note.id}" type="button">Edit</button>
          <button class="delete-btn" data-delete-note="${note.id}" type="button">Delete</button>
        </div>
      `;
      notesList.appendChild(card);
    });
  }

  function renderAcademic() {
    academicYearsList.innerHTML = "";

    if (!currentUser) {
      academicYearsList.innerHTML = '<div class="empty-state">Please sign in to view academic settings.</div>';
      return;
    }

    if (academicYears.length === 0) {
      academicYearsList.innerHTML = '<div class="empty-state">No academic years added yet.</div>';
      return;
    }

    academicYears.forEach(function (year) {
      const yearBox = document.createElement("div");
      yearBox.className = "academic-card";

      const matchingSemesters = semesters.filter(function (semester) {
        return semester.academicYearId === year.id;
      });

      const semestersHtml = matchingSemesters.length
        ? matchingSemesters.map(function (semester) {
            return `
              <div class="semester-box">
                <h4 class="task-title">${semester.name}</h4>
                <p class="meta">Start: ${semester.startDate || "Not set"}</p>
                <p class="meta">End: ${semester.endDate || "Not set"}</p>
                <div class="card-actions">
                  <button class="edit-btn" data-edit-semester="${semester.id}" type="button">Edit</button>
                  <button class="delete-btn" data-delete-semester="${semester.id}" type="button">Delete</button>
                </div>
              </div>
            `;
          }).join("")
        : '<div class="empty-state">No semesters yet.</div>';

      yearBox.innerHTML = `
        <h3 class="task-title">${year.name}</h3>
        <div class="card-actions" style="margin-bottom:12px;">
          <button class="edit-btn" data-edit-academic-year="${year.id}" type="button">Edit</button>
          <button class="delete-btn" data-delete-academic-year="${year.id}" type="button">Delete</button>
        </div>
        ${semestersHtml}
      `;

      academicYearsList.appendChild(yearBox);
    });
  }

  function renderTasks() {
    plannerList.innerHTML = "";

    if (!currentUser) {
      plannerList.innerHTML = '<div class="empty-state">Please sign in to view synced tasks.</div>';
      return;
    }

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
        <div class="task-card-summary">
          <h3 class="task-title ${isDone ? "task-done-title" : ""}">${task.title}</h3>
          <div class="badge-row">
            <span class="priority-badge ${priorityClass}">${task.priority}</span>
            <span class="status-badge ${statusClass}">${task.status}</span>
          </div>
          <p class="meta">Course: ${getCourseName(task.courseId)}</p>
          <p class="meta">Due: ${task.date}</p>
        </div>

        <button class="secondary-btn task-expand-btn" data-toggle-task="${task.id}" type="button">Open Task</button>

        <div class="task-card-expanded hidden" id="taskExpanded-${task.id}">
          <p class="meta">${task.details ? String(task.details).replace(/\n/g, "<br>") : "No details added."}</p>

          <div class="inline-status-controls">
            <button class="mini-btn secondary-btn" data-task-status="${task.id}" data-status-value="To Do" type="button">To Do</button>
            <button class="mini-btn secondary-btn" data-task-status="${task.id}" data-status-value="In Progress" type="button">In Progress</button>
            <button class="mini-btn secondary-btn" data-task-status="${task.id}" data-status-value="Done" type="button">Done</button>
          </div>

          <div class="card-actions">
            <button class="view-btn" data-view-task="${task.id}" type="button">View</button>
            <button class="edit-btn" data-edit-task="${task.id}" type="button">Edit</button>
            <button class="delete-btn" data-delete-task="${task.id}" type="button">Delete</button>
          </div>
        </div>
      `;
      plannerList.appendChild(card);
    });
  }

  function renderExams() {
    examsList.innerHTML = "";

    if (!currentUser) {
      examsList.innerHTML = '<div class="empty-state">Please sign in to view synced exams.</div>';
      return;
    }

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
        <div class="badge-row">
          <span class="status-badge status-progress">${exam.course || "Exam"}</span>
          ${exam.grade ? `<span class="priority-badge priority-low">Grade: ${exam.grade}</span>` : ""}
          ${exam.mark !== "" && exam.mark !== null ? `<span class="priority-badge priority-medium">Mark: ${exam.mark}</span>` : ""}
        </div>
        <p class="meta">Date: ${exam.date || "Not set"}</p>
        <p class="meta">Time: ${exam.time || "Not set"}</p>
        <p class="meta">Place: ${exam.place || "Not set"}</p>
        <p class="meta">Seat: ${exam.seatNumber || "Not set"}</p>
        <p class="meta">${exam.notes ? String(exam.notes).replace(/\n/g, "<br>") : "No revision notes added."}</p>

        <div class="card-actions">
          <button class="view-btn" data-view-exam="${exam.id}" type="button">View</button>
          <button class="edit-btn" data-edit-exam="${exam.id}" type="button">Edit</button>
          <button class="delete-btn" data-delete-exam="${exam.id}" type="button">Delete</button>
        </div>
      `;
      examsList.appendChild(card);
    });
  }

  function getStartOfWeek(date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    result.setDate(result.getDate() - result.getDay());
    return result;
  }

  function getSessionsForDate(dateObj) {
    const dateKey = formatDateKey(dateObj);
    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });

    return courseSessions
      .filter(function (session) {
        if (session.repeatType === "weekly") {
          return session.dayOfWeek === dayName;
        }
        return session.specificDate === dateKey;
      })
      .map(function (session) {
        const course = courses.find(function (item) {
          return item.id === session.courseId;
        });
        return {
          type: "course",
          id: "course-session-" + session.id,
          title: (course ? course.name : "Course") + " (" + session.sessionType + ")",
          timeLabel: (session.startTime || "?") + " - " + (session.endTime || "?"),
          color: course ? (course.color || "#4f5fd7") : "#4f5fd7",
          location: session.location || "",
          isPast: false
        };
      });
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

    return courseItems.concat(examItems);
  }

  function renderDashboardDaySchedule(dayKey, container) {
    container.innerHTML = "";

    if (!currentUser) {
      container.innerHTML = '<div class="empty-state">Sign in to load schedule.</div>';
      return;
    }

    const items = getItemsForDate(dayKey);

    if (items.length === 0) {
      container.innerHTML = '<div class="empty-state">No items scheduled.</div>';
      return;
    }

    items.forEach(function (item) {
      const row = document.createElement("div");
      row.className = "detail-item";
      if (item.isPast) row.classList.add("past-item");
      row.innerHTML = `
        <strong>${item.title}</strong>
        <div class="meta">${item.timeLabel}${item.location ? " • " + item.location : ""}</div>
      `;
      container.appendChild(row);
    });
  }

  function renderDashboardUpcomingTasks() {
    dashboardUpcomingTasks.innerHTML = "";

    if (!currentUser) {
      dashboardUpcomingTasks.innerHTML = '<div class="empty-state">Sign in to load tasks.</div>';
      return;
    }

    const upcoming = tasks
      .filter(function (task) {
        return task.date && !isPastDate(task.date) && task.status !== "Done";
      })
      .sort(function (a, b) {
        return new Date(a.date) - new Date(b.date);
      });

    if (upcoming.length === 0) {
      dashboardUpcomingTasks.innerHTML = '<div class="empty-state">No upcoming tasks.</div>';
      return;
    }

    upcoming.forEach(function (task) {
      const item = document.createElement("div");
      item.className = "detail-item";
      item.innerHTML = `
        <strong>${task.title}</strong>
        <div class="meta">Course: ${getCourseName(task.courseId)}</div>
        <div class="meta">Due ${task.date} • ${task.status} • ${task.priority}</div>
      `;
      dashboardUpcomingTasks.appendChild(item);
    });
  }

  function renderDashboardUpcomingExams() {
    dashboardUpcomingExams.innerHTML = "";

    if (!currentUser) {
      dashboardUpcomingExams.innerHTML = '<div class="empty-state">Sign in to load exams.</div>';
      return;
    }

    const upcoming = exams
      .filter(function (exam) {
        return exam.date && isWithinNext3Weeks(exam.date);
      })
      .sort(function (a, b) {
        return new Date(a.date) - new Date(b.date);
      });

    if (upcoming.length === 0) {
      dashboardUpcomingExams.innerHTML = '<div class="empty-state">No exams in the next 3 weeks.</div>';
      return;
    }

    upcoming.forEach(function (exam) {
      const item = document.createElement("div");
      item.className = "detail-item";
      item.innerHTML = `
        <strong>${exam.title}</strong>
        <div class="meta">${exam.course || "Exam"} • ${exam.date}${exam.time ? " • " + exam.time : ""}</div>
      `;
      dashboardUpcomingExams.appendChild(item);
    });
  }

  function renderDashboard() {
    renderDashboardUpcomingTasks();
    renderDashboardUpcomingExams();

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    renderDashboardDaySchedule(formatDateKey(today), dashboardToday);
    renderDashboardDaySchedule(formatDateKey(tomorrow), dashboardTomorrow);
  }

  function showDetailModal(title, items) {
    detailTitle.textContent = title;
    detailBody.innerHTML = items.map(function (pair) {
      return `
        <div class="detail-item">
          <div class="meta"><strong>${pair[0]}</strong></div>
          <div>${pair[1]}</div>
        </div>
      `;
    }).join("");
    openModal("detailModal");
  }

  function openCalendarItem(itemId) {
    if (String(itemId).startsWith("task-")) {
      const realId = itemId.replace("task-", "");
      const task = tasks.find(function (item) {
        return String(item.id) === String(realId);
      });
      if (task) openTaskDetails(task);
      return;
    }

    if (String(itemId).startsWith("exam-")) {
      const realId = itemId.replace("exam-", "");
      const exam = exams.find(function (item) {
        return String(item.id) === String(realId);
      });
      if (exam) openExamDetails(exam);
    }
  }

  function setCalendarView(view) {
    currentCalendarView = view;

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
            data-calendar-item="${item.id}"
            title="${item.title}"
            style="background:${item.color}; opacity:${item.isPast ? "0.55" : "1"};"
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
              <button
                type="button"
                class="calendar-item ${item.type}"
                data-calendar-item="${item.id}"
                title="${item.title}"
                style="background:${item.color}; opacity:${item.isPast ? "0.55" : "1"};"
              >
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
            <button
              type="button"
              class="calendar-item ${item.type}"
              data-calendar-item="${item.id}"
              title="${item.title}"
              style="background:${item.color}; opacity:${item.isPast ? "0.55" : "1"};"
            >
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

  function renderCalendar() {
    if (currentCalendarView === "month") renderMonthView();
    else if (currentCalendarView === "week") renderWeekView();
    else renderDayView();
  }

  function moveCalendar(direction) {
    if (currentCalendarView === "month") {
      currentCalendarDate = new Date(
        currentCalendarDate.getFullYear(),
        currentCalendarDate.getMonth() + direction,
        1
      );
    } else if (currentCalendarView === "week") {
      currentCalendarDate = new Date(
        currentCalendarDate.getFullYear(),
        currentCalendarDate.getMonth(),
        currentCalendarDate.getDate() + (7 * direction)
      );
    } else {
      currentCalendarDate = new Date(
        currentCalendarDate.getFullYear(),
        currentCalendarDate.getMonth(),
        currentCalendarDate.getDate() + direction
      );
    }
    renderCalendar();
  }

  if (pendingSessionsList) {
    pendingSessionsList.addEventListener("click", function (e) {
      const removeIndex = e.target.getAttribute("data-remove-pending-session");
      if (removeIndex !== null) {
        pendingSessions.splice(Number(removeIndex), 1);
        renderPendingSessions();
      }
    });
  }

  if (coursesList) {
    coursesList.addEventListener("click", async function (e) {
      const editId = e.target.getAttribute("data-edit-course");
      const deleteId = e.target.getAttribute("data-delete-course");
      if (editId) editCourse(editId);
      if (deleteId) await deleteCourse(deleteId);
    });
  }

  if (notesList) {
    notesList.addEventListener("click", async function (e) {
      const editId = e.target.getAttribute("data-edit-note");
      const deleteId = e.target.getAttribute("data-delete-note");
      if (editId) editNote(editId);
      if (deleteId) await deleteNote(deleteId);
    });
  }

  if (academicYearsList) {
    academicYearsList.addEventListener("click", async function (e) {
      const editYearId = e.target.getAttribute("data-edit-academic-year");
      const deleteYearId = e.target.getAttribute("data-delete-academic-year");
      const editSemesterId = e.target.getAttribute("data-edit-semester");
      const deleteSemesterId = e.target.getAttribute("data-delete-semester");

      if (editYearId) editAcademicYear(editYearId);
      if (deleteYearId) await deleteAcademicYear(deleteYearId);
      if (editSemesterId) editSemester(editSemesterId);
      if (deleteSemesterId) await deleteSemester(deleteSemesterId);
    });
  }

  if (plannerList) {
    plannerList.addEventListener("click", async function (e) {
      const toggleId = e.target.getAttribute("data-toggle-task");
      const editId = e.target.getAttribute("data-edit-task");
      const deleteId = e.target.getAttribute("data-delete-task");
      const viewId = e.target.getAttribute("data-view-task");
      const taskStatusId = e.target.getAttribute("data-task-status");
      const nextStatus = e.target.getAttribute("data-status-value");

      if (toggleId !== null) {
        const box = $("taskExpanded-" + toggleId);
        if (box) box.classList.toggle("hidden");
        return;
      }

      if (viewId !== null) {
        const task = tasks.find(function (item) {
          return String(item.id) === String(viewId);
        });
        if (task) openTaskDetails(task);
      }

      if (editId !== null) editTask(editId);
      if (deleteId !== null) await deleteTaskFromSupabase(deleteId);
      if (taskStatusId !== null && nextStatus) await updateTaskStatus(taskStatusId, nextStatus);
    });
  }

  if (examsList) {
    examsList.addEventListener("click", async function (e) {
      const viewId = e.target.getAttribute("data-view-exam");
      const editId = e.target.getAttribute("data-edit-exam");
      const deleteId = e.target.getAttribute("data-delete-exam");

      if (viewId !== null) {
        const exam = exams.find(function (item) {
          return String(item.id) === String(viewId);
        });
        if (exam) openExamDetails(exam);
      }

      if (editId !== null) editExam(editId);
      if (deleteId !== null) await deleteExamFromSupabase(deleteId);
    });
  }

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener("click", function () {
      if (!tabNav) return;
      if (window.innerWidth <= 640) {
        tabNav.classList.toggle("menu-open");
      }
    });
  }

  if (monthViewBtn) monthViewBtn.addEventListener("click", function () { setCalendarView("month"); });
  if (weekViewBtn) weekViewBtn.addEventListener("click", function () { setCalendarView("week"); });
  if (dayViewBtn) dayViewBtn.addEventListener("click", function () { setCalendarView("day"); });
  if (prevPeriodBtn) prevPeriodBtn.addEventListener("click", function () { moveCalendar(-1); });
  if (nextPeriodBtn) nextPeriodBtn.addEventListener("click", function () { moveCalendar(1); });

  if (saveAcademicYearBtn) saveAcademicYearBtn.addEventListener("click", saveAcademicYear);
  if (saveSemesterBtn) saveSemesterBtn.addEventListener("click", saveSemester);
  if (addSessionBtn) addSessionBtn.addEventListener("click", addPendingSession);
  if (saveCourseBtn) saveCourseBtn.addEventListener("click", saveCourse);
  if (saveNoteBtn) saveNoteBtn.addEventListener("click", saveNote);
  if (addTaskBtn) addTaskBtn.addEventListener("click", saveTask);
  if (saveExamBtn) saveExamBtn.addEventListener("click", saveExam);

  if (signUpBtn) signUpBtn.addEventListener("click", signUp);
  if (signInBtn) signInBtn.addEventListener("click", signIn);
  if (signOutBtn) signOutBtn.addEventListener("click", signOut);

  document.addEventListener("click", function (e) {
    const direct = e.target.getAttribute("data-calendar-item");
    const parent = e.target.closest("[data-calendar-item]");
    const itemId = direct || (parent ? parent.getAttribute("data-calendar-item") : null);
    if (itemId) openCalendarItem(itemId);
  });

  supabase.auth.onAuthStateChange(async function (_event, session) {
    setAuthUI(session ? session.user : null);

    await loadAcademicYears();
    await loadSemesters();
    await loadCourses();
    await loadCourseSessions();
    await loadNotes();
    await loadTasks();
    await loadExams();

    refreshAcademicYearOptions();
    refreshSemesterOptions();
    refreshTaskCourseOptions();
  });

  async function init() {
    const user = await getCurrentUser();
    setAuthUI(user);

    await loadAcademicYears();
    await loadSemesters();
    await loadCourses();
    await loadCourseSessions();
    await loadNotes();
    await loadTasks();
    await loadExams();

    refreshAcademicYearOptions();
    refreshSemesterOptions();
    refreshTaskCourseOptions();
    renderPendingSessions();
    renderDashboard();
    setCalendarView("month");
  }

  init();
});
