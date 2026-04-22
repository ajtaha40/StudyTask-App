/**
 * @jest-environment jsdom
 */

beforeEach(() => {
  document.body.innerHTML = `
    <div class="container">
      <div class="search-box">
        <input type="text" id="searchInput" placeholder="Search tasks...">
      </div>
      <div class="filter-box">
        <button id="filterAll">All</button>
        <button id="filterCompleted">Completed</button>
        <button id="filterIncomplete">Incomplete</button>
      </div>
      <div class="task-input">
        <input type="text" id="taskInput" placeholder="Enter a task">
        <input type="date" id="dueDateInput">
        <select id="priorityInput">
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button id="addTaskBtn">Add Task</button>
      </div>
      <div class="task-list">
        <p id="emptyMessage">No tasks yet</p>
        <ul id="taskList"></ul>
      </div>
      <!-- Edit Modal -->
      <div id="editModal" class="modal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <h2>Edit Task</h2>
          <form id="editForm">
            <div class="form-group">
              <label for="editTaskInput">Task:</label>
              <input type="text" id="editTaskInput" required>
            </div>
            <div class="form-group">
              <label for="editDueDateInput">Due Date:</label>
              <input type="date" id="editDueDateInput">
            </div>
            <div class="form-group">
              <label for="editPriorityInput">Priority:</label>
              <select id="editPriorityInput">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <button type="submit">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  `;

  localStorage.clear();
  jest.resetModules();
  global.alert = jest.fn();
  global.prompt = jest.fn();
  global.confirm = jest.fn();

  require("../script.js");
});

test("should not add empty task", () => {
  const addTaskBtn = document.getElementById("addTaskBtn");
  addTaskBtn.click();

  const taskItems = document.querySelectorAll("#taskList li");
  expect(taskItems.length).toBe(0);
  expect(global.alert).toHaveBeenCalled();
});

test("should add a new task with due date and priority", () => {
  const taskInput = document.getElementById("taskInput");
  const dueDateInput = document.getElementById("dueDateInput");
  const priorityInput = document.getElementById("priorityInput");
  const addTaskBtn = document.getElementById("addTaskBtn");

  taskInput.value = "Big Data";
  dueDateInput.value = "2023-12-31";
  priorityInput.value = "High";
  addTaskBtn.click();

  const taskItems = document.querySelectorAll("#taskList li");
  expect(taskItems.length).toBe(1);
  expect(taskItems[0].textContent).toContain("Big Data");
  expect(taskItems[0].textContent).toContain("2023-12-31");
  expect(taskItems[0].textContent).toContain("High");
});

test("should complete a task", () => {
  // Add a task first
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  taskInput.value = "Test Task";
  addTaskBtn.click();

  // Click complete button
  const completeBtn = document.querySelector(".complete-btn");
  completeBtn.click();

  // Check if task is marked completed
  const taskItem = document.querySelector("#taskList li");
  expect(taskItem.classList.contains("completed")).toBe(true);
});

test("should edit a task", () => {
  // Add a task first
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  taskInput.value = "Original Task";
  addTaskBtn.click();

  // Click edit button
  const editBtn = document.querySelector(".edit-btn");
  editBtn.click();

  // Fill modal form
  const editTaskInput = document.getElementById("editTaskInput");
  const editDueDateInput = document.getElementById("editDueDateInput");
  const editPriorityInput = document.getElementById("editPriorityInput");
  const editForm = document.getElementById("editForm");

  editTaskInput.value = "Updated Task";
  editDueDateInput.value = "2023-12-31";
  editPriorityInput.value = "High";

  // Submit form
  editForm.dispatchEvent(new Event("submit"));

  // Check if task is updated
  const taskItem = document.querySelector("#taskList li");
  expect(taskItem.textContent).toContain("Updated Task");
  expect(taskItem.textContent).toContain("2023-12-31");
  expect(taskItem.textContent).toContain("High");
});

test("should delete a task", () => {
  // Add a task first
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  taskInput.value = "Task to Delete";
  addTaskBtn.click();

  // Mock confirm to return true
  global.confirm.mockReturnValue(true);

  // Click delete button
  const deleteBtn = document.querySelector(".delete-btn");
  deleteBtn.click();

  // Check if task is removed
  const taskItems = document.querySelectorAll("#taskList li");
  expect(taskItems.length).toBe(0);
});

