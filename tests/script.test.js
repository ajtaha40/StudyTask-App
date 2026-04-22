/**
 * @jest-environment jsdom
 */

beforeEach(() => {
  document.body.innerHTML = `
    <div class="container">
      <div class="login-box" id="loginBox">
        <input type="text" id="usernameInput" placeholder="Enter your name">
        <button id="loginBtn">Login</button>
      </div>

      <div class="welcome-box" id="welcomeBox" style="display: none;">
        <p id="welcomeMessage"></p>
        <button id="logoutBtn">Logout</button>
      </div>

      <h1>StudyTask App</h1>
      <p class="subtitle">Manage your study tasks easily</p>

      <div class="top-controls">
        <button id="darkModeToggle">Toggle Dark Mode</button>
      </div>

      <div class="dashboard">
        <div class="summary-card">
          <h3>Total Tasks</h3>
          <p id="totalTasks">0</p>
        </div>
        <div class="summary-card">
          <h3>Completed</h3>
          <p id="completedTasks">0</p>
        </div>
        <div class="summary-card">
          <h3>Incomplete</h3>
          <p id="incompleteTasks">0</p>
        </div>
      </div>

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
  localStorage.setItem("currentUser", "Taha");

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

test("should log in a user", () => {
  document.getElementById("usernameInput").value = "Taha";
  document.getElementById("loginBtn").click();

  expect(document.getElementById("welcomeMessage").textContent).toContain("Taha");
});

test("should toggle dark mode", () => {
  const toggleBtn = document.getElementById("darkModeToggle");
  toggleBtn.click();

  expect(document.body.classList.contains("dark-mode")).toBe(true);
});

test("should update dashboard when task is added", () => {
  document.getElementById("taskInput").value = "Software Engineering";
  document.getElementById("dueDateInput").value = "2026-05-01";
  document.getElementById("priorityInput").value = "High";

  document.getElementById("addTaskBtn").click();

  expect(document.getElementById("totalTasks").textContent).toBe("1");
  expect(document.getElementById("completedTasks").textContent).toBe("0");
  expect(document.getElementById("incompleteTasks").textContent).toBe("1");
});