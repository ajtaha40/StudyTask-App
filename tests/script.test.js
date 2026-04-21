/**
 * @jest-environment jsdom
 */

beforeEach(() => {
  document.body.innerHTML = `
    <div class="container">
      <input type="text" id="taskSearch" placeholder="Enter a task">
      <button id="addTaskBtn">Add Task</button>
      <p id="emptyMessage">No tasks yet</p>
      <ul id="taskList"></ul>
    </div>
  `;

  localStorage.clear();
  jest.resetModules();
  global.alert = jest.fn();

  require("../script.js");
});


// ✅ TEST 1: Reject empty input
test("should not add empty task", () => {
  const addTaskBtn = document.getElementById("addTaskBtn");

  addTaskBtn.click();

  const taskItems = document.querySelectorAll("#taskList li");

  expect(taskItems.length).toBe(0);
  expect(global.alert).toHaveBeenCalled();
});


// ✅ TEST 2: Add a task
test("should add a new task", () => {
  const taskInput = document.getElementById("taskSearch");
  const addTaskBtn = document.getElementById("addTaskBtn");

  taskInput.value = "Big Data";
  addTaskBtn.click();

  const taskItems = document.querySelectorAll("#taskList li");

  expect(taskItems.length).toBe(1);
  expect(taskItems[0].textContent).toContain("Big Data");
});


// ✅ TEST 3: Task is displayed in UI
test("should display task in task list", () => {
  const taskInput = document.getElementById("taskSearch");
  const addTaskBtn = document.getElementById("addTaskBtn");

  taskInput.value = "AI Assignment";
  addTaskBtn.click();

  const list = document.getElementById("taskList");

  expect(list.innerHTML).toContain("AI Assignment");
});