/**
 * @jest-environment jsdom
 */

beforeEach(() => {
  document.body.innerHTML = `
    <div class="container">
      <input type="text" id="taskInput" placeholder="Enter a task">
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

test("should not add empty task", () => {
  const addTaskBtn = document.getElementById("addTaskBtn");
  addTaskBtn.click();

  const taskItems = document.querySelectorAll("#taskList li");
  expect(taskItems.length).toBe(0);
  expect(global.alert).toHaveBeenCalled();
});

test("should add a new task", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");

  taskInput.value = "Big Data";
  addTaskBtn.click();

  const taskItems = document.querySelectorAll("#taskList li");
  expect(taskItems.length).toBe(1);
  expect(taskItems[0].textContent).toContain("Big Data");
});