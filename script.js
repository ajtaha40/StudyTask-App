let tasks = [];

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksContainer = document.getElementById('tasksContainer');
const emptyMessage = document.getElementById('emptyMessage');

// Load tasks from LocalStorage
function loadTasks() {
  const savedTasks = localStorage.getItem('studyTasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
  renderTasks();
}

// Save tasks to LocalStorage
function saveTasks() {
  localStorage.setItem('studyTasks', JSON.stringify(tasks));
}

// Add Main Task
function addMainTask() {
  const title = taskInput.value.trim();
  if (!title) return;

  tasks.push({
    id: Date.now(),
    title: title,
    subtasks: []
  });

  taskInput.value = '';
  renderTasks();
  saveTasks();
}

function renderTasks() {
  tasksContainer.innerHTML = '';

  if (tasks.length === 0) {
    emptyMessage.style.display = 'block';
    return;
  }
  emptyMessage.style.display = 'none';

  tasks.forEach((task, taskIndex) => {
    const subtasksHTML = task.subtasks.map((sub, subIndex) => `
      <div class="subtask-item" id="subtask-${taskIndex}-${subIndex}">
        <input type="checkbox" 
               ${sub.completed ? 'checked' : ''} 
               onchange="toggleComplete(${taskIndex}, ${subIndex})">
        
        <span class="subtask-text ${sub.completed ? 'completed' : ''}" 
              ondblclick="startEditing(this, ${taskIndex}, ${subIndex})">
          ${sub.text}
        </span>
        
        <button class="delete-btn" onclick="deleteSubTask(${taskIndex}, ${subIndex})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `).join('');

    const taskHTML = `
      <div class="task-card">
        <div class="task-header">
          <h3>${task.title}</h3>
          <div class="main-actions">
            <button class="edit-main-btn" onclick="editMainTitle(${taskIndex})" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="delete-main-btn" onclick="deleteMainTask(${taskIndex})" title="Delete Task">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        
        <div class="subtasks">
          ${subtasksHTML}
          
          <div class="add-subtask">
            <input type="text" id="subInput${task.id}" placeholder="Add a sub-task...">
            <button onclick="addSubTask(${taskIndex})">Add</button>
          </div>
        </div>
      </div>
    `;

    tasksContainer.innerHTML += taskHTML;
  });
}

// Add Subtask
function addSubTask(taskIndex) {
  const input = document.getElementById(`subInput${tasks[taskIndex].id}`);
  const text = input.value.trim();
  if (!text) return;

  tasks[taskIndex].subtasks.push({ text: text, completed: false });
  input.value = '';
  renderTasks();
  saveTasks();
}

// Toggle Complete (Strike-through)
function toggleComplete(taskIndex, subIndex) {
  tasks[taskIndex].subtasks[subIndex].completed = 
    !tasks[taskIndex].subtasks[subIndex].completed;
  renderTasks();
  saveTasks();
}

// Delete Subtask
function deleteSubTask(taskIndex, subIndex) {
  if (confirm("Delete this sub-task?")) {
    tasks[taskIndex].subtasks.splice(subIndex, 1);
    renderTasks();
    saveTasks();
  }
}

// Delete Main Task
function deleteMainTask(taskIndex) {
  if (confirm("Delete this entire task and all sub-tasks?")) {
    tasks.splice(taskIndex, 1);
    renderTasks();
    saveTasks();
  }
}

// Edit Main Task Title
function editMainTitle(taskIndex) {
  const newTitle = prompt("Edit task title:", tasks[taskIndex].title);
  if (newTitle && newTitle.trim() !== "") {
    tasks[taskIndex].title = newTitle.trim();
    renderTasks();
    saveTasks();
  }
}

// Event Listeners
addTaskBtn.addEventListener('click', addMainTask);
taskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addMainTask();
});
// Initialize
loadTasks();

// Start Inline Editing
function startEditing(element, taskIndex, subIndex) {
  const currentText = tasks[taskIndex].subtasks[subIndex].text;
  
  // Replace span with input
  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentText;
  input.className = 'subtask-text editing';
  
  // Replace the span with input
  element.replaceWith(input);
  input.focus();
  input.select();

  // Save on Enter
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      saveEdit(this, taskIndex, subIndex);
    }
  });

  // Save on click outside
  input.addEventListener('blur', function() {
    saveEdit(this, taskIndex, subIndex);
  });
}

// Save the edited subtask
function saveEdit(inputElement, taskIndex, subIndex) {
  const newText = inputElement.value.trim();
  
  if (newText !== "") {
    tasks[taskIndex].subtasks[subIndex].text = newText;
  }
  
  renderTasks();
  saveTasks();
}
