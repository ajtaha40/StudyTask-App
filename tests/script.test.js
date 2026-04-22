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
    </div>
  `;

  localStorage.clear();
  jest.resetModules();
  global.alert = jest.fn();
  global.prompt = jest.fn();
  global.confirm = jest.fn(() => true);

  require("../script.js");
});

test("should not add empty task", () => {
  document.getElementById("addTaskBtn").click();

  const taskItems = document.querySelectorAll("#taskList li");
  expect(taskItems.length).toBe(0);
  expect(global.alert).toHaveBeenCalled();
});

test("should add a task with due date and priority", () => {
  document.getElementById("taskInput").value = "Big Data";
  document.getElementById("dueDateInput").value = "2026-04-30";
  document.getElementById("priorityInput").value = "High";

  document.getElementById("addTaskBtn").click();

  const taskItems = document.querySelectorAll("#taskList li");
  expect(taskItems.length).toBe(1);
  expect(taskItems[0].textContent).toContain("Big Data");
  expect(taskItems[0].textContent).toContain("Due: 2026-04-30");
  expect(taskItems[0].textContent).toContain("Priority: High");
});

test("should complete a task", () => {
  document.getElementById("taskInput").value = "Task One";
  document.getElementById("addTaskBtn").click();

  const completeButton = document.querySelector(".complete-btn");
  completeButton.click();

  const taskItem = document.querySelector("#taskList li");
  expect(taskItem.classList.contains("completed")).toBe(true);
});

test("should search tasks by name", () => {
  document.getElementById("taskInput").value = "Big Data";
  document.getElementById("addTaskBtn").click();

  document.getElementById("taskInput").value = "Machine Learning";
  document.getElementById("addTaskBtn").click();

  document.getElementById("searchInput").value = "Big";
  document.getElementById("searchInput").dispatchEvent(new Event("input"));

  const taskItems = document.querySelectorAll("#taskList li");
  expect(taskItems.length).toBe(1);
  expect(taskItems[0].textContent).toContain("Big Data");
});

test("should filter completed tasks", () => {
  document.getElementById("taskInput").value = "Completed Task";
  document.getElementById("addTaskBtn").click();

  document.getElementById("taskInput").value = "Incomplete Task";
  document.getElementById("addTaskBtn").click();

  const completeButtons = document.querySelectorAll(".complete-btn");
  completeButtons[0].click();

  document.getElementById("filterCompleted").click();

  const taskItems = document.querySelectorAll("#taskList li");
  expect(taskItems.length).toBe(1);
  expect(taskItems[0].textContent).toContain("Completed Task");
});

test("should filter incomplete tasks", () => {
  document.getElementById("taskInput").value = "Completed Task";
  document.getElementById("addTaskBtn").click();

  document.getElementById("taskInput").value = "Incomplete Task";
  document.getElementById("addTaskBtn").click();

  const completeButtons = document.querySelectorAll(".complete-btn");
  completeButtons[0].click();

  document.getElementById("filterIncomplete").click();

  const taskItems = document.querySelectorAll("#taskList li");
  expect(taskItems.length).toBe(1);
  expect(taskItems[0].textContent).toContain("Incomplete Task");
});