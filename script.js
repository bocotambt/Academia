document.addEventListener("DOMContentLoaded", function () {
  const $ = (id) => document.getElementById(id);
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  const openModalButtons = document.querySelectorAll(".open-modal-btn");
  const closeModalButtons = document.querySelectorAll(".close-modal-btn");

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

  let calendar = null;

  let courses = getSavedArray("courses");
  let notes = getSavedArray("notes");
  let tasks = getSavedArray("tasks");
  let customEvents = getSavedArray("customEvents");

  let pendingSessions = [];
  let editingCourseId = null;
  let editingNoteId = null;
  let editingTaskId = null;
  let editingEventId = null;

  const pageTitle = $("pageTitle");

  const courseNameInput = $("courseName");
  const courseCodeInput = $("courseCode");
  const courseInstructorInput = $("courseInstructor");
  const courseColorInput = $("courseColor");
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
  const coursesList = $("coursesList");
  const courseModalTitle = $("courseModalTitle");

  const noteTitleInput = $("noteTitle");
  const noteContentInput = $("noteContent");
  const saveNoteBtn = $("saveNoteBtn");
  const notesList = $("notesList");
  const noteModalTitle = $("noteModalTitle");

  const taskTitleInput = $("taskTitle");
  const taskDetailsInput = $("taskDetails");
  const taskDateInput = $("taskDate");
  const taskPriorityInput = $("taskPriority");
  const taskStatusInput = $("taskStatus");
  const addTaskBtn = $("addTaskBtn");
  const plannerList = $("plannerList");
  const taskModalTitle = $("taskModalTitle");

  const eventTitleInput = $("eventTitle");
  const eventDetailsInput = $("eventDetails");
  const eventDateInput = $("eventDate");
  const eventStartTimeInput = $("eventStartTime");
  const eventEndTimeInput = $("eventEndTime");
  const saveEventBtn = $("saveEventBtn");
  const eventModalTitle = $("eventModalTitle");

  const totalCoursesEl = $("totalCourses");
  const totalTasksEl = $("totalTasks");
  const totalEventsEl = $("totalEvents");
  const dashboardTasks = $("dashboardTasks");
  const dashboardNotes = $("dashboardNotes");

  const detailTitle = $("detailTitle");
  const detailBody = $("detailBody");

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

  openModalButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.dataset.openModal;
      if (modalId === "courseModal") resetCourseModal();
      if (modalId === "noteModal") resetNoteModal();
      if (modalId === "taskModal") resetTaskModal();
      if (modalId === "eventModal") resetEventModal();
      openModal(modalId);
    });
  });

  closeModalButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      closeModal(btn.dataset.closeModal);
    });
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
        document.body.style.overflow = "";
      }
    });
  });

  function showTab(tabId) {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    const activeBtn = document.querySelector('.tab-btn[data-tab="' + tabId + '"]');
    const activeTab = $(tabId);

    if (activeBtn) activeBtn.classList.add("active");
    if (activeTab) activeTab.classList.add("active");

    const titles = {
      dashboard: "Dashboard",
      courses: "Courses",
      notes: "Notes",
      planner: "Tasks",
      calendar: "Calendar"
    };

    if (pageTitle) pageTitle.textContent = titles[tabId] || "Academia";

    if (tabId === "calendar" && calendar) {
      setTimeout(function () {
        calendar.updateSize();
      }, 150);
    }
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showTab(button.dataset.tab);
    });
  });

  function updateDashboard() {
    if (totalCoursesEl) totalCoursesEl.textContent = courses.length;
    if (totalTasksEl) totalTasksEl.textContent = tasks.length;
    if (totalEventsEl) totalEventsEl.textContent = buildCalendarEvents().length;
  }

  function updateSessionInputs() {
    if (!sessionRepeatInput || !sessionDayInput || !sessionDateInput) return;

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
        <button class="delete-btn" data-remove-session="${index}">Remove</button>
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
    if (courseModalTitle) courseModalTitle.textContent = "Add Course";
    if (courseNameInput) courseNameInput.value = "";
    if (courseCodeInput) courseCodeInput.value = "";
    if (courseInstructorInput) courseInstructorInput.value = "";
    if (courseColorInput) courseColorInput.value = "#2563eb";
    if (sessionTypeInput) sessionTypeInput.value = "Lecture";
    if (sessionRepeatInput) sessionRepeatInput.value = "weekly";
    if (sessionDayInput) sessionDayInput.value = "";
    if (sessionDateInput) sessionDateInput.value = "";
    if (sessionStartTimeInput) sessionStartTimeInput.value = "";
    if (sessionEndTimeInput) sessionEndTimeInput.value = "";
    if (sessionLocationInput) sessionLocationInput.value = "";
    pendingSessions = [];
    editingCourseId = null;
    if (saveCourseBtn) saveCourseBtn.textContent = "Save Course";
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
      alert("Please choose a date for a specific-date session.");
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
      name: name,
      code: code,
      instructor: instructor,
      color: color,
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
    refreshCalendar();
    updateDashboard();
    closeModal("courseModal");
    resetCourseModal();
  }

  function editCourse(id) {
    const course = courses.find(function (item) {
      return item.id === id;
    });
    if (!course) return;

    courseModalTitle.textContent = "Edit Course";
    editingCourseId = id;
    courseNameInput.value = course.name || "";
    courseCodeInput.value = course.code || "";
    courseInstructorInput.value = course.instructor || "";
    courseColorInput.value = course.color || "#2563eb";
    pendingSessions = Array.isArray(course.sessions) ? course.sessions.slice() : [];
    saveCourseBtn.textContent = "Update Course";
    renderPendingSessions();
    openModal("courseModal");
  }

  function deleteCourse(id) {
    courses = courses.filter(function (course) {
      return course.id !== id;
    });
    saveCourses();
    renderCourses();
    refreshCalendar();
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
        <div class="course-badge" style="background:${course.color};">${course.code}</div>
        <div>${sessionsHtml}</div>
        <div class="card-actions">
          <button class="edit-btn" data-edit-course="${course.id}">Edit</button>
          <button class="delete-btn" data-delete-course="${course.id}">Delete</button>
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
    if (noteModalTitle) noteModalTitle.textContent = "Add Note";
    if (noteTitleInput) noteTitleInput.value = "";
    if (noteContentInput) noteContentInput.value = "";
    editingNoteId = null;
    if (saveNoteBtn) saveNoteBtn.textContent = "Save Note";
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
    renderDashboardNotes();
    closeModal("noteModal");
    resetNoteModal();
  }

  function editNote(id) {
    const note = notes.find(function (item) {
      return item.id === id;
    });
    if (!note) return;

    noteModalTitle.textContent = "Edit Note";
    editingNoteId = id;
    noteTitleInput.value = note.title || "";
    noteContentInput.value = note.content || "";
    saveNoteBtn.textContent = "Update Note";
    openModal("noteModal");
  }

  function deleteNote(id) {
    notes = notes.filter(function (note) {
      return note.id !== id;
    });
    saveNotes();
    renderNotes();
    renderDashboardNotes();
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
          <button class="edit-btn" data-edit-note="${note.id}">Edit</button>
          <button class="delete-btn" data-delete-note="${note.id}">Delete</button>
          <button class="view-btn" data-view-note="${note.id}">View</button>
        </div>
      `;
      notesList.appendChild(card);
    });
  }

  function renderDashboardNotes() {
    if (!dashboardNotes) return;
    dashboardNotes.innerHTML = "";

    if (notes.length === 0) {
      dashboardNotes.innerHTML = '<div class="empty-state">No notes yet.</div>';
      return;
    }

    notes.slice(0, 3).forEach(function (note) {
      const item = document.createElement("div");
      item.className = "detail-item";
      item.innerHTML = `
        <strong>${note.title}</strong>
        <div class="meta">${String(note.content || "").slice(0, 80)}${String(note.content || "").length > 80 ? "..." : ""}</div>
      `;
      dashboardNotes.appendChild(item);
    });
  }

  if (notesList) {
    notesList.addEventListener("click", function (e) {
      const editId = e.target.getAttribute("data-edit-note");
      const deleteId = e.target.getAttribute("data-delete-note");
      const viewId = e.target.getAttribute("data-view-note");

      if (editId !== null) editNote(Number(editId));
      if (deleteId !== null) deleteNote(Number(deleteId));
      if (viewId !== null) {
        const note = notes.find(function (n) {
          return n.id === Number(viewId);
        });
        if (!note) return;
        showDetailModal(note.title, [
          ["Type", "Note"],
          ["Title", note.title],
          ["Content", note.content || ""]
        ]);
      }
    });
  }

  function resetTaskModal() {
    if (taskModalTitle) taskModalTitle.textContent = "Add Task";
    if (taskTitleInput) taskTitleInput.value = "";
    if (taskDetailsInput) taskDetailsInput.value = "";
    if (taskDateInput) taskDateInput.value = "";
    if (taskPriorityInput) taskPriorityInput.value = "High";
    if (taskStatusInput) taskStatusInput.value = "To Do";
    editingTaskId = null;
    if (addTaskBtn) addTaskBtn.textContent = "Save Task";
  }

  function addOrUpdateTask() {
    const title = taskTitleInput.value.trim();
    const details = taskDetailsInput.value.trim();
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
    renderDashboardTasks();
    refreshCalendar();
    updateDashboard();
    closeModal("taskModal");
    resetTaskModal();
  }

  function editTask(id) {
    const task = tasks.find(function (item) {
      return item.id === id;
    });
    if (!task) return;

    taskModalTitle.textContent = "Edit Task";
    editingTaskId = id;
    taskTitleInput.value = task.title || "";
    taskDetailsInput.value = task.details || "";
    taskDateInput.value = task.date || "";
    taskPriorityInput.value = task.priority || "High";
    taskStatusInput.value = task.status || "To Do";
    addTaskBtn.textContent = "Update Task";
    openModal("taskModal");
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (task) {
      return task.id !== id;
    });
    saveTasks();
    renderTasks();
    renderDashboardTasks();
    refreshCalendar();
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
        task.status === "Doing" ? "status-doing" :
        "status-done";

      card.innerHTML = `
        <h3>${task.title}</h3>
        <span class="priority-badge ${priorityClass}">${task.priority}</span>
        <span class="status-badge ${statusClass}">${task.status}</span>
        <p class="meta">Due: ${task.date}</p>
        <p class="meta">${task.details ? String(task.details).replace(/\n/g, "<br>") : "No details added."}</p>
        <div class="card-actions">
          <button class="edit-btn" data-edit-task="${task.id}">Edit</button>
          <button class="delete-btn" data-delete-task="${task.id}">Delete</button>
          <button class="view-btn" data-view-task="${task.id}">View</button>
        </div>
      `;
      plannerList.appendChild(card);
    });
  }

  function renderDashboardTasks() {
    if (!dashboardTasks) return;
    dashboardTasks.innerHTML = "";

    if (tasks.length === 0) {
      dashboardTasks.innerHTML = '<div class="empty-state">No tasks yet.</div>';
      return;
    }

    tasks.slice().sort(function (a, b) {
      return String(a.date).localeCompare(String(b.date));
    }).slice(0, 3).forEach(function (task) {
      const item = document.createElement("div");
      item.className = "detail-item";
      item.innerHTML = `
        <strong>${task.title}</strong>
        <div class="meta">Due ${task.date}</div>
      `;
      dashboardTasks.appendChild(item);
    });
  }

  if (plannerList) {
    plannerList.addEventListener("click", function (e) {
      const editId = e.target.getAttribute("data-edit-task");
      const deleteId = e.target.getAttribute("data-delete-task");
      const viewId = e.target.getAttribute("data-view-task");

      if (editId !== null) editTask(Number(editId));
      if (deleteId !== null) deleteTask(Number(deleteId));
      if (viewId !== null) {
        const task = tasks.find(function (t) {
          return t.id === Number(viewId);
        });
        if (!task) return;
        showDetailModal(task.title, [
          ["Type", "Task"],
          ["Title", task.title],
          ["Due Date", task.date],
          ["Priority", task.priority],
          ["Status", task.status],
          ["Details", task.details || "No details added."]
        ]);
      }
    });
  }

  function resetEventModal() {
    if (eventModalTitle) eventModalTitle.textContent = "Add Event";
    if (eventTitleInput) eventTitleInput.value = "";
    if (eventDetailsInput) eventDetailsInput.value = "";
    if (eventDateInput) eventDateInput.value = "";
    if (eventStartTimeInput) eventStartTimeInput.value = "";
    if (eventEndTimeInput) eventEndTimeInput.value = "";
    editingEventId = null;
    if (saveEventBtn) saveEventBtn.textContent = "Save Event";
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
    refreshCalendar();
    updateDashboard();
    closeModal("eventModal");
    resetEventModal();
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

  function buildCalendarEvents() {
    const allEvents = [];

    courses.forEach(function (course) {
      const sessions = Array.isArray(course.sessions) ? course.sessions : [];

      sessions.forEach(function (session) {
        if (session.repeat === "specific" && session.date) {
          allEvents.push({
            id: "course-" + course.id + "-" + session.id,
            title: course.code + " " + session.type,
            start: session.date + "T" + session.startTime,
            end: session.date + "T" + session.endTime,
            color: course.color || "#2563eb",
            extendedProps: {
              sourceType: "course",
              courseName: course.name,
              courseCode: course.code,
              instructor: course.instructor || "N/A",
              sessionType: session.type,
              location: session.location || "Not set",
              repeat: "Specific Date"
            }
          });
        }

        if (session.repeat === "weekly" && session.day) {
          allEvents.push({
            id: "course-" + course.id + "-" + session.id,
            title: course.code + " " + session.type,
            daysOfWeek: [dayNameToNumber(session.day)],
            startTime: session.startTime,
            endTime: session.endTime,
            color: course.color || "#2563eb",
            extendedProps: {
              sourceType: "course",
              courseName: course.name,
              courseCode: course.code,
              instructor: course.instructor || "N/A",
              sessionType: session.type,
              location: session.location || "Not set",
              repeat: "Weekly on " + session.day
            }
          });
        }
      });
    });

    tasks.forEach(function (task) {
      allEvents.push({
        id: "task-" + task.id,
        title: "Task: " + task.title,
        start: task.date,
        allDay: true,
        color: "#dc2626",
        extendedProps: {
          sourceType: "task",
          title: task.title,
          details: task.details || "No details added.",
          priority: task.priority,
          status: task.status,
          dueDate: task.date
        }
      });
    });

    customEvents.forEach(function (event) {
      allEvents.push({
        id: "custom-" + event.id,
        title: event.title,
        start: event.date + "T" + event.startTime,
        end: event.date + "T" + event.endTime,
        color: "#0f766e",
        extendedProps: {
          sourceType: "custom",
          title: event.title,
          details: event.details || "No details added.",
          date: event.date
        }
      });
    });

    return allEvents;
  }

  function showDetailModal(title, items) {
    if (!detailTitle || !detailBody) return;
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

  function initCalendar() {
    const calendarEl = $("calendarView");
    if (!calendarEl) return;

    if (typeof FullCalendar === "undefined") {
      calendarEl.innerHTML = '<div class="empty-state">Calendar library failed to load.</div>';
      return;
    }

    try {
      calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        },
        events: buildCalendarEvents(),
        nowIndicator: true,
        height: 700,
        displayEventTime: true,
        eventClick: function (info) {
          const event = info.event;
          const props = event.extendedProps || {};

          if (props.sourceType === "course") {
            showDetailModal(event.title, [
              ["Type", "Course Session"],
              ["Course", props.courseName + " (" + props.courseCode + ")"],
              ["Session", props.sessionType],
              ["Instructor", props.instructor],
              ["Location", props.location],
              ["Repeat", props.repeat],
              ["Start", event.start ? event.start.toLocaleString() : event.startStr],
              ["End", event.end ? event.end.toLocaleString() : (event.endStr || "Not set")]
            ]);
          } else if (props.sourceType === "task") {
            showDetailModal(event.title, [
              ["Type", "Task"],
              ["Title", props.title],
              ["Due Date", props.dueDate],
              ["Priority", props.priority],
              ["Status", props.status],
              ["Details", props.details]
            ]);
          } else if (props.sourceType === "custom") {
            showDetailModal(event.title, [
              ["Type", "Custom Event"],
              ["Title", props.title],
              ["Date", props.date],
              ["Start", event.start ? event.start.toLocaleString() : event.startStr],
              ["End", event.end ? event.end.toLocaleString() : (event.endStr || "Not set")],
              ["Details", props.details]
            ]);
          }
        }
      });

      calendar.render();
    } catch (error) {
      console.error("Calendar failed:", error);
      calendarEl.innerHTML = '<div class="empty-state">Calendar could not be displayed.</div>';
    }
  }

  function refreshCalendar() {
    if (!calendar) return;
    calendar.removeAllEvents();
    buildCalendarEvents().forEach(function (event) {
      calendar.addEvent(event);
    });
  }

  if (addSessionBtn) addSessionBtn.addEventListener("click", addSession);
  if (saveCourseBtn) saveCourseBtn.addEventListener("click", saveCourse);
  if (sessionRepeatInput) sessionRepeatInput.addEventListener("change", updateSessionInputs);
  if (saveNoteBtn) saveNoteBtn.addEventListener("click", saveNote);
  if (addTaskBtn) addTaskBtn.addEventListener("click", addOrUpdateTask);
  if (saveEventBtn) saveEventBtn.addEventListener("click", saveCustomEventItem);

  updateSessionInputs();
  resetCourseModal();
  resetNoteModal();
  resetTaskModal();
  resetEventModal();
  renderCourses();
  renderNotes();
  renderTasks();
  renderDashboardNotes();
  renderDashboardTasks();
  initCalendar();
  updateDashboard();
});
