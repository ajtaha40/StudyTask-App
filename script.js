const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDateInput");
const priorityInput = document.getElementById("priorityInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// make old tasks safe if they don't have dueDate or priority
tasks = tasks.map(task => ({
  text: task.text || "",
  completed: task.completed || false,
  dueDate: task.dueDate || "",
  priority: task.priority || "High"
}));

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";

    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
      <div class="task-info">
        <span class="task-text">${task.text}</span>
        <small class="due-date">${task.dueDate ? "Due: " + task.dueDate : "No due date"}</small>
        <small class="priority ${task.priority.toLowerCase()}">Priority: ${task.priority}</small>
      </div>
      <div class="task-actions">
        <button class="complete-btn" data-index="${index}">Complete</button>
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

function addTask() {
  const taskText = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  tasks.push({
    text: taskText,
    completed: false,
    dueDate: dueDate,
    priority: priority
  });

  taskInput.value = "";
  dueDateInput.value = "";
  priorityInput.value = "High";

  saveTasks();
  renderTasks();
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

taskList.addEventListener("click", (e) => {
  const index = e.target.dataset.index;

  if (index === undefined) return;

  if (e.target.classList.contains("complete-btn")) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  }

  if (e.target.classList.contains("edit-btn")) {
    const updatedText = prompt("Edit your task:", tasks[index].text);
    const updatedDueDate = prompt("Edit due date (YYYY-MM-DD):", tasks[index].dueDate || "");
    const updatedPriority = prompt("Edit priority (High / Medium / Low):", tasks[index].priority || "High");

    if (updatedText !== null && updatedText.trim() !== "") {
      tasks[index].text = updatedText.trim();
      tasks[index].dueDate = updatedDueDate;
      tasks[index].priority = updatedPriority || "High";
      saveTasks();
      renderTasks();
    }
  }

  if (e.target.classList.contains("delete-btn")) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");

    if (confirmDelete) {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    }
  }
});

renderTasks();