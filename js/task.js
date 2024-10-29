document.addEventListener("DOMContentLoaded", () => {
  // Element References
  const elements = {
    calendarIcon: document.getElementById("calendarIcon"),
    calendarModal: document.getElementById("calendarModal"),
    taskDateInput: document.getElementById("taskDate"),
    taskTimeInput: document.getElementById("taskTime"),
    saveDateTimeBtn: document.getElementById("saveDateTimeBtn"),
    addTaskBtn: document.getElementById("addTaskBtn"),
    newTaskInput: document.getElementById("newTask"),
    taskPrioritySelect: document.getElementById("taskPriority"),
    taskList: document.querySelector(".task-list"),
    taskTitle: document.getElementById("taskTitle"),
    taskDescription: document.getElementById("taskDescription"),
    deleteTaskBtn: document.getElementById("deleteTaskBtn"),
    saveTaskBtn: document.getElementById("saveTaskBtn"),
    editTaskBtn: document.getElementById("editTaskBtn"),
    sidebar2: document.querySelector(".sidebar-2"),
    closeSidebarBtn: document.getElementById("closeSidebarBtn"),
    taskGrid: document.querySelector(".task-grid"),
    dateBtn: document.getElementById("dateBtn"), // Assuming this is the button for opening the calendar modal
    closeModalBtn: document.getElementById("closeModalBtn"), // Assuming this is the button to close the modal
  };

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let selectedTaskDate = null;
  let selectedTask = null;

  // Helper Functions
  const toggleCalendarModal = (state) => {
    elements.calendarModal.style.display = state ? "block" : "none";
  };
  const saveToLocalStorage = () =>
    localStorage.setItem("tasks", JSON.stringify(tasks));
  const refreshTaskList = () => {
    elements.taskList.innerHTML = "";
    loadTasks();
  };

  // Task Item Creation
  const createTaskItem = ({ title, priority, date, description }) => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.innerHTML = `
            <div class="task-column">${title}</div>
            <div class="task-column">${priority}</div>
            <div class="task-column">${date || ""}</div>
            <div class="task-column">${description || ""}</div>
        `;
    return taskItem;
  };

  // Load Tasks
  const loadTasks = () => {
    if (tasks.length > 0) {
      elements.taskGrid.style.display = "block";
      tasks.forEach((task) =>
        elements.taskList.appendChild(createTaskItem(task))
      );
    } else {
      elements.taskGrid.style.display = "none";
    }
  };

  // Event Listeners
  elements.calendarIcon.addEventListener("click", (event) => {
    const rect = event.target.getBoundingClientRect();
    elements.calendarModal.style.display = "block"; // Show the modal
    elements.calendarModal.style.top = `${rect.bottom + window.scrollY}px`; // Position below the icon
    elements.calendarModal.style.left = `${rect.left + window.scrollX + 120}px`; // Align left with the icon
  });

  elements.saveDateTimeBtn.addEventListener("click", () => {
    selectedTaskDate = `${elements.taskDateInput.value} ${elements.taskTimeInput.value}`;
    toggleCalendarModal(false);
  });

  elements.addTaskBtn.addEventListener("click", () => {
    const taskTitle = elements.newTaskInput.value.trim();
    const taskPriority = elements.taskPrioritySelect.value;
    if (!taskTitle) return;

    const newTask = {
      title: taskTitle,
      priority: taskPriority,
      date: selectedTaskDate,
      description: "",
    };
    tasks.push(newTask);
    elements.taskList.appendChild(createTaskItem(newTask));
    saveToLocalStorage();

    elements.newTaskInput.value = "";
    elements.taskDateInput.value = "";
    elements.taskTimeInput.value = "";
    selectedTaskDate = null;
    elements.taskGrid.style.display = "block";
  });

  elements.taskList.addEventListener("click", (event) => {
    const taskItem = event.target.closest(".task-item");
    if (!taskItem) return;

    const taskTitle = taskItem.querySelector(".task-column").textContent;
    selectedTask = tasks.find((task) => task.title === taskTitle);

    elements.taskTitle.textContent = selectedTask.title;
    elements.taskDescription.value = selectedTask.description || "";
    elements.sidebar2.classList.add("active");
  });

  elements.deleteTaskBtn.addEventListener("click", () => {
    if (selectedTask) {
      tasks = tasks.filter((task) => task.title !== selectedTask.title);
      saveToLocalStorage();
      refreshTaskList();
    }
    elements.sidebar2.classList.remove("active");
    elements.taskTitle.textContent = "Task Title";
    elements.taskDescription.value = "";
  });

  elements.saveTaskBtn.addEventListener("click", () => {
    if (selectedTask) {
      selectedTask.title = elements.taskTitle.textContent;
      selectedTask.description = elements.taskDescription.value;
      saveToLocalStorage();
      refreshTaskList();
    }
  });

  elements.editTaskBtn.addEventListener("click", () => {
    elements.taskTitle.contentEditable = true;
    elements.taskDescription.readOnly = false;
    elements.taskTitle.focus();
  });

  elements.closeSidebarBtn.addEventListener("click", () =>
    elements.sidebar2.classList.remove("active")
  );
  elements.closeModalBtn.addEventListener("click", () =>
    toggleCalendarModal(false)
  );

  // Initialize
  loadTasks();
});
