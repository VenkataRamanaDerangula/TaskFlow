let taskId = localStorage.getItem("taskId")
  ? parseInt(localStorage.getItem("taskId"))
  : 0;

document.addEventListener("DOMContentLoaded", loadTasks);

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
  event.target.classList.add("dragging");
}

function drop(event) {
  event.preventDefault();
  let taskId = event.dataTransfer.getData("text");
  let task = document.getElementById(taskId);
  task.classList.remove("dragging");

  // Check if dropped in the Delete column
  if (event.target.id === "delete-list") {
    deleteTask(task.id); // Call delete function if dropped in delete column
  } else {
    event.target.appendChild(task); // Otherwise, append to the target column
  }

  // Save tasks to localStorage whenever moved
  saveTasks();
}

function addTask() {
  let taskInput = document.getElementById("new-task");
  let taskText = taskInput.value.trim();

  if (taskText !== "") {
    taskId++;
    localStorage.setItem("taskId", taskId);

    createTask(taskText, "todo-list", taskId);

    taskInput.value = "";

    // Save to localStorage
    saveTasks();
  }
}

function createTask(taskText, columnId, taskId) {
  let task = document.createElement("div");
  task.className = "task";
  task.id = "task-" + taskId;
  task.draggable = true;
  task.ondragstart = drag;

  task.innerText = taskText;

  document.getElementById(columnId).appendChild(task);
}

function deleteTask(taskId) {
  let task = document.getElementById(taskId);
  if (task) {
    if (confirm("Are you sure you want to delete this task?")) {
      task.remove();
      saveTasks();
    }
  }
}

function saveTasks() {
  let tasks = {
    todo: [],
    inprogress: [],
    done: [],
  };

  document.querySelectorAll("#todo-list .task").forEach((task) => {
    tasks.todo.push(task.innerText.trim());
  });

  document.querySelectorAll("#in-progress .task").forEach((task) => {
    tasks.inprogress.push(task.innerText.trim());
  });

  document.querySelectorAll("#done .task").forEach((task) => {
    tasks.done.push(task.innerText.trim());
  });

  localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
}

function loadTasks() {
  let savedTasks = JSON.parse(localStorage.getItem("kanbanTasks"));

  if (savedTasks) {
    savedTasks.todo.forEach((taskText, index) => {
      createTask(taskText, "todo-list", index + 1);
    });

    savedTasks.inprogress.forEach((taskText, index) => {
      createTask(taskText, "in-progress", index + 1 + savedTasks.todo.length);
    });

    savedTasks.done.forEach((taskText, index) => {
      createTask(
        taskText,
        "done",
        index + 1 + savedTasks.todo.length + savedTasks.inprogress.length
      );
    });
  }
}
