const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const li = document.createElement("li");
  li.textContent = taskText;
  li.style.padding = "10px";
  li.style.marginBottom = "10px";
  li.style.backgroundColor = "#eef4fa";
  li.style.borderRadius = "8px";

  taskList.appendChild(li);
  taskInput.value = "";
  emptyMessage.style.display = "none";
});