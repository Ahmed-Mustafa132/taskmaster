class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.addTaskButton = document.getElementById('add-task-button');
        this.taskInput = document.getElementById('task-input');
        this.taskList = document.getElementById('task-list');

        this.initTheme();
        this.setupEventListeners();
        this.loadTasks();
    }

    initTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const icon = document.querySelector('#theme-toggle i');
        icon.className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);

        const icon = document.querySelector('#theme-toggle i');
        icon.className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    setupEventListeners() {
        this.addTaskButton.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        this.taskList.addEventListener('click', (e) => this.handleTaskActions(e));
        document.querySelector('.filter-buttons').addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                this.filterTasks(e.target.dataset.filter);
            }
        });
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
    }

    addTask() {
        const taskText = this.taskInput.value.trim();
        if (!taskText) return;

        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTask(task);

        this.taskInput.value = '';
        this.taskInput.focus();
    }

    renderTask(task) {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.dataset.id = task.id;
        taskItem.innerHTML = `
                    <span class="task-text">${task.text}</span>
                    <div class="task-actions">
                        <button class="btn-action btn-complete">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn-action btn-delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;

        this.taskList.appendChild(taskItem);
    }

    handleTaskActions(e) {
        const taskItem = e.target.closest('.task-item');
        if (!taskItem) return;

        const taskId = parseInt(taskItem.dataset.id);
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);

        if (e.target.closest('.btn-complete')) {
            this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
            taskItem.classList.toggle('completed');
            this.saveTasks();
        }

        if (e.target.closest('.btn-delete')) {
            this.tasks.splice(taskIndex, 1);
            taskItem.remove();
            this.saveTasks();
        }
    }

    filterTasks(filterValue) {
        const tasks = document.querySelectorAll('.task-item');
        tasks.forEach(task => {
            switch (filterValue) {
                case 'completed':
                    task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
                    break;
                case 'pending':
                    task.style.display = !task.classList.contains('completed') ? 'flex' : 'none';
                    break;
                default:
                    task.style.display = 'flex';
            }
        });
    }

    loadTasks() {
        this.taskList.innerHTML = '';
        this.tasks.forEach(task => this.renderTask(task));
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

// Initialize the application
const taskManager = new TaskManager();