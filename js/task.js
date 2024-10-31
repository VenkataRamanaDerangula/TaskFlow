document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const elements = {
        calendarIcon: document.getElementById('calendarIcon'),
        calendarModal: document.getElementById('calendarModal'),
        taskDateInput: document.getElementById('taskDate'),
        taskTimeInput: document.getElementById('taskTime'),
        saveDateTimeBtn: document.getElementById('saveDateTimeBtn'),
        addTaskBtn: document.getElementById('addTaskBtn'),
        newTaskInput: document.getElementById('newTask'),
        taskPrioritySelect: document.getElementById('taskPriority'),
        taskList: document.querySelector('.task-list'),
        taskTitle: document.getElementById('taskTitle'),
        taskDescription: document.getElementById('taskDescription'),
        deleteTaskBtn: document.getElementById('deleteTaskBtn'),
        saveTaskBtn: document.getElementById('saveTaskBtn'),
        editTaskBtn: document.getElementById('editTaskBtn'),
        sidebar2: document.querySelector('.sidebar-2'),
        closeSidebarBtn: document.getElementById('closeSidebarBtn'),
    };

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let selectedTaskDate = null;
    let selectedTask = null;

    // Open Calendar Modal on Icon Click
    elements.calendarIcon.addEventListener('click', (event) => {
        const rect = event.target.getBoundingClientRect();
        elements.calendarModal.style.display = 'block';
        elements.calendarModal.style.top = `${rect.bottom + window.scrollY}px`;
        elements.calendarModal.style.left = `${rect.left + window.scrollX + 120}px`;
    });

    // Save Date and Time from Calendar Modal
    elements.saveDateTimeBtn.addEventListener('click', () => {
        selectedTaskDate = `${elements.taskDateInput.value} ${elements.taskTimeInput.value}`;
        elements.calendarModal.style.display = 'none';
    });

    // Add task functionality
    elements.addTaskBtn.addEventListener('click', () => {
        const taskText = elements.newTaskInput.value.trim();
        const taskPriority = elements.taskPrioritySelect.value;
        if (!taskText) return;

        const taskId = Date.now().toString();  // Generate unique ID
        const taskItem = createTaskItem(taskId, taskText, "", taskPriority, selectedTaskDate);
        elements.taskList.appendChild(taskItem);
        tasks.push({ id: taskId, title: taskText, description: "", priority: taskPriority, date: selectedTaskDate });
        localStorage.setItem('tasks', JSON.stringify(tasks));

        elements.newTaskInput.value = "";
        elements.taskDateInput.value = "";
        elements.taskTimeInput.value = "";
        selectedTaskDate = null;

        document.querySelector('.task-grid').style.display = 'block';
    });

    // Create task item with priority and date
    function createTaskItem(taskId, taskTitleText, taskDesc, taskPriority, taskDate) {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.dataset.taskId = taskId;  // Add unique identifier
        taskItem.innerHTML = `
            <div class="task-column">${taskTitleText}</div>
            <div class="task-column">${taskPriority}</div>
            <div class="task-column">${taskDate || ''}</div>
            <div class="task-column">${taskDesc}</div>
        `;
        return taskItem;
    }

    // Load tasks initially from localStorage
    function loadTasks() {
        if (tasks.length > 0) {
            document.querySelector('.task-grid').style.display = 'block';
            tasks.forEach(task => {
                const taskItem = createTaskItem(task.id, task.title, task.description, task.priority, task.date);
                elements.taskList.appendChild(taskItem);
            });
        } else {
            document.querySelector('.task-grid').style.display = 'none';
        }
    }

    // Event Delegation for Task List
    elements.taskList.addEventListener('click', (event) => {
        const taskItem = event.target.closest('.task-item');
        if (!taskItem) return;

        const taskId = taskItem.dataset.taskId;
        selectedTask = tasks.find(task => task.id === taskId);

        elements.taskTitle.textContent = selectedTask.title;
        elements.taskDescription.value = selectedTask.description || "";
        elements.sidebar2.classList.add('active');
    });

    // Delete Task
    elements.deleteTaskBtn.addEventListener('click', () => {
        if (selectedTask) {
            tasks = tasks.filter(task => task.id !== selectedTask.id);  // Only remove selected task by id
            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadUpdatedTaskList();
        }

        elements.sidebar2.classList.remove('active');
        elements.taskTitle.textContent = "Task Title";
        elements.taskDescription.value = "";
    });

    // Save Task (Edit task name and description)
    elements.saveTaskBtn.addEventListener('click', () => {
        if (selectedTask) {
            selectedTask.title = elements.taskTitle.textContent;
            selectedTask.description = elements.taskDescription.value;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadUpdatedTaskList();
        }
    });

    // Update task list dynamically
    function loadUpdatedTaskList() {
        elements.taskList.innerHTML = "";
        loadTasks();
    }

    // Edit task functionality without prompt
    elements.editTaskBtn.addEventListener('click', () => {
        elements.taskTitle.contentEditable = true;
        elements.taskDescription.readOnly = false;
        elements.taskTitle.focus();
    });

    // Calendar popup functionality
    elements.taskDateInput.addEventListener('focus', function () {
        const calendar = document.querySelector('.calendar-popup');
        const inputRect = this.getBoundingClientRect();
        calendar.style.top = `${inputRect.bottom + window.scrollY}px`;
        calendar.style.left = `${inputRect.left}px`;
        calendar.style.display = 'block';
    });

    // Close Sidebar
    elements.closeSidebarBtn.addEventListener('click', () => {
        elements.sidebar2.classList.remove('active');
    });

    // Check if tasks exist to toggle task grid visibility
    function updateTaskVisibility() {
        const taskGrid = document.querySelector('.task-grid');
        const taskItems = document.querySelectorAll('.task-item');
        taskGrid.style.display = taskItems.length === 0 ? 'none' : 'block';
    }

    // Initial load
    loadTasks();
});