test("should filter tasks by search", () => {
  // Add tasks
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");

  taskInput.value = "Math Homework";
  addTaskBtn.click();
  taskInput.value = "Science Project";
  addTaskBtn.click();

  // Search for "Math"
  const searchInput = document.getElementById("searchInput");
  searchInput.value = "Math";
  searchInput.dispatchEvent(new Event("input"));

  const taskItems = document.querySelectorAll("#taskList li");
  expect(taskItems.length).toBe(1);
  expect(taskItems[0].textContent).toContain("Math Homework");
});

test("should filter completed tasks", () => {
  // Add and complete a task
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  taskInput.value = "Completed Task";
  addTaskBtn.click();

  const completeBtn = document.querySelector(".complete-btn");
  completeBtn.click();

  // Add another incomplete task
  taskInput.value = "Incomplete Task";
  addTaskBtn.click();

  // Filter to completed
  const filterCompletedBtn = document.getElementById("filterCompleted");
  filterCompletedBtn.click();

  const taskItems = document.querySelectorAll("#taskList li");
  expect(taskItems.length).toBe(1);
  expect(taskItems[0].textContent).toContain("Completed Task");
});

test("should filter incomplete tasks", () => {
  // Add and complete a task
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  taskInput.value = "Completed Task";
  addTaskBtn.click();

  const completeBtn = document.querySelector(".complete-btn");
  completeBtn.click();

  // Add another incomplete task
  taskInput.value = "Incomplete Task";
  addTaskBtn.click();

  // Filter to incomplete
  const filterIncompleteBtn = document.getElementById("filterIncomplete");
  filterIncompleteBtn.click();

  const taskItems = document.querySelectorAll("#taskList li");
  expect(taskItems.length).toBe(1);
  expect(taskItems[0].textContent).toContain("Incomplete Task");
});

test("should display tasks sorted by due date then priority", () => {
  const taskInput = document.getElementById("taskInput");
  const dueDateInput = document.getElementById("dueDateInput");
  const addTaskBtn = document.getElementById("addTaskBtn");

  // Add tasks with different due dates (out of order)
  taskInput.value = "Task C";
  dueDateInput.value = "2023-03-01";
  addTaskBtn.click();

  taskInput.value = "Task A";
  dueDateInput.value = "2023-01-01";
  addTaskBtn.click();

  taskInput.value = "Task B";
  dueDateInput.value = "2023-02-01";
  addTaskBtn.click();

  // Check the order in the DOM
  const taskItems = document.querySelectorAll("#taskList li");
  expect(taskItems.length).toBe(3);
  expect(taskItems[0].textContent).toContain("Task A");
  expect(taskItems[1].textContent).toContain("Task B");
  expect(taskItems[2].textContent).toContain("Task C");
});

test("should display tasks sorted by priority when due dates are the same", () => {
  const taskInput = document.getElementById("taskInput");
  const dueDateInput = document.getElementById("dueDateInput");
  const priorityInput = document.getElementById("priorityInput");
  const addTaskBtn = document.getElementById("addTaskBtn");

  // Add tasks with same due date but different priorities (out of order)
  taskInput.value = "Low Priority";
  dueDateInput.value = "2023-01-01";
  priorityInput.value = "Low";
  addTaskBtn.click();

  taskInput.value = "High Priority";
  dueDateInput.value = "2023-01-01";
  priorityInput.value = "High";
  addTaskBtn.click();

  taskInput.value = "Medium Priority";
  dueDateInput.value = "2023-01-01";
  priorityInput.value = "Medium";
  addTaskBtn.click();

  // Check the order in the DOM: High, Medium, Low
  const taskItems = document.querySelectorAll("#taskList li");
  expect(taskItems.length).toBe(3);
  expect(taskItems[0].textContent).toContain("High Priority");
  expect(taskItems[1].textContent).toContain("Medium Priority");
  expect(taskItems[2].textContent).toContain("Low Priority");
});