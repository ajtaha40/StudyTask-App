const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const searchInput = document.getElementById("taskSearch");
const modal = document.getElementById("modal");
const addTaskForm = document.getElementById("addTaskForm");
const taskNameInput = document.getElementById("taskName");
const dueDateInput = document.getElementById("dueDate");
const prioritySelect = document.getElementById("priority");
const submitTaskBtn = document.getElementById("submitTask");
const cancelTaskBtn = document.getElementById("cancelTask");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Migrate old tasks to new structure
tasks = tasks.map(task => {
  if (task.text) {
    return {
      name: task.text,
      dueDate: new Date().toISOString().split('T')[0], // Default to today's date
      priority: 'neutral',
      completed: task.completed || false
    };
  }
  return task;
});
saveTasks(); // Save migrated tasks

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  // Sort tasks: by dueDate, then by priority (very important first), then alphabetical
  const priorityOrder = { "very important": 1, "important": 2, "neutral": 3 };
  tasks.sort((a, b) => {
    if (a.dueDate !== b.dueDate) {
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.name.localeCompare(b.name);
  });

  taskList.innerHTML = "";

  if (tasks.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";

  // Group by dueDate
  const grouped = {};
  tasks.forEach(task => {
    if (!grouped[task.dueDate]) {
      grouped[task.dueDate] = [];
    }
    grouped[task.dueDate].push(task);
  });

  for (const date in grouped) {
    const dateHeader = document.createElement("h3");
    dateHeader.textContent = `Due: ${date}`;
    taskList.appendChild(dateHeader);

    const ul = document.createElement("ul");
    ul.className = "task-group";

    grouped[date].forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "task-item";

      if (task.completed) {
        li.classList.add("completed");
      }

      const priorityMarks = { "very important": 3, "important": 2, "neutral": 1 };
      const normalizedPriority = String(task.priority).toLowerCase();
      li.innerHTML = `
        <span class="task-text">${task.name}</span>
        <div class="task-actions">
          <button class="complete-btn" data-index="${tasks.indexOf(task)}" title="Complete">✓</button>
          <button class="edit-btn" data-index="${tasks.indexOf(task)}" title="Edit">✏️</button>
          <button class="delete-btn" data-index="${tasks.indexOf(task)}" title="Delete">🗑️</button>
          <button class="priority-btn">${'!'.repeat(priorityMarks[normalizedPriority] || 1)}</button>
        </div>
      `;

      ul.appendChild(li);
    });

    taskList.appendChild(ul);
  }
}

function addTask() {
  const name = taskNameInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = prioritySelect.value;

  if (name === "" || dueDate === "") {
    alert("Please enter task name and due date.");
    return;
  }

  tasks.push({
    name,
    dueDate,
    priority,
    completed: false
  });

  taskNameInput.value = "";
  dueDateInput.value = "";
  prioritySelect.value = "very important";
  modal.style.display = "none";
  saveTasks();
  renderTasks();
}

function searchTasks() {
    const input = document.getElementById('taskSearch');
    const filter = input.value.toLowerCase();
    const taskList = document.getElementById('taskList'); // Assuming there's a task list element
    const tasks = taskList.getElementsByTagName('li'); // Assuming tasks are in <li> elements

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const txtValue = task.textContent || task.innerText;
        task.style.display = txtValue.toLowerCase().includes(filter) ? '' : 'none';
    }
}

addTaskBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

submitTaskBtn.addEventListener("click", addTask);

cancelTaskBtn.addEventListener("click", () => {
  modal.style.display = "none";
  taskNameInput.value = "";
  dueDateInput.value = "";
  prioritySelect.value = "very important";
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
    const updatedName = prompt("Edit task name:", tasks[index].name);
    const updatedDueDate = prompt("Edit due date (YYYY-MM-DD):", tasks[index].dueDate);
    const updatedPriority = prompt("Edit priority (very important/important/neutral):", tasks[index].priority);

    if (updatedName !== null && updatedName.trim() !== "" && updatedDueDate !== null && updatedDueDate.trim() !== "" && updatedPriority !== null && ["very important", "important", "neutral"].includes(updatedPriority)) {
      tasks[index].name = updatedName.trim();
      tasks[index].dueDate = updatedDueDate.trim();
      tasks[index].priority = updatedPriority;
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

searchInput.addEventListener("input", searchTasks);

renderTasks();
if (typeof module !== "undefined") {
  module.exports = {
    addTask,
    renderTasks,
    saveTasks
  };
}