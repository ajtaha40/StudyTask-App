const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDateInput");
const priorityInput = document.getElementById("priorityInput");
const searchInput = document.getElementById("searchInput");
const filterAllBtn = document.getElementById("filterAll");
const filterCompletedBtn = document.getElementById("filterCompleted");
const filterIncompleteBtn = document.getElementById("filterIncomplete");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const darkModeToggle = document.getElementById("darkModeToggle");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const incompleteTasks = document.getElementById("incompleteTasks");

const usernameInput = document.getElementById("usernameInput");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginBox = document.getElementById("loginBox");
const welcomeBox = document.getElementById("welcomeBox");
const welcomeMessage = document.getElementById("welcomeMessage");

let currentUser = localStorage.getItem("currentUser") || "";
let tasks = [];
let currentFilter = "all";

function getUserTasksKey(username) {
  return `tasks_${username}`;
}

function loadTasks() {
  if (currentUser) {
    tasks = JSON.parse(localStorage.getItem(getUserTasksKey(currentUser))) || [];
  } else {
    tasks = [];
  }

  tasks = tasks.map(task => ({
    text: task.text || "",
    completed: task.completed || false,
    dueDate: task.dueDate || "",
    priority: task.priority || "High"
  }));
}

function saveTasks() {
  if (currentUser) {
    localStorage.setItem(getUserTasksKey(currentUser), JSON.stringify(tasks));
  }
}

function updateLoginUI() {
  if (currentUser) {
    loginBox.style.display = "none";
    welcomeBox.style.display = "flex";
    welcomeMessage.textContent = `Welcome, ${currentUser}`;
  } else {
    loginBox.style.display = "flex";
    welcomeBox.style.display = "none";
  }
}

if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
}

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.setItem("darkMode", "disabled");
  }
});

function updateDashboard() {
  totalTasks.textContent = tasks.length;
  completedTasks.textContent = tasks.filter(task => task.completed).length;
  incompleteTasks.textContent = tasks.filter(task => !task.completed).length;
}

function renderTasks() {
  updateDashboard();
  taskList.innerHTML = "";

  const searchText = searchInput.value.toLowerCase();

  let filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(searchText)
  );

  if (currentFilter === "completed") {
    filteredTasks = filteredTasks.filter(task => task.completed);
  }

  if (currentFilter === "incomplete") {
    filteredTasks = filteredTasks.filter(task => !task.completed);
  }

  if (filteredTasks.length === 0) {
    emptyMessage.style.display = "block";
    emptyMessage.textContent = currentUser ? "No tasks found" : "Please log in first";
    return;
  }

  emptyMessage.style.display = "none";

  filteredTasks.forEach((task) => {
    const realIndex = tasks.indexOf(task);

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
        <button class="complete-btn" data-index="${realIndex}">Complete</button>
        <button class="edit-btn" data-index="${realIndex}">Edit</button>
        <button class="delete-btn" data-index="${realIndex}">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

function addTask() {
  if (!currentUser) {
    alert("Please log in first.");
    return;
  }

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

loginBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();

  if (username === "") {
    alert("Please enter your name.");
    return;
  }

  currentUser = username;
  localStorage.setItem("currentUser", currentUser);
  loadTasks();
  updateLoginUI();
  renderTasks();
});

logoutBtn.addEventListener("click", () => {
  currentUser = "";
  localStorage.removeItem("currentUser");
  tasks = [];
  updateLoginUI();
  renderTasks();
});

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

searchInput.addEventListener("input", renderTasks);

filterAllBtn.addEventListener("click", () => {
  currentFilter = "all";
  renderTasks();
});

filterCompletedBtn.addEventListener("click", () => {
  currentFilter = "completed";
  renderTasks();
});

filterIncompleteBtn.addEventListener("click", () => {
  currentFilter = "incomplete";
  renderTasks();
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

updateLoginUI();
loadTasks();
renderTasks();