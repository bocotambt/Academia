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

  let courses = getSavedArray("courses");
  let notes = getSavedArray("notes");
  let tasks = getSavedArray("tasks");
  let customEvents = getSavedArray("customEvents");

  let pendingSessions = [];
  let editingCourseId = null;
  let editingNoteId = null;
  let editingTaskId = null;
  let editingEventId = null;

  let currentCalendarDate = new Date();

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

  const prevMonthBtn = $("prevMonthBtn");
  const nextMonthBtn = $("nextMonthBtn");
  const calendarMonthLabel = $("calendarMonthLabel");
  const calendarGrid = $("calendarGrid");

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
      if (modalId === "courseModal") resetCourseModal();
      if (modalId === "noteModal") resetNoteModal();
      if (modalId === "taskModal") resetTaskModal();
      if (modalId === "eventModal") resetEventModal();
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
      notes: "Notes",
      planner: "Tasks",
      calendar: "Calendar"
    };

    if (pageTitle) {
      pageTitle.textContent = titles[tabId] || "Academia";
    }

    if (tabId === "calendar") {
      renderCalendar();
    }
  }

  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      showTab(button.dataset.tab);
    });
  });

  function updateDashboard() {
    totalCoursesEl.textContent = courses.length;
    totalTasksEl.textContent = tasks.length;
    totalEventsEl.textContent = getAllCalendarItems().length;
  }

  function updateSessionInputs() {
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
    renderCalendar();
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
    courseNameInput.value = course.name || "";
    courseCodeInput.value = course.code || "";
    courseInstructorInput.value = course.instructor || "";
    courseColorInput.value = course.color || "#2563eb";
    pendingSessions = Array.isArray(course.sessions) ? course.sessions.slice() : [];
    editingCourseId = id;
    saveCourseBtn.textContent = "Update Course";
    updateSessionInputs();
    renderPendingSessions();
    openModal("courseModal");
  }

  function deleteCourse(id) {
    courses = courses.filter(function (course) {
      return course.id !== id;
    });
    saveCourses();
    renderCourses();
    renderCalendar();
    updateDashboard();
  }

  function renderCourses() {
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
          <button class="edit-btn" data-edit-course="${course.id}" type="button">Edit</button>
          <button class="delete-btn" data-delete-course="${course.id}" type="button">Delete</button>
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
    renderDashboardNotes();
  }

  function renderNotes() {
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
          <button class="view-btn" data-view-note="${note.id}" type="button">View</button>
        </div>
      `;
      notesList.appendChild(card);
    });
  }

  function renderDashboardNotes() {
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

    taskModalTitle.textContent = "Edit Task";
    taskTitleInput.value = task.title || "";
    taskDetailsInput.value = task.details || "";
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
    renderDashboardTasks();
    renderCalendar();
    updateDashboard();
  }

  function renderTasks() {
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
          <button class="edit-btn" data-edit-task="${task.id}" type="button">Edit</button>
          <button class="delete-btn" data-delete-task="${task.id}" type="button">Delete</button>
          <button class="view-btn" data-view-task="${task.id}" type="button">View</button>
        </div>
      `;
      plannerList.appendChild(card);
    });
  }

  function renderDashboardTasks() {
    dashboardTasks.innerHTML = "";

    if (tasks.length === 0) {
      dashboardTasks.innerHTML = '<div class="empty-state">No tasks yet.</div>';
      return;
    }

    tasks
      .slice()
      .sort(function (a, b) {
        return String(a.date).localeCompare(String(b.date));
      })
      .slice(0, 3)
      .forEach(function (task) {
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
    updateDashboard();
    closeModal("eventModal");
    resetEventModal();
  }

  function deleteCustomEvent(id) {
    customEvents = customEvents.filter(function (event) {
      return event.id !== id;
    });
    saveCustomEvents();
    renderCalendar();
    updateDashboard();
  }

  function editCustomEvent(id) {
    const event = customEvents.find(function (item) {
      return item.id === id;
    });

    if (!event) return;

    eventModalTitle.textContent = "Edit Event";
    eventTitleInput.value = event.title || "";
    eventDetailsInput.value = event.details || "";
    eventDateInput.value = event.date || "";
    eventStartTimeInput.value = event.startTime || "";
    eventEndTimeInput.value = event.endTime || "";
    editingEventId = id;
    saveEventBtn.textContent = "Update Event";
    openModal("eventModal");
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

  function pad(num) {
    return String(num).padStart(2, "0");
  }

  function formatDateKey(date) {
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }

  function getDatesForWeeklySession(dayName, year, month) {
    const results = [];
    const dayNumber = dayNameToNumber(dayName);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (date.getDay() === dayNumber) {
        results.push(formatDateKey(date));
      }
    }

    return results;
  }

  function getAllCalendarItems() {
    const items = [];

    courses.forEach(function (course) {
      const sessions = Array.isArray(course.sessions) ? course.sessions : [];

      sessions.forEach(function (session) {
        if (session.repeat === "specific" && session.date) {
          items.push({
            type: "course",
            id: "course-" + course.id + "-" + session.id,
            title: course.code + " " + session.type,
            date: session.date,
            color: course.color || "#2563eb",
            data: {
              courseName: course.name,
              courseCode: course.code,
              instructor: course.instructor || "N/A",
              sessionType: session.type,
              location: session.location || "Not set",
              repeat: "Specific Date",
              startTime: session.startTime,
              endTime: session.endTime
            }
          });
        }
      });
    });

    tasks.forEach(function (task) {
      items.push({
        type: "task",
        id: "task-" + task.id,
        title: "Task: " + task.title,
        date: task.date,
        color: "#dc2626",
        data: {
          title: task.title,
          dueDate: task.date,
          priority: task.priority,
          status: task.status,
          details: task.details || "No details added."
        }
      });
    });

    customEvents.forEach(function (event) {
      items.push({
        type: "custom",
        id: "custom-" + event.id,
        title: event.title,
        date: event.date,
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

  function getCalendarItemsForMonth(year, month) {
    const items = [];
    const baseItems = getAllCalendarItems();

    baseItems.forEach(function (item) {
      if (item.type === "course" && item.data.repeat === "Specific Date") {
        const itemDate = new Date(item.date + "T00:00:00");
        if (itemDate.getFullYear() === year && itemDate.getMonth() === month) {
          items.push(item);
        }
      } else if (item.type === "task" || item.type === "custom") {
        const itemDate = new Date(item.date + "T00:00:00");
        if (itemDate.getFullYear() === year && itemDate.getMonth() === month) {
          items.push(item);
        }
      }
    });

    courses.forEach(function (course) {
      const sessions = Array.isArray(course.sessions) ? course.sessions : [];

      sessions.forEach(function (session) {
        if (session.repeat === "weekly" && session.day) {
          const dates = getDatesForWeeklySession(session.day, year, month);

          dates.forEach(function (dateKey) {
            items.push({
              type: "course",
              id: "course-" + course.id + "-" + session.id + "-" + dateKey,
              title: course.code + " " + session.type,
              date: dateKey,
              color: course.color || "#2563eb",
              data: {
                courseName: course.name,
                courseCode: course.code,
                instructor: course.instructor || "N/A",
                sessionType: session.type,
                location: session.location || "Not set",
                repeat: "Weekly on " + session.day,
                startTime: session.startTime,
                endTime: session.endTime
              }
            });
          });
        }
      });
    });

    return items;
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
    if (itemId.indexOf("task-") === 0) {
      const taskId = Number(itemId.replace("task-", ""));
      const task = tasks.find(function (t) {
        return t.id === taskId;
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
      return;
    }

    if (itemId.indexOf("custom-") === 0) {
      const eventId = Number(itemId.replace("custom-", ""));
      const event = customEvents.find(function (e) {
        return e.id === eventId;
      });

      if (!event) return;

      showDetailModal(event.title, [
        ["Type", "Custom Event"],
        ["Title", event.title],
        ["Date", event.date],
        ["Start", event.startTime],
        ["End", event.endTime],
        ["Details", event.details || "No details added."]
      ]);
      return;
    }

    if (itemId.indexOf("course-") === 0) {
      const currentMonthItems = getCalendarItemsForMonth(
        currentCalendarDate.getFullYear(),
        currentCalendarDate.getMonth()
      );

      const item = currentMonthItems.find(function (entry) {
        return entry.id === itemId;
      });

      if (!item) return;

      showDetailModal(item.title, [
        ["Type", "Course Session"],
        ["Course", item.data.courseName + " (" + item.data.courseCode + ")"],
        ["Session", item.data.sessionType],
        ["Instructor", item.data.instructor],
        ["Location", item.data.location],
        ["Repeat", item.data.repeat],
        ["Date", item.date],
        ["Start", item.data.startTime],
        ["End", item.data.endTime]
      ]);
    }
  }

  function renderCalendar() {
    if (!calendarGrid || !calendarMonthLabel) return;

    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    const monthLabel = currentCalendarDate.toLocaleString("en-US", {
      month: "long",
      year: "numeric"
    });

    calendarMonthLabel.textContent = monthLabel;
    calendarGrid.innerHTML = "";

    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const items = getCalendarItemsForMonth(year, month);
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

      if (isOtherMonth) {
        cell.classList.add("other-month");
      }

      if (cellKey === todayKey) {
        cell.classList.add("today");
      }

      const dayItems = items.filter(function (item) {
        return item.date === cellKey;
      });

      const itemsHtml = dayItems.map(function (item) {
        return `
          <button
            type="button"
            class="calendar-item ${item.type}"
            data-calendar-item="${item.id}"
            title="${item.title}"
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

  calendarGrid.addEventListener("click", function (e) {
    const itemId = e.target.getAttribute("data-calendar-item");
    if (itemId) {
      openCalendarItem(itemId);
    }
  });

  prevMonthBtn.addEventListener("click", function () {
    currentCalendarDate = new Date(
      currentCalendarDate.getFullYear(),
      currentCalendarDate.getMonth() - 1,
      1
    );
    renderCalendar();
  });

  nextMonthBtn.addEventListener("click", function () {
    currentCalendarDate = new Date(
      currentCalendarDate.getFullYear(),
      currentCalendarDate.getMonth() + 1,
      1
    );
    renderCalendar();
  });

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
  renderCalendar();
  updateDashboard();
});
