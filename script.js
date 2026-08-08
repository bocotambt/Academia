document.addEventListener("DOMContentLoaded", function () {
  function $(id) {
    return document.getElementById(id);
  }

  function getSavedArray(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      localStorage.removeItem(key);
      return [];
    }
  }

  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  const openModalButtons = document.querySelectorAll(".open-modal-btn");
  const closeModalButtons = document.querySelectorAll(".close-modal-btn");

  let academicYears = getSavedArray("academicYears");
  let semesters = getSavedArray("semesters");
  let courses = getSavedArray("courses");
  let notes = getSavedArray("notes");
  let tasks = getSavedArray("tasks");
  let customEvents = getSavedArray("customEvents");

  let pendingSessions = [];
  let editingAcademicYearId = null;
  let editingSemesterId = null;
  let editingCourseId = null;
  let editingNoteId = null;
  let editingTaskId = null;
  let editingEventId = null;

  let currentCalendarDate = new Date();
  let currentCalendarView = "month";

  const pageTitle = $("pageTitle");

  const totalAcademicYearsEl = $("totalAcademicYears");
  const totalCoursesEl = $("totalCourses");
  const totalTasksEl = $("totalTasks");
  const totalEventsEl = $("totalEvents");

  const academicYearsList = $("academicYearsList");
  const coursesList = $("coursesList");
  const notesList = $("notesList");
  const plannerList = $("plannerList");
  const dashboardAllTasks = $("dashboardAllTasks");
  const dashboardToday = $("dashboardToday");
  const dashboardTomorrow = $("dashboardTomorrow");

  const academicYearModalTitle = $("academicYearModalTitle");
  const academicYearNameInput = $("academicYearName");
  const saveAcademicYearBtn = $("saveAcademicYearBtn");

  const semesterModalTitle = $("semesterModalTitle");
  const semesterAcademicYearInput = $("semesterAcademicYear");
  const semesterNameInput = $("semesterName");
  const semesterStartDateInput = $("semesterStartDate");
  const semesterEndDateInput = $("semesterEndDate");
  const saveSemesterBtn = $("saveSemesterBtn");

  const courseModalTitle = $("courseModalTitle");
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
  const saveCourseBtn = $("saveCourseBtn");
  const pendingSessionsList = $("pendingSessionsList");

  const noteModalTitle = $("noteModalTitle");
  const noteTitleInput = $("noteTitle");
  const noteContentInput = $("noteContent");
  const saveNoteBtn = $("saveNoteBtn");

  const taskModalTitle = $("taskModalTitle");
  const taskTitleInput = $("taskTitle");
  const taskDetailsInput = $("taskDetails");
  const taskCourseInput = $("taskCourse");
  const taskDateInput = $("taskDate");
  const taskPriorityInput = $("taskPriority");
  const taskStatusInput = $("taskStatus");
  const addTaskBtn = $("addTaskBtn");

  const eventModalTitle = $("eventModalTitle");
  const eventTitleInput = $("eventTitle");
  const eventDetailsInput = $("eventDetails");
  const eventDateInput = $("eventDate");
  const eventStartTimeInput = $("eventStartTime");
  const eventEndTimeInput = $("eventEndTime");
  const saveEventBtn = $("saveEventBtn");

  const detailTitle = $("detailTitle");
  const detailBody = $("detailBody");

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

  function saveAcademicYears() {
    localStorage.setItem("academicYears", JSON.stringify(academicYears));
  }

  function saveSemesters() {
    localStorage.setItem("semesters", JSON.stringify(semesters));
  }

  function saveCourses() {
    localStorage.setItem("courses", JSON.stringify(courses));
  }

  function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function saveCustomEvents() {
    localStorage.setItem("customEvents", JSON.stringify(customEvents));
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

      if (modalId === "academicYearModal") resetAcademicYearModal();
      if (modalId === "semesterModal") {
        resetSemesterModal();
        fillAcademicYearOptions();
      }
      if (modalId === "courseModal") {
        resetCourseModal();
        fillSemesterOptions();
      }
      if (modalId === "noteModal") {
        resetNoteModal();
      }
      if (modalId === "taskModal") {
        resetTaskModal();
        fillCourseOptions();
      }
      if (modalId === "eventModal") {
        resetEventModal();
      }

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
      academic: "Academic",
      courses: "Courses",
      notes: "Notes",
      planner: "Tasks",
      calendar: "Calendar"
    };

    if (pageTitle) {
      pageTitle.textContent = titles[tabId] || "Academia";
    }

    if (tabId === "calendar") renderCalendar();
    if (tabId === "dashboard") renderDashboard();
  }

  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      showTab(button.dataset.tab);
    });
  });

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

  function isDateBetween(dateKey, startKey, endKey) {
    return dateKey >= startKey && dateKey <= endKey;
  }

  function getSemesterById(id) {
    return semesters.find(function (semester) {
      return semester.id === id;
    });
  }

  function getAcademicYearById(id) {
    return academicYears.find(function (year) {
      return year.id === id;
    });
  }

  function getCourseById(id) {
    return courses.find(function (course) {
      return course.id === id;
    });
  }

  function dayNameToNumber(dayName) {
    return {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6
    }[dayName];
  }

  function getDatesForWeeklySessionInRange(dayName, startKey, endKey) {
    const results = [];
    const dayNumber = dayNameToNumber(dayName);
    let current = new Date(startKey + "T00:00:00");
    const end = new Date(endKey + "T00:00:00");

    while (current <= end) {
      if (current.getDay() === dayNumber) {
        results.push(formatDateKey(current));
      }
      current.setDate(current.getDate() + 1);
    }

    return results;
  }

  function updateDashboard() {
    if (totalAcademicYearsEl) totalAcademicYearsEl.textContent = academicYears.length;
    if (totalCoursesEl) totalCoursesEl.textContent = courses.length;
    if (totalTasksEl) totalTasksEl.textContent = tasks.length;
    if (totalEventsEl) totalEventsEl.textContent = getAllCalendarItems().length;
  }

  function fillAcademicYearOptions() {
    if (!semesterAcademicYearInput) return;

    semesterAcademicYearInput.innerHTML = "";

    if (academicYears.length === 0) {
      semesterAcademicYearInput.innerHTML = '<option value="">No academic year yet</option>';
      return;
    }

    academicYears.forEach(function (year) {
      const option = document.createElement("option");
      option.value = year.id;
      option.textContent = year.name;
      semesterAcademicYearInput.appendChild(option);
    });
  }

  function fillSemesterOptions() {
    if (!courseSemesterInput) return;

    courseSemesterInput.innerHTML = "";

    if (semesters.length === 0) {
      courseSemesterInput.innerHTML = '<option value="">No semester yet</option>';
      return;
    }

    semesters.forEach(function (semester) {
      const year = getAcademicYearById(semester.academicYearId);
      const option = document.createElement("option");
      option.value = semester.id;
      option.textContent = semester.name + " (" + (year ? year.name : "No Year") + ")";
      courseSemesterInput.appendChild(option);
    });
  }

  function fillCourseOptions() {
    if (!taskCourseInput) return;

    taskCourseInput.innerHTML = "";

    const optionNone = document.createElement("option");
    optionNone.value = "";
    optionNone.textContent = "(No course)";
    taskCourseInput.appendChild(optionNone);

    courses.forEach(function (course) {
      const option = document.createElement("option");
      option.value = course.id;
      option.textContent = course.code + " - " + course.name;
      taskCourseInput.appendChild(option);
    });
  }

  function resetAcademicYearModal() {
    if (!academicYearNameInput) return;

    academicYearModalTitle.textContent = "Add Academic Year";
    academicYearNameInput.value = "";
    editingAcademicYearId = null;
    saveAcademicYearBtn.textContent = "Save Academic Year";
  }

  function saveAcademicYear() {
    const name = academicYearNameInput.value.trim();

    if (!name) {
      alert("Please enter an academic year name.");
      return;
    }

    const academicYearData = {
      id: editingAcademicYearId || Date.now(),
      name: name
    };

    if (editingAcademicYearId) {
      academicYears = academicYears.map(function (year) {
        return year.id === editingAcademicYearId ? academicYearData : year;
      });
    } else {
      academicYears.push(academicYearData);
    }

    saveAcademicYears();
    renderAcademicYears();
    updateDashboard();
    closeModal("academicYearModal");
    resetAcademicYearModal();
  }

  function editAcademicYear(id) {
    const year = getAcademicYearById(id);
    if (!year) return;

    academicYearModalTitle.textContent = "Edit Academic Year";
    academicYearNameInput.value = year.name;
    editingAcademicYearId = id;
    saveAcademicYearBtn.textContent = "Update Academic Year";
    openModal("academicYearModal");
  }

  function deleteAcademicYear(id) {
    const yearSemesters = semesters.filter(function (semester) {
      return semester.academicYearId === id;
    });

    if (yearSemesters.length > 0) {
      alert("Delete the semesters inside this academic year first.");
      return;
    }

    academicYears = academicYears.filter(function (year) {
      return year.id !== id;
    });

    saveAcademicYears();
    renderAcademicYears();
    updateDashboard();
  }

  function resetSemesterModal() {
    semesterModalTitle.textContent = "Add Semester";
    semesterNameInput.value = "";
    semesterStartDateInput.value = "";
    semesterEndDateInput.value = "";
    editingSemesterId = null;
    saveSemesterBtn.textContent = "Save Semester";
  }

  function saveSemester() {
    const academicYearId = Number(semesterAcademicYearInput.value);
    const name = semesterNameInput.value.trim();
    const startDate = semesterStartDateInput.value;
    const endDate = semesterEndDateInput.value;

    if (!academicYearId || !name || !startDate || !endDate) {
      alert("Please complete all semester fields.");
      return;
    }

    if (endDate < startDate) {
      alert("Semester end date cannot be before start date.");
      return;
    }

    const semesterData = {
      id: editingSemesterId || Date.now(),
      academicYearId: academicYearId,
      name: name,
      startDate: startDate,
      endDate: endDate
    };

    if (editingSemesterId) {
      semesters = semesters.map(function (semester) {
        return semester.id === editingSemesterId ? semesterData : semester;
      });
    } else {
      semesters.push(semesterData);
    }

    saveSemesters();
    renderAcademicYears();
    renderCourses();
    renderCalendar();
    updateDashboard();
    closeModal("semesterModal");
    resetSemesterModal();
  }

  function editSemester(id) {
    const semester = getSemesterById(id);
    if (!semester) return;

    fillAcademicYearOptions();
    semesterModalTitle.textContent = "Edit Semester";
    semesterAcademicYearInput.value = semester.academicYearId;
    semesterNameInput.value = semester.name;
    semesterStartDateInput.value = semester.startDate;
    semesterEndDateInput.value = semester.endDate;
    editingSemesterId = id;
    saveSemesterBtn.textContent = "Update Semester";
    openModal("semesterModal");
  }

  function deleteSemester(id) {
    const semesterCourses = courses.filter(function (course) {
      return course.semesterId === id;
    });

    if (semesterCourses.length > 0) {
      alert("Delete or move courses in this semester first.");
      return;
    }

    semesters = semesters.filter(function (semester) {
      return semester.id !== id;
    });

    saveSemesters();
    renderAcademicYears();
    renderCourses();
    renderCalendar();
    updateDashboard();
  }

  function renderAcademicYears() {
    if (!academicYearsList) return;

    academicYearsList.innerHTML = "";

    if (academicYears.length === 0) {
      academicYearsList.innerHTML = '<div class="empty-state">No academic years added yet.</div>';
      return;
    }

    academicYears.forEach(function (year) {
      const card = document.createElement("div");
      card.className = "academic-card";

      const yearSemesters = semesters.filter(function (semester) {
        return semester.academicYearId === year.id;
      });

      const semestersHtml = yearSemesters.length === 0
        ? '<div class="empty-state">No semesters yet.</div>'
        : yearSemesters.map(function (semester) {
            return `
              <div class="semester-box">
                <strong>${semester.name}</strong>
                <p class="meta">${formatDateLabel(semester.startDate)} - ${formatDateLabel(semester.endDate)}</p>
                <div class="card-actions">
                  <button class="edit-btn" data-edit-semester="${semester.id}" type="button">Edit Semester</button>
                  <button class="delete-btn" data-delete-semester="${semester.id}" type="button">Delete Semester</button>
                </div>
              </div>
            `;
          }).join("");

      card.innerHTML = `
        <h3>${year.name}</h3>
        <div class="card-actions">
          <button class="edit-btn" data-edit-year="${year.id}" type="button">Edit Year</button>
          <button class="delete-btn" data-delete-year="${year.id}" type="button">Delete Year</button>
        </div>
        <div>${semestersHtml}</div>
      `;

      academicYearsList.appendChild(card);
    });
  }

  if (academicYearsList) {
    academicYearsList.addEventListener("click", function (e) {
      const editYearId = e.target.getAttribute("data-edit-year");
      const deleteYearId = e.target.getAttribute("data-delete-year");
      const editSemesterIdValue = e.target.getAttribute("data-edit-semester");
      const deleteSemesterIdValue = e.target.getAttribute("data-delete-semester");

      if (editYearId !== null) editAcademicYear(Number(editYearId));
      if (deleteYearId !== null) deleteAcademicYear(Number(deleteYearId));
      if (editSemesterIdValue !== null) editSemester(Number(editSemesterIdValue));
      if (deleteSemesterIdValue !== null) deleteSemester(Number(deleteSemesterIdValue));
    });
  }

  function updateSessionInputs() {
    if (!sessionRepeatInput) return;

    if (sessionRepeatInput.value === "weekly") {
      sessionDayInput.disabled = false;
      sessionDateInput.disabled = true;
      sessionDateInput.value = "";
    } else {
      sessionDayInput.disabled = true;
      sessionDayInput.value = "";
      sessionDateInput.disabled = false;
    }
  }

  function renderPendingSessions() {
    if (!pendingSessionsList) return;

    pendingSessionsList.innerHTML = "";

    if (pendingSessions.length === 0) {
      pendingSessionsList.innerHTML = "<li>No sessions added yet.</li>";
      return;
    }

    pendingSessions.forEach(function (session, index) {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${session.type}</strong><br>
        ${session.repeat === "weekly"
          ? session.day + " • " + session.startTime + " - " + session.endTime + " • Weekly"
          : session.date + " • " + session.startTime + " - " + session.endTime + " • Specific Date"}
        <br>
        <span class="meta">Location: ${session.location || "Not set"}</span>
        <br>
        <button class="delete-btn" data-remove-session="${index}" type="button">Remove</button>
      `;
      pendingSessionsList.appendChild(li);
    });
  }

  if (pendingSessionsList) {
    pendingSessionsList.addEventListener("click", function (e) {
      const index = e.target.getAttribute("data-remove-session");
      if (index !== null) {
        pendingSessions.splice(Number(index), 1);
        renderPendingSessions();
      }
    });
  }

  function resetCourseModal() {
    courseModalTitle.textContent = "Add Course";
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
    sessionLocationInput.value = "";
    pendingSessions = [];
    editingCourseId = null;
    saveCourseBtn.textContent = "Save Course";
    fillSemesterOptions();
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
    const location = sessionLocationInput.value.trim();

    if (!startTime || !endTime) {
      alert("Please enter both start and end time.");
      return;
    }

    if (repeat === "weekly" && !day) {
      alert("Please choose a day for a weekly session.");
      return;
    }

    if (repeat === "specific" && !date) {
      alert("Please choose a specific date.");
      return;
    }

    pendingSessions.push({
      id: Date.now() + Math.random(),
      type: type,
      repeat: repeat,
      day: day,
      date: date,
      startTime: startTime,
      endTime: endTime,
      location: location
    });

    sessionTypeInput.value = "Lecture";
    sessionRepeatInput.value = "weekly";
    sessionDayInput.value = "";
    sessionDateInput.value = "";
    sessionStartTimeInput.value = "";
    sessionEndTimeInput.value = "";
    sessionLocationInput.value = "";
    updateSessionInputs();
    renderPendingSessions();
  }

  function saveCourse() {
    const name = courseNameInput.value.trim();
    const code = courseCodeInput.value.trim();
    const instructor = courseInstructorInput.value.trim();
    const color = courseColorInput.value;
    const semesterId = Number(courseSemesterInput.value);

    if (!name || !code) {
      alert("Please enter both course name and course code.");
      return;
    }

    if (!semesterId) {
      alert("Please select a semester.");
      return;
    }

    if (pendingSessions.length === 0) {
      alert("Please add at least one session.");
      return;
    }

    const semester = getSemesterById(semesterId);
    if (!semester) {
      alert("Selected semester was not found.");
      return;
    }

    const invalidSpecificSession = pendingSessions.find(function (session) {
      return session.repeat === "specific" && !isDateBetween(session.date, semester.startDate, semester.endDate);
    });

    if (invalidSpecificSession) {
      alert("A specific-date session is outside the selected semester.");
      return;
    }

    const courseData = {
      id: editingCourseId || Date.now(),
      name: name,
      code: code,
      instructor: instructor,
      color: color,
      semesterId: semesterId,
      sessions: pendingSessions.slice()
    };

    if (editingCourseId) {
      courses = courses.map(function (course) {
        return course.id === editingCourseId ? courseData : course;
      });
    } else {
      courses.push(courseData);
    }

    saveCourses();
    renderCourses();
    fillCourseOptions();
    renderCalendar();
    renderDashboard();
    updateDashboard();
    closeModal("courseModal");
    resetCourseModal();
  }

  function editCourse(id) {
    const course = courses.find(function (item) {
      return item.id === id;
    });

    if (!course) return;

    fillSemesterOptions();
    courseModalTitle.textContent = "Edit Course";
    courseNameInput.value = course.name || "";
    courseCodeInput.value = course.code || "";
    courseInstructorInput.value = course.instructor || "";
    courseColorInput.value = course.color || "#2563eb";
    courseSemesterInput.value = course.semesterId || "";
    pendingSessions = Array.isArray(course.sessions) ? course.sessions.slice() : [];
    editingCourseId = id;
    saveCourseBtn.textContent = "Update Course";
    updateSessionInputs();
    renderPendingSessions();
    openModal("courseModal");
  }

  function deleteCourse(id) {
    tasks = tasks.map(function (task) {
      if (task.courseId === id) {
        return {
          id: task.id,
          title: task.title,
          details: task.details,
          courseId: null,
          date: task.date,
          priority: task.priority,
          status: task.status
        };
      }
      return task;
    });

    courses = courses.filter(function (course) {
      return course.id !== id;
    });

    saveTasks();
    saveCourses();
    renderCourses();
    fillCourseOptions();
    renderTasks();
    renderCalendar();
    renderDashboard();
    updateDashboard();
  }

  function renderCourses() {
    if (!coursesList) return;

    coursesList.innerHTML = "";

    if (courses.length === 0) {
      coursesList.innerHTML = '<div class="empty-state">No courses added yet.</div>';
      return;
    }

    courses.forEach(function (course) {
      const card = document.createElement("div");
      card.className = "course-card";

      const semester = getSemesterById(course.semesterId);
      const year = semester ? getAcademicYearById(semester.academicYearId) : null;
      const sessions = Array.isArray(course.sessions) ? course.sessions : [];

      const sessionsHtml = sessions.map(function (session) {
        return `
          <div class="planner-item">
            <span class="course-badge" style="background:${course.color};">${session.type}</span>
            <p class="meta">
              ${session.repeat === "weekly"
                ? session.day + " • " + session.startTime + " - " + session.endTime + " • Weekly"
                : session.date + " • " + session.startTime + " - " + session.endTime + " • Specific Date"}
              <br>Location: ${session.location || "Not set"}
            </p>
          </div>
        `;
      }).join("");

      card.innerHTML = `
        <h3>${course.name} (${course.code})</h3>
        <p class="meta">Instructor: ${course.instructor || "N/A"}</p>
        <p class="meta">Semester: ${semester ? semester.name : "N/A"}${year ? " • " + year.name : ""}</p>
        <div class="course-badge" style="background:${course.color};">${course.code}</div>
        <div>${sessionsHtml}</div>
        <div class="card-actions">
          <button class="edit-btn" data-edit-course="${course.id}" type="button">Edit</button>
          <button class="delete-btn" data-delete-course="${course.id}" type="button">Delete</button>
        </div>
      `;
      coursesList.appendChild(card);
    });
  }

  if (coursesList) {
    coursesList.addEventListener("click", function (e) {
      const editId = e.target.getAttribute("data-edit-course");
      const deleteId = e.target.getAttribute("data-delete-course");

      if (editId !== null) editCourse(Number(editId));
      if (deleteId !== null) deleteCourse(Number(deleteId));
    });
  }

  function resetNoteModal() {
    noteModalTitle.textContent = "Add Note";
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
      title: title,
      content: content
    };

    if (editingNoteId) {
      notes = notes.map(function (note) {
        return note.id === editingNoteId ? noteData : note;
      });
    } else {
      notes.unshift(noteData);
    }

    saveNotes();
    renderNotes();
    closeModal("noteModal");
    resetNoteModal();
  }

  function editNote(id) {
    const note = notes.find(function (item) {
      return item.id === id;
    });

    if (!note) return;

    noteModalTitle.textContent = "Edit Note";
    noteTitleInput.value = note.title || "";
    noteContentInput.value = note.content || "";
    editingNoteId = id;
    saveNoteBtn.textContent = "Update Note";
    openModal("noteModal");
  }

  function deleteNote(id) {
    notes = notes.filter(function (note) {
      return note.id !== id;
    });
    saveNotes();
    renderNotes();
  }

  function renderNotes() {
    if (!notesList) return;

    notesList.innerHTML = "";

    if (notes.length === 0) {
      notesList.innerHTML = '<div class="empty-state">No notes saved yet.</div>';
      return;
    }

    notes.forEach(function (note) {
      const card = document.createElement("div");
      card.className = "note-card";
      card.innerHTML = `
        <h3>${note.title}</h3>
        <p class="meta">${String(note.content || "").replace(/\n/g, "<br>")}</p>
        <div class="card-actions">
          <button class="edit-btn" data-edit-note="${note.id}" type="button">Edit</button>
          <button class="delete-btn" data-delete-note="${note.id}" type="button">Delete</button>
        </div>
      `;
      notesList.appendChild(card);
    });
  }

  if (notesList) {
    notesList.addEventListener("click", function (e) {
      const editId = e.target.getAttribute("data-edit-note");
      const deleteId = e.target.getAttribute("data-delete-note");

      if (editId !== null) editNote(Number(editId));
      if (deleteId !== null) deleteNote(Number(deleteId));
    });
  }

  function resetTaskModal() {
    taskModalTitle.textContent = "Add Task";
    taskTitleInput.value = "";
    taskDetailsInput.value = "";
    if (taskCourseInput) taskCourseInput.value = "";
    taskDateInput.value = "";
    taskPriorityInput.value = "High";
    taskStatusInput.value = "To Do";
    editingTaskId = null;
    addTaskBtn.textContent = "Save Task";
  }

  function saveTask() {
    const title = taskTitleInput.value.trim();
    const details = taskDetailsInput.value.trim();
    const courseId = taskCourseInput && taskCourseInput.value ? Number(taskCourseInput.value) : null;
    const date = taskDateInput.value;
    const priority = taskPriorityInput.value;
    const status = taskStatusInput.value;

    if (!title || !date) {
      alert("Please enter both task title and due date.");
      return;
    }

    const taskData = {
      id: editingTaskId || Date.now(),
      title: title,
      details: details,
      courseId: courseId,
      date: date,
      priority: priority,
      status: status
    };

    if (editingTaskId) {
      tasks = tasks.map(function (task) {
        return task.id === editingTaskId ? taskData : task;
      });
    } else {
      tasks.unshift(taskData);
    }

    saveTasks();
    renderTasks();
    renderDashboard();
    renderCalendar();
    updateDashboard();
    closeModal("taskModal");
    resetTaskModal();
  }

  function editTask(id) {
    const task = tasks.find(function (item) {
      return item.id === id;
    });

    if (!task) return;

    fillCourseOptions();
    taskModalTitle.textContent = "Edit Task";
    taskTitleInput.value = task.title || "";
    taskDetailsInput.value = task.details || "";
    if (taskCourseInput) taskCourseInput.value = task.courseId || "";
    taskDateInput.value = task.date || "";
    taskPriorityInput.value = task.priority || "High";
    taskStatusInput.value = task.status || "To Do";
    editingTaskId = id;
    addTaskBtn.textContent = "Update Task";
    openModal("taskModal");
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (task) {
      return task.id !== id;
    });
    saveTasks();
    renderTasks();
    renderDashboard();
    renderCalendar();
    updateDashboard();
  }

  function updateTaskStatus(id, status) {
    tasks = tasks.map(function (task) {
      if (task.id === id) {
        return {
          id: task.id,
          title: task.title,
          details: task.details,
          courseId: task.courseId,
          date: task.date,
          priority: task.priority,
          status: status
        };
      }
      return task;
    });

    saveTasks();
    renderTasks();
    renderDashboard();
    renderCalendar();
    updateDashboard();
  }

  function renderTasks() {
    if (!plannerList) return;

    plannerList.innerHTML = "";

    if (tasks.length === 0) {
      plannerList.innerHTML = '<div class="empty-state">No tasks added yet.</div>';
      return;
    }

    tasks.forEach(function (task) {
      const card = document.createElement("div");
      card.className = "day-card";

      const priorityClass =
        task.priority === "High" ? "priority-high" :
        task.priority === "Medium" ? "priority-medium" :
        "priority-low";

      const statusClass =
        task.status === "To Do" ? "status-todo" :
        task.status === "In Progress" ? "status-progress" :
        "status-done";

      const course = task.courseId ? getCourseById(task.courseId) : null;
      const courseBadge = course
        ? `<span class="course-badge" style="background:${course.color};">${course.code}</span>`
        : "";

      card.innerHTML = `
        <h3>${task.title}</h3>
        ${courseBadge}
        <span class="priority-badge ${priorityClass}">${task.priority}</span>
        <span class="status-badge ${statusClass}">${task.status}</span>
        <p class="meta">Due: ${task.date}</p>
        <p class="meta">${task.details ? String(task.details).replace(/\n/g, "<br>") : "No details added."}</p>

        <div class="inline-status-controls">
          <button class="mini-btn secondary-btn" data-task-status="${task.id}" data-status-value="To Do" type="button">To Do</button>
          <button class="mini-btn secondary-btn" data-task-status="${task.id}" data-status-value="In Progress" type="button">In Progress</button>
          <button class="mini-btn secondary-btn" data-task-status="${task.id}" data-status-value="Done" type="button">Done</button>
        </div>

        <div class="card-actions">
          <button class="edit-btn" data-edit-task="${task.id}" type="button">Edit</button>
          <button class="delete-btn" data-delete-task="${task.id}" type="button">Delete</button>
        </div>
      `;
      plannerList.appendChild(card);
    });
  }

  if (plannerList) {
    plannerList.addEventListener("click", function (e) {
      const editId = e.target.getAttribute("data-edit-task");
      const deleteId = e.target.getAttribute("data-delete-task");
      const taskStatusId = e.target.getAttribute("data-task-status");
      const nextStatus = e.target.getAttribute("data-status-value");

      if (editId !== null) editTask(Number(editId));
      if (deleteId !== null) deleteTask(Number(deleteId));
      if (taskStatusId !== null && nextStatus) updateTaskStatus(Number(taskStatusId), nextStatus);
    });
  }

  function resetEventModal() {
    eventModalTitle.textContent = "Add Event";
    eventTitleInput.value = "";
    eventDetailsInput.value = "";
    eventDateInput.value = "";
    eventStartTimeInput.value = "";
    eventEndTimeInput.value = "";
    editingEventId = null;
    saveEventBtn.textContent = "Save Event";
  }

  function saveCustomEventItem() {
    const title = eventTitleInput.value.trim();
    const details = eventDetailsInput.value.trim();
    const date = eventDateInput.value;
    const startTime = eventStartTimeInput.value;
    const endTime = eventEndTimeInput.value;

    if (!title || !date || !startTime || !endTime) {
      alert("Please complete all event fields.");
      return;
    }

    const eventData = {
      id: editingEventId || Date.now(),
      title: title,
      details: details,
      date: date,
      startTime: startTime,
      endTime: endTime
    };

    if (editingEventId) {
      customEvents = customEvents.map(function (event) {
        return event.id === editingEventId ? eventData : event;
      });
    } else {
      customEvents.unshift(eventData);
    }

    saveCustomEvents();
    renderCalendar();
    renderDashboard();
    updateDashboard();
    closeModal("eventModal");
    resetEventModal();
  }

  function getAllCalendarItems() {
    const items = [];

    courses.forEach(function (course) {
      const semester = getSemesterById(course.semesterId);
      if (!semester) return;

      const sessions = Array.isArray(course.sessions) ? course.sessions : [];

      sessions.forEach(function (session) {
        if (session.repeat === "specific" && session.date) {
          if (isDateBetween(session.date, semester.startDate, semester.endDate)) {
            items.push({
              type: "course",
              id: "course-" + course.id + "-" + session.id,
              title: course.code + " " + session.type,
              date: session.date,
              timeLabel: session.startTime + " - " + session.endTime,
              color: course.color || "#2563eb",
              data: {
                courseName: course.name,
                courseCode: course.code,
                instructor: course.instructor || "N/A",
                sessionType: session.type,
                location: session.location || "Not set",
                repeat: "Specific Date",
                semesterName: semester.name,
                startTime: session.startTime,
                endTime: session.endTime
              }
            });
          }
        }

        if (session.repeat === "weekly" && session.day) {
          const dates = getDatesForWeeklySessionInRange(
            session.day,
            semester.startDate,
            semester.endDate
          );

          dates.forEach(function (dateKey) {
            items.push({
              type: "course",
              id: "course-" + course.id + "-" + session.id + "-" + dateKey,
              title: course.code + " " + session.type,
              date: dateKey,
              timeLabel: session.startTime + " - " + session.endTime,
              color: course.color || "#2563eb",
              data: {
                courseName: course.name,
                courseCode: course.code,
                instructor: course.instructor || "N/A",
                sessionType: session.type,
                location: session.location || "Not set",
                repeat: "Weekly on " + session.day,
                semesterName: semester.name,
                startTime: session.startTime,
                endTime: session.endTime
              }
            });
          });
        }
      });
    });

    tasks.forEach(function (task) {
      const course = task.courseId ? getCourseById(task.courseId) : null;
      items.push({
        type: "task",
        id: "task-" + task.id,
        title: (course ? course.code + " • " : "") + "Task: " + task.title,
        date: task.date,
        timeLabel: "All day",
        color: course ? course.color : "#dc2626",
        data: {
          title: task.title,
          dueDate: task.date,
          priority: task.priority,
          status: task.status,
          details: task.details || "No details added.",
          courseName: course ? course.name : null
        }
      });
    });

    customEvents.forEach(function (event) {
      items.push({
        type: "custom",
        id: "custom-" + event.id,
        title: event.title,
        date: event.date,
        timeLabel: event.startTime + " - " + event.endTime,
        color: "#0f766e",
        data: {
          title: event.title,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
          details: event.details || "No details added."
        }
      });
    });

    return items;
  }

  function getItemsForDate(dateKey) {
    return getAllCalendarItems().filter(function (item) {
      return item.date === dateKey;
    }).sort(function (a, b) {
      return String(a.timeLabel).localeCompare(String(b.timeLabel));
    });
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

  function openCalendarItem(itemId) {
    const item = getAllCalendarItems().find(function (entry) {
      return entry.id === itemId;
    });

    if (!item) return;

    if (item.type === "task") {
      showDetailModal(item.title, [
        ["Type", "Task"],
        ["Title", item.data.title],
        ["Due Date", item.data.dueDate],
        ["Priority", item.data.priority],
        ["Status", item.data.status],
        ["Details", item.data.details],
        ["Course", item.data.courseName || "(No course)"]
      ]);
      return;
    }

    if (item.type === "custom") {
      showDetailModal(item.title, [
        ["Type", "Custom Event"],
        ["Title", item.data.title],
        ["Date", item.data.date],
        ["Start", item.data.startTime],
        ["End", item.data.endTime],
        ["Details", item.data.details]
      ]);
      return;
    }

    if (item.type === "course") {
      showDetailModal(item.title, [
        ["Type", "Course Session"],
        ["Course", item.data.courseName + " (" + item.data.courseCode + ")"],
        ["Session", item.data.sessionType],
        ["Instructor", item.data.instructor],
        ["Location", item.data.location],
        ["Semester", item.data.semesterName],
        ["Repeat", item.data.repeat],
        ["Date", item.date],
        ["Start", item.data.startTime],
        ["End", item.data.endTime]
      ]);
    }
  }

  function setCalendarView(view) {
    currentCalendarView = view;

    if (monthViewBtn) monthViewBtn.classList.remove("active-view-btn");
    if (weekViewBtn) weekViewBtn.classList.remove("active-view-btn");
    if (dayViewBtn) dayViewBtn.classList.remove("active-view-btn");

    if (monthCalendarWrap) monthCalendarWrap.classList.add("hidden");
    if (weekCalendarWrap) weekCalendarWrap.classList.add("hidden");
    if (dayCalendarWrap) dayCalendarWrap.classList.add("hidden");

    if (view === "month") {
      if (monthViewBtn) monthViewBtn.classList.add("active-view-btn");
      if (monthCalendarWrap) monthCalendarWrap.classList.remove("hidden");
    } else if (view === "week") {
      if (weekViewBtn) weekViewBtn.classList.add("active-view-btn");
      if (weekCalendarWrap) weekCalendarWrap.classList.remove("hidden");
    } else {
      if (dayViewBtn) dayViewBtn.classList.add("active-view-btn");
      if (dayCalendarWrap) dayCalendarWrap.classList.remove("hidden");
    }

    renderCalendar();
  }

  function renderMonthView() {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const monthLabel = currentCalendarDate.toLocaleString("en-US", {
      month: "long",
      year: "numeric"
    });

    if (calendarMonthLabel) calendarMonthLabel.textContent = monthLabel;
    if (!calendarGrid) return;

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
            style="background:${item.color};"
          >
            ${item.title}
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
    if (!weekCalendarGrid) return;

    const start = getStartOfWeek(currentCalendarDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    if (calendarMonthLabel) {
      calendarMonthLabel.textContent =
        formatDateLabel(formatDateKey(start)) + " - " + formatDateLabel(formatDateKey(end));
    }

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
                style="background:${item.color};"
              >
                ${item.timeLabel} • ${item.title}
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
    if (!dayCalendarGrid) return;

    const dateKey = formatDateKey(currentCalendarDate);
    const items = getItemsForDate(dateKey);

    const label = currentCalendarDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });

    if (calendarMonthLabel) calendarMonthLabel.textContent = label;

    const itemsHtml = items.length === 0
      ? '<div class="empty-state">No items for this day.</div>'
      : items.map(function (item) {
          return `
            <button
              type="button"
              class="calendar-item ${item.type}"
              data-calendar-item="${item.id}"
              title="${item.title}"
              style="background:${item.color};"
            >
              ${item.timeLabel} • ${item.title}
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
    if (currentCalendarView === "month") {
      renderMonthView();
    } else if (currentCalendarView === "week") {
      renderWeekView();
    } else {
      renderDayView();
    }
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

  function renderDashboardTasksList() {
    if (!dashboardAllTasks) return;

    dashboardAllTasks.innerHTML = "";

    if (tasks.length === 0) {
      dashboardAllTasks.innerHTML = '<div class="empty-state">No tasks yet.</div>';
      return;
    }

    tasks
      .slice()
      .sort(function (a, b) {
        return String(a.date).localeCompare(String(b.date));
      })
      .forEach(function (task) {
        const item = document.createElement("div");
        item.className = "detail-item";

        const course = task.courseId ? getCourseById(task.courseId) : null;
        const courseText = course ? " • " + course.code : "";

        item.innerHTML = `
          <strong>${task.title}${courseText}</strong>
          <div class="meta">Due ${task.date} • ${task.status} • ${task.priority}</div>
        `;

        dashboardAllTasks.appendChild(item);
      });
  }

  function renderDashboardDaySchedule(dayKey, container) {
    if (!container) return;

    const items = getItemsForDate(dayKey);
    container.innerHTML = "";

    if (items.length === 0) {
      container.innerHTML = '<div class="empty-state">No items scheduled.</div>';
      return;
    }

    items.forEach(function (item) {
      const row = document.createElement("div");
      row.className = "detail-item";
      row.innerHTML = `
        <strong>${item.title}</strong>
        <div class="meta">${item.timeLabel}</div>
      `;
      container.appendChild(row);
    });
  }

  function renderDashboard() {
    renderDashboardTasksList();

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    renderDashboardDaySchedule(formatDateKey(today), dashboardToday);
    renderDashboardDaySchedule(formatDateKey(tomorrow), dashboardTomorrow);
  }

  if (monthViewBtn) {
    monthViewBtn.addEventListener("click", function () {
      setCalendarView("month");
    });
  }

  if (weekViewBtn) {
    weekViewBtn.addEventListener("click", function () {
      setCalendarView("week");
    });
  }

  if (dayViewBtn) {
    dayViewBtn.addEventListener("click", function () {
      setCalendarView("day");
    });
  }

  if (prevPeriodBtn) {
    prevPeriodBtn.addEventListener("click", function () {
      moveCalendar(-1);
    });
  }

  if (nextPeriodBtn) {
    nextPeriodBtn.addEventListener("click", function () {
      moveCalendar(1);
    });
  }

  document.addEventListener("click", function (e) {
    const itemId = e.target.getAttribute("data-calendar-item");
    if (itemId) openCalendarItem(itemId);
  });

  if (addSessionBtn) addSessionBtn.addEventListener("click", addSession);
  if (saveCourseBtn) saveCourseBtn.addEventListener("click", saveCourse);
  if (saveAcademicYearBtn) saveAcademicYearBtn.addEventListener("click", saveAcademicYear);
  if (saveSemesterBtn) saveSemesterBtn.addEventListener("click", saveSemester);
  if (sessionRepeatInput) sessionRepeatInput.addEventListener("change", updateSessionInputs);
  if (saveNoteBtn) saveNoteBtn.addEventListener("click", saveNote);
  if (addTaskBtn) addTaskBtn.addEventListener("click", saveTask);
  if (saveEventBtn) saveEventBtn.addEventListener("click", saveCustomEventItem);

  updateSessionInputs();
  fillAcademicYearOptions();
  fillSemesterOptions();
  fillCourseOptions();
  resetAcademicYearModal();
  resetSemesterModal();
  resetCourseModal();
  resetNoteModal();
  resetTaskModal();
  resetEventModal();
  renderAcademicYears();
  renderCourses();
  renderNotes();
  renderTasks();
  renderDashboard();
  setCalendarView("month");
  updateDashboard();
});
