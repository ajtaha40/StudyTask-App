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

// Modal elements
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const editTaskInput = document.getElementById("editTaskInput");
const editDueDateInput = document.getElementById("editDueDateInput");
const editPriorityInput = document.getElementById("editPriorityInput");
const closeModal = document.querySelector(".close");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let editingIndex = -1;

// make old tasks safe
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

  // Sort tasks by due date (earliest first), then by priority (High > Medium > Low)
  filteredTasks.sort((a, b) => {
    if (!a.dueDate && !b.dueDate) {
      // Both no due date, sort by priority
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    const dateCompare = a.dueDate.localeCompare(b.dueDate);
    if (dateCompare !== 0) return dateCompare;
    // Same due date, sort by priority
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  if (filteredTasks.length === 0) {
    emptyMessage.style.display = "block";
    emptyMessage.textContent = "No tasks found";
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
    editingIndex = parseInt(index);
    editTaskInput.value = tasks[editingIndex].text;
    editDueDateInput.value = tasks[editingIndex].dueDate;
    editPriorityInput.value = tasks[editingIndex].priority;
    editModal.style.display = "block";
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

// Modal event listeners
editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const updatedText = editTaskInput.value.trim();
  if (updatedText === "") {
    alert("Please enter a task.");
    return;
  }
  tasks[editingIndex].text = updatedText;
  tasks[editingIndex].dueDate = editDueDateInput.value;
  tasks[editingIndex].priority = editPriorityInput.value;
  saveTasks();
  renderTasks();
  editModal.style.display = "none";
});

closeModal.addEventListener("click", () => {
  editModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === editModal) {
    editModal.style.display = "none";
  }
});