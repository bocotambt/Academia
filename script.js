const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task;

    li.addEventListener("click", () => {
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    });

    taskList.appendChild(li);
  });
}

addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();

  if (taskText === "") return;

  tasks.push(taskText);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
  renderTasks();
});

renderTasks();