document.addEventListener("DOMContentLoaded", function () {
  const $ = (id) => document.getElementById(id);
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  const openModalButtons = document.querySelectorAll(".open-modal-btn");
  const closeModalButtons = document.querySelectorAll(".close-modal-btn");

  let calendar = null;

  let courses = JSON.parse(localStorage.getItem("courses")) || [];
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let customEvents = JSON.parse(localStorage.getItem("customEvents")) || [];

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
    $(id).classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeModal(id) {
    $(id).classList.add("hidden");
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

    document.querySelector(`.tab-btn[data-tab="${tabId}"]`)?.classList.add("active");
    $(tabId)?.classList.add("active");

    const titles = {
      dashboard: "Dashboard",
      courses: "Courses",
      notes: "Notes",
      planner: "Tasks",
      calendar: "Calendar"
    };

    pageTitle.textContent = titles[tabId] || "Academia";

    if (tabId === "calendar" && calendar) {
      setTimeout(() => calendar.updateSize(), 100);
    }
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showTab(button.dataset.tab);
    });
  });

  function updateDashboard() {
    totalCoursesEl.textContent = courses.length;
    totalTasksEl.textContent = tasks.length;
    totalEventsEl.textContent = buildCalendarEvents().length;
  }

  function updateSessionInputs() {
    if (sessionRepeatInput.value === "weekly") {
      sessionDayInput.style.display = "block";
      sessionDateInput.style.display = "block";
      sessionDateInput.disabled = true;
      sessionDateInput.value = "";
    } else {
      sessionDayInput.style.display = "block";
      sessionDateInput.style.display = "block";
      sessionDateInput.disabled = false;
      sessionDayInput.value = "";
    }
  }

  function renderPendingSessions() {
    pendingSessionsList.innerHTML = "";

    if (pendingSessions.length === 0) {
      pendingSessionsList.innerHTML = `<li>No sessions added yet.</li>`;
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
        <span class="meta">Location: ${session.location || "Not set"}</span>
        <br>
        <button class="delete-btn" data-remove-session="${index}">Remove</button>
      `;
      pendingSessionsList.appendChild(li);
    });
  }

  pendingSessionsList.addEventListener("click", function (e) {
    const index = e.target.getAttribute("data-remove-session");
    if (index !== null) {
      pendingSessions.splice(Number(index), 1);
      renderPendingSessions();
    }
  });

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
    sessionDateInput.disabled = true;
    sessionStartTimeInput.value = "";
    sessionEndTimeInput.value = "";
    sessionLocationInput.value = "";
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
      type,
      repeat,
      day,
      date,
      startTime,
      endTime,
      location
    });

    sessionTypeInput.value = "Lecture";
    sessionRepeatInput.value = "weekly";
    sessionDayInput.value = "";
    sessionDateInput.value = "";
    sessionDateInput.disabled = true;
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
      name,
      code,
      instructor,
      color,
      sessions: [...pendingSessions]
    };

    if (editingCourseId) {
      courses = courses.map((course) =>
        course.id === editingCourseId ? courseData : course
      );
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
    const course = courses.find((course) => course.id === id);
    if (!course) return;

    courseModalTitle.textContent = "Edit Course";
    editingCourseId = id;
    courseNameInput.value = course.name;
    courseCodeInput.value = course.code;
    courseInstructorInput.value = course.instructor;
    courseColorInput.value = course.color;
    pendingSessions = [...(course.sessions || [])];
    saveCourseBtn.textContent = "Update Course";
    updateSessionInputs();
    renderPendingSessions();
    openModal("courseModal");
  }

  function deleteCourse(id) {
    courses = courses.filter((course) => course.id !== id);
    saveCourses();
    renderCourses();
    refreshCalendar();
    updateDashboard();
  }

  function renderCourses() {
    coursesList.innerHTML = "";

    if (courses.length === 0) {
      coursesList.innerHTML = `<div class="empty-state">No courses added yet.</div>`;
      return;
    }

    courses.forEach((course) => {
      const card = document.createElement("div");
      card.className = "course-card";

      const sessionsHtml = course.sessions.map((session) => `
        <div class="planner-item">
          <span class="course-badge" style="background:${course.color};">${session.type}</span>
          <p class="meta">
            ${session.repeat === "weekly"
              ? `${session.day} • ${session.startTime} - ${session.endTime} • Weekly`
              : `${session.date} • ${session.startTime} - ${session.endTime} • Specific Date`}
            <br>Location: ${session.location || "Not set"}
          </p>
        </div>
      `).join("");

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

  coursesList.addEventListener("click", function (e) {
    const editId = e.target.getAttribute("data-edit-course");
    const deleteId = e.target.getAttribute("data-delete-course");

    if (editId !== null) editCourse(Number(editId));
    if (deleteId !== null) deleteCourse(Number(deleteId));
  });

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
      title,
      content
    };

    if (editingNoteId) {
      notes = notes.map((note) => note.id === editingNoteId ? noteData : note);
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
    const note = notes.find((note) => note.id === id);
    if (!note) return;

    noteModalTitle.textContent = "Edit Note";
    editingNoteId = id;
    noteTitleInput.value = note.title;
    noteContentInput.value = note.content;
    saveNoteBtn.textContent = "Update Note";
    openModal("noteModal");
  }

  function deleteNote(id) {
    notes = notes.filter((note) => note.id !== id);
    saveNotes();
    renderNotes();
    renderDashboardNotes();
  }

  function renderNotes() {
    notesList.innerHTML = "";

    if (notes.length === 0) {
      notesList.innerHTML = `<div class="empty-state">No notes saved yet.</div>`;
      return;
    }

    notes.forEach((note) => {
      const card = document.createElement("div");
      card.className = "note-card";
      card.innerHTML = `
        <h3>${note.title}</h3>
        <p class="meta">${note.content.replace(/\n/g, "<br>")}</p>
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
    dashboardNotes.innerHTML = "";

    if (notes.length === 0) {
      dashboardNotes.innerHTML = `<div class="empty-state">No notes yet.</div>`;
      return;
    }

    notes.slice(0, 3).forEach((note) => {
      const item = document.createElement("div");
      item.className = "detail-item";
      item.innerHTML = `
        <strong>${note.title}</strong>
        <div class="meta">${note.content.slice(0, 80)}${note.content.length > 80 ? "..." : ""}</div>
      `;
      dashboardNotes.appendChild(item);
    });
  }

  notesList.addEventListener("click", function (e) {
    const editId = e.target.getAttribute("data-edit-note");
    const deleteId = e.target.getAttribute("data-delete-note");
    const viewId = e.target.getAttribute("data-view-note");

    if (editId !== null) editNote(Number(editId));
    if (deleteId !== null) deleteNote(Number(deleteId));
    if (viewId !== null) {
      const note = notes.find((n) => n.id === Number(viewId));
      if (!note) return;
      showDetailModal(note.title, [
        ["Type", "Note"],
        ["Title", note.title],
        ["Content", note.content]
      ]);
    }
  });

  function resetTaskModal() {
    taskModalTitle.textContent = "Add Task";
    taskTitleInput.value = "";
    taskDetailsInput.value = "";
    taskDateInput.value = "";
    taskPriorityInput.value = "High";
    taskStatusInput.value = "To Do";
    editingTaskId = null;
    addTaskBtn.textContent = "Save Task";
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
      title,
      details,
      date,
      priority,
      status
    };

    if (editingTaskId) {
      tasks = tasks.map((task) => task.id === editingTaskId ? taskData : task);
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
    const task = tasks.find((task) => task.id === id);
    if (!task) return;

    taskModalTitle.textContent = "Edit Task";
    editingTaskId = id;
    taskTitleInput.value = task.title;
    taskDetailsInput.value = task.details || "";
    taskDateInput.value = task.date;
    taskPriorityInput.value = task.priority;
    taskStatusInput.value = task.status;
    addTaskBtn.textContent = "Update Task";
    openModal("taskModal");
  }

  function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
    renderDashboardTasks();
    refreshCalendar();
    updateDashboard();
  }

  function renderTasks() {
    plannerList.innerHTML = "";

    if (tasks.length === 0) {
      plannerList.innerHTML = `<div class="empty-state">No tasks added yet.</div>`;
      return;
    }

    tasks.forEach((task) => {
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
        <p class="meta">${task.details ? task.details.replace(/\n/g, "<br>") : "No details added."}</p>
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
    dashboardTasks.innerHTML = "";

    if (tasks.length === 0) {
      dashboardTasks.innerHTML = `<div class="empty-state">No tasks yet.</div>`;
      return;
    }

    tasks
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3)
      .forEach((task) => {
        const item = document.createElement("div");
        item.className = "detail-item";
        item.innerHTML = `
          <strong>${task.title}</strong>
          <div class="meta">Due ${task.date}</div>
        `;
        dashboardTasks.appendChild(item);
      });
  }

  plannerList.addEventListener("click", function (e) {
    const editId = e.target.getAttribute("data-edit-task");
    const deleteId = e.target.getAttribute("data-delete-task");
    const viewId = e.target.getAttribute("data-view-task");

    if (editId !== null) editTask(Number(editId));
    if (deleteId !== null) deleteTask(Number(deleteId));
    if (viewId !== null) {
      const task = tasks.find((t) => t.id === Number(viewId));
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
      title,
      details,
      date,
      startTime,
      endTime
    };

    if (editingEventId) {
      customEvents = customEvents.map((event) =>
        event.id === editingEventId ? eventData : event
      );
    } else {
      customEvents.unshift(eventData);
    }

    saveCustomEvents();
    refreshCalendar();
    updateDashboard();
    closeModal("eventModal");
    resetEventModal();
  }

  function editCustomEvent(id) {
    const event = customEvents.find((item) => item.id === id);
    if (!event) return;

    eventModalTitle.textContent = "Edit Event";
    editingEventId = id;
    eventTitleInput.value = event.title;
    eventDetailsInput.value = event.details || "";
    eventDateInput.value = event.date;
    eventStartTimeInput.value = event.startTime;
    eventEndTimeInput.value = event.endTime;
    saveEventBtn.textContent = "Update Event";
    openModal("eventModal");
  }

  function deleteCustomEvent(id) {
    customEvents = customEvents.filter((event) => event.id !== id);
    saveCustomEvents();
    refreshCalendar();
    updateDashboard();
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

    courses.forEach((course) => {
      (course.sessions || []).forEach((session) => {
        if (session.repeat === "specific" && session.date) {
          allEvents.push({
            id: `course-${course.id}-${session.id}`,
            title: `${course.code} ${session.type}`,
            start: `${session.date}T${session.startTime}`,
            end: `${session.date}T${session.endTime}`,
            color: course.color,
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
            id: `course-${course.id}-${session.id}`,
            title: `${course.code} ${session.type}`,
            daysOfWeek: [dayNameToNumber(session.day)],
            startTime: session.startTime,
            endTime: session.endTime,
            color: course.color,
            extendedProps: {
              sourceType: "course",
              courseName: course.name,
              courseCode: course.code,
              instructor: course.instructor || "N/A",
              sessionType: session.type,
              location: session.location || "Not set",
              repeat: `Weekly on ${session.day}`
            }
          });
        }
      });
    });

    tasks.forEach((task) => {
      allEvents.push({
        id: `task-${task.id}`,
        title: `Task: ${task.title}`,
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

    customEvents.forEach((event) => {
      allEvents.push({
        id: `custom-${event.id}`,
        title: event.title,
        start: `${event.date}T${event.startTime}`,
        end: `${event.date}T${event.endTime}`,
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
    detailTitle.textContent = title;
    detailBody.innerHTML = items.map(([label, value]) => `
      <div class="detail-item">
        <span class="detail-label">${label}</span>
        <div>${value}</div>
      </div>
    `).join("");
    openModal("detailModal");
  }

  function initCalendar() {
    const calendarEl = $("calendarView");
    if (!calendarEl || typeof FullCalendar === "undefined") return;

    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay"
      },
      events: buildCalendarEvents(),
      nowIndicator: true,
      height: "auto",
      displayEventTime: true,
      eventClick: function (info) {
        const event = info.event;
        const props = event.extendedProps || {};

        if (props.sourceType === "course") {
          showDetailModal(event.title, [
            ["Type", "Course Session"],
            ["Course", `${props.courseName} (${props.courseCode})`],
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
  }

  function refreshCalendar() {
    if (!calendar) return;
    calendar.removeAllEvents();
    buildCalendarEvents().forEach((event) => calendar.addEvent(event));
  }

  addSessionBtn.addEventListener("click", addSession);
  saveCourseBtn.addEventListener("click", saveCourse);
  sessionRepeatInput.addEventListener("change", updateSessionInputs);
  saveNoteBtn.addEventListener("click", saveNote);
  addTaskBtn.addEventListener("click", addOrUpdateTask);
  saveEventBtn.addEventListener("click", saveCustomEventItem);

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
