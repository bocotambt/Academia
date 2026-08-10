document.addEventListener("DOMContentLoaded", function () {
  const SUPABASE_URL = "https://fdijdgvsqfzgzzwlvqff.supabase.co";
  const SUPABASE_KEY = "sb_publishable_qkCIilGuoTE3FgWWzeqKLw_4R9ERznE";
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  function $(id) {
    return document.getElementById(id);
  }

  let currentUser = null;
  let courses = [];
  let tasks = [];
  let exams = [];
  let currentCalendarDate = new Date();
  let currentCalendarView = "month";
  let editingTaskId = null;
  let editingExamId = null;

  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  const tabNav = $("tabNav");
  const menuToggleBtn = $("menuToggleBtn");
  const brandSignedInText = $("brandSignedInText");
  const openModalButtons = document.querySelectorAll(".open-modal-btn");
  const closeModalButtons = document.querySelectorAll(".close-modal-btn");

  const pageTitle = $("pageTitle");
  const totalCoursesEl = $("totalCourses");
  const totalTasksEl = $("totalTasks");
  const totalExamsEl = $("totalExams");

  const plannerList = $("plannerList");
  const coursesList = $("coursesList");
  const notesList = $("notesList");
  const examsList = $("examsList");
  const academicYearsList = $("academicYearsList");
  const dashboardAllTasks = $("dashboardAllTasks");
  const dashboardToday = $("dashboardToday");
  const dashboardTomorrow = $("dashboardTomorrow");

  const authSignedOut = $("authSignedOut");
  const authSignedIn = $("authSignedIn");
  const authEmail = $("authEmail");
  const authPassword = $("authPassword");
  const authMessage = $("authMessage");
  const authMessageSignedIn = $("authMessageSignedIn");
  const currentUserEmail = $("currentUserEmail");
  const signUpBtn = $("signUpBtn");
  const signInBtn = $("signInBtn");
  const signOutBtn = $("signOutBtn");

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
      if (authSignedOut) authSignedOut.classList.add("hidden");
      if (authSignedIn) authSignedIn.classList.remove("hidden");
      if (currentUserEmail) currentUserEmail.textContent = currentUser.email || "";
      if (brandSignedInText) {
        brandSignedInText.textContent = "Signed in as " + (currentUser.email || "");
        brandSignedInText.classList.remove("hidden");
      }
    } else {
      if (authSignedOut) authSignedOut.classList.remove("hidden");
      if (authSignedIn) authSignedIn.classList.add("hidden");
      if (currentUserEmail) currentUserEmail.textContent = "";
      if (brandSignedInText) {
        brandSignedInText.textContent = "";
        brandSignedInText.classList.add("hidden");
      }
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
      email: email,
      password: password,
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

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

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

  async function loadTasks() {
    if (!currentUser) {
      tasks = [];
      renderTasks();
      renderDashboard();
      renderCalendar();
      updateDashboard();
      return;
    }

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("due_date", { ascending: true });

    if (error) {
      showAuthMessage(error.message, true);
      return;
    }

    tasks = (data || []).map(function (item) {
      return {
        id: item.id,
        title: item.title,
        details: item.details || "",
        courseId: item.course_id || null,
        date: item.due_date,
        priority: item.priority,
        status: item.status
      };
    });

    renderTasks();
    renderDashboard();
    renderCalendar();
    updateDashboard();
  }

  async function loadExams() {
    if (!currentUser) {
      exams = [];
      renderExams();
      updateDashboard();
      return;
    }

    const { data, error } = await supabase
      .from("exams")
      .select("*")
      .order("exam_date", { ascending: true });

    if (error) {
      exams = [];
      renderExams();
      updateDashboard();
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
    renderCalendar();
    updateDashboard();
  }

  async function saveTaskToSupabase(taskData) {
    if (!currentUser) {
      alert("Please sign in first.");
      return false;
    }

    if (editingTaskId) {
      const { error } = await supabase
        .from("tasks")
        .update({
          title: taskData.title,
          details: taskData.details,
          course_id: taskData.courseId,
          due_date: taskData.date,
          priority: taskData.priority,
          status: taskData.status
        })
        .eq("id", editingTaskId);

      if (error) {
        alert(error.message);
        return false;
      }
    } else {
      const { error } = await supabase
        .from("tasks")
        .insert({
          user_id: currentUser.id,
          title: taskData.title,
          details: taskData.details,
          course_id: taskData.courseId,
          due_date: taskData.date,
          priority: taskData.priority,
          status: taskData.status
        });

      if (error) {
        alert(error.message);
        return false;
      }
    }

    return true;
  }

  async function saveExamToSupabase(examData) {
    if (!currentUser) {
      alert("Please sign in first.");
      return false;
    }

    if (editingExamId) {
      const { error } = await supabase
        .from("exams")
        .update({
          title: examData.title,
          course: examData.course,
          exam_date: examData.date,
          exam_time: examData.time,
          place: examData.place,
          seat_number: examData.seatNumber,
          grade: examData.grade,
          mark: examData.mark === "" ? null : examData.mark,
          notes: examData.notes
        })
        .eq("id", editingExamId);

      if (error) {
        alert(error.message);
        return false;
      }
    } else {
      const { error } = await supabase
        .from("exams")
        .insert({
          user_id: currentUser.id,
          title: examData.title,
          course: examData.course,
          exam_date: examData.date,
          exam_time: examData.time,
          place: examData.place,
          seat_number: examData.seatNumber,
          grade: examData.grade,
          mark: examData.mark === "" ? null : examData.mark,
          notes: examData.notes
        });

      if (error) {
        alert(error.message);
        return false;
      }
    }

    return true;
  }

  async function deleteTaskFromSupabase(id) {
    if (!currentUser) return;

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadTasks();
  }

  async function deleteExamFromSupabase(id) {
    if (!currentUser) return;

    const { error } = await supabase
      .from("exams")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadExams();
  }

  async function updateTaskStatus(id, status) {
    if (!currentUser) return;

    const { error } = await supabase
      .from("tasks")
      .update({ status: status })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadTasks();
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
      courses: "Courses",
      planner: "Tasks",
      notes: "Notes",
      exams: "Exams",
      academic: "Academic Settings",
      calendar: "Calendar"
    };

    if (pageTitle) pageTitle.textContent = titles[tabId] || "Academia";
    if (tabId === "calendar") renderCalendar();
    if (tabId === "dashboard") renderDashboard();
    if (tabId === "exams") renderExams();

    if (window.innerWidth <= 640 && tabNav) {
      tabNav.classList.remove("menu-open");
    }
  }

  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      showTab(button.dataset.tab);
    });
  });

  function updateDashboard() {
    if (totalCoursesEl) totalCoursesEl.textContent = courses.length;
    if (totalTasksEl) totalTasksEl.textContent = tasks.length;
    if (totalExamsEl) totalExamsEl.textContent = exams.length;
  }

  function fillCourseOptions() {
    if (!taskCourseInput) return;

    taskCourseInput.innerHTML = "";

    const optionNone = document.createElement("option");
    optionNone.value = "";
    optionNone.textContent = "(No course)";
    taskCourseInput.appendChild(optionNone);
  }

  function resetTaskModal() {
    taskTitleInput.value = "";
    taskDetailsInput.value = "";
    taskCourseInput.value = "";
    taskDateInput.value = "";
    taskPriorityInput.value = "High";
    taskStatusInput.value = "To Do";
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

  async function saveTask() {
    const title = taskTitleInput.value.trim();
    const details = taskDetailsInput.value.trim();
    const courseId = taskCourseInput.value ? taskCourseInput.value : null;
    const date = taskDateInput.value;
    const priority = taskPriorityInput.value;
    const status = taskStatusInput.value;

    if (!title || !date) {
      alert("Please enter both task title and due date.");
      return;
    }

    const ok = await saveTaskToSupabase({
      title: title,
      details: details,
      courseId: courseId,
      date: date,
      priority: priority,
      status: status
    });

    if (!ok) return;

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
    const notes = examNotesInput.value.trim();

    if (!title || !date) {
      alert("Please enter both exam title and exam date.");
      return;
    }

    const ok = await saveExamToSupabase({
      title,
      course,
      date,
      time,
      place,
      seatNumber,
      grade,
      mark,
      notes
    });

    if (!ok) return;

    closeModal("examModal");
    resetExamModal();
    await loadExams();
  }

  function editTask(id) {
    const task = tasks.find(function (item) {
      return String(item.id) === String(id);
    });

    if (!task) return;

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
    const exam = exams.find(function (item) {
      return String(item.id) === String(id);
    });

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
    if (!coursesList) return;
    coursesList.innerHTML = '<div class="empty-state">Courses are not connected in this version yet.</div>';
  }

  function renderNotes() {
    if (!notesList) return;
    notesList.innerHTML = '<div class="empty-state">Notes are not connected in this version yet.</div>';
  }

  function renderAcademic() {
    if (!academicYearsList) return;
    academicYearsList.innerHTML = '<div class="empty-state">Academic settings are not connected in this version yet.</div>';
  }

  function renderTasks() {
    if (!plannerList) return;

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
          <span class="priority-badge ${priorityClass}">${task.priority}</span>
          <span class="status-badge ${statusClass}">${task.status}</span>
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
    if (!examsList) return;

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
        <span class="status-badge status-progress">${exam.course || "Exam"}</span>
        ${exam.grade ? `<span class="priority-badge priority-low">Grade: ${exam.grade}</span>` : ""}
        ${exam.mark !== "" && exam.mark !== null ? `<span class="priority-badge priority-medium">Mark: ${exam.mark}</span>` : ""}
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
        if (box) {
          box.classList.toggle("hidden");
        }
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
          id: "task-" + task.id,
          title: "Task: " + task.title,
          date: task.date,
          timeLabel: task.status === "Done" ? "Done" : "All day",
          location: "",
          color: "#dc2626",
          data: task,
          isPast: isPastDate(task.date) || task.status === "Done"
        };
      });

    const examItems = exams
      .filter(function (exam) {
        return exam.date === dateKey;
      })
      .map(function (exam) {
        return {
          type: "custom",
          id: "exam-" + exam.id,
          title: "Exam: " + exam.title,
          date: exam.date,
          timeLabel: exam.time || "Time not set",
          location: exam.place || "",
          color: "#0f766e",
          data: exam,
          isPast: isPastExam(exam)
        };
      });

    return taskItems.concat(examItems);
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

  function renderDashboardTasksList() {
    if (!dashboardAllTasks) return;

    dashboardAllTasks.innerHTML = "";

    if (!currentUser) {
      dashboardAllTasks.innerHTML = '<div class="empty-state">Sign in to load synced tasks.</div>';
      return;
    }

    if (tasks.length === 0) {
      dashboardAllTasks.innerHTML = '<div class="empty-state">No tasks yet.</div>';
      return;
    }

    tasks.forEach(function (task) {
      const item = document.createElement("div");
      const isDone = task.status === "Done";
      const isPast = isPastDate(task.date);

      item.className = "detail-item dashboard-click-item";
      if (isPast || isDone) item.classList.add("past-item");

      item.setAttribute("data-dashboard-task", task.id);

      item.innerHTML = `
        <strong class="${isDone ? "task-done-title" : ""}">${task.title}</strong>
        <div class="meta">Due ${task.date} • ${task.status} • ${task.priority}</div>
      `;
      dashboardAllTasks.appendChild(item);
    });
  }

  function renderDashboardDaySchedule(dayKey, container) {
    if (!container) return;

    const items = getItemsForDate(dayKey);
    container.innerHTML = "";

    if (!currentUser) {
      container.innerHTML = '<div class="empty-state">Sign in to sync schedule.</div>';
      return;
    }

    if (items.length === 0) {
      container.innerHTML = '<div class="empty-state">No items scheduled.</div>';
      return;
    }

    items.forEach(function (item) {
      const row = document.createElement("div");
      row.className = "detail-item dashboard-click-item";
      if (item.isPast) row.classList.add("past-item");
      row.setAttribute("data-calendar-item", item.id);
      row.innerHTML = `
        <strong>${item.title}</strong>
        <div class="meta">${item.timeLabel}${item.location ? " • " + item.location : ""}</div>
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

  if (dashboardAllTasks) {
    dashboardAllTasks.addEventListener("click", function (e) {
      const card = e.target.closest("[data-dashboard-task]");
      if (!card) return;

      const taskId = card.getAttribute("data-dashboard-task");
      const task = tasks.find(function (item) {
        return String(item.id) === String(taskId);
      });

      if (task) {
        showTab("planner");
        setTimeout(function () {
          openTaskDetails(task);
        }, 80);
      }
    });
  }

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener("click", function () {
      if (tabNav) {
        tabNav.classList.toggle("menu-open");
      }
    });
  }

  if (monthViewBtn) monthViewBtn.addEventListener("click", function () { setCalendarView("month"); });
  if (weekViewBtn) weekViewBtn.addEventListener("click", function () { setCalendarView("week"); });
  if (dayViewBtn) dayViewBtn.addEventListener("click", function () { setCalendarView("day"); });
  if (prevPeriodBtn) prevPeriodBtn.addEventListener("click", function () { moveCalendar(-1); });
  if (nextPeriodBtn) nextPeriodBtn.addEventListener("click", function () { moveCalendar(1); });
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
    await loadTasks();
    await loadExams();
  });

  async function init() {
    const user = await getCurrentUser();
    setAuthUI(user);
    fillCourseOptions();
    renderCourses();
    renderNotes();
    renderAcademic();
    renderTasks();
    renderExams();
    renderDashboard();
    setCalendarView("month");
    updateDashboard();
    await loadTasks();
    await loadExams();
  }

  init();
});
