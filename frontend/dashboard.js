// ================= LOGIN CHECK =================

const userEmail = localStorage.getItem("userEmail");

if (!userEmail) {
    window.location.href = "login.html";
}

//------------------ USERNAME ----------------
const userName =
    localStorage.getItem("userName");

const dashboardTitle =
    document.getElementById(
        "dashboardTitle"
    );

if (
    dashboardTitle &&
    userName
) {
    const hour = new Date().getHours();

let greeting = "";

if (hour < 12) {
    greeting = "Good Morning ☀️";
}
else if (hour < 18) {
    greeting = "Good Afternoon 🌤️";
}
else {
    greeting = "Good Evening 🌙";
}

dashboardTitle.innerHTML =
`${greeting} , <span class="user-name">${userName}</span>`;
}

// ================= WELCOME =================

const welcomeText = document.getElementById("welcomeText");

if (welcomeText) {
    welcomeText.textContent = `Logged in as ${userEmail}`;
}

// ================= LOGOUT =================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("userEmail");

    window.location.href = "login.html";
});

// ================= ELEMENTS =================

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const searchInput = document.getElementById("searchInput");

const filterButtons =
    document.querySelectorAll(".filter-btn");

// ================= STATS =================

function updateStats() {

    const tasks =
    document.querySelectorAll(".task");

const completed =
    document.querySelectorAll(
        ".task-text.completed"
    );

totalTasks.textContent =
    tasks.length;

completedTasks.textContent =
    completed.length;

pendingTasks.textContent =
    tasks.length - completed.length;

// Due Today code ...

// Progress Bar

const percentage =
    tasks.length === 0
    ? 0
    : Math.round(
        (completed.length /
        tasks.length) * 100
    );

const progressText =
    document.getElementById(
        "progressText"
    );

const progressFill =
    document.getElementById(
        "progressFill"
    );

if (progressText) {
    progressText.textContent =
        `${percentage}%`;
}

if (progressFill) {
    progressFill.style.width =
        `${percentage}%`;
}
}
// ================= CREATE TASK =================

function createTask(taskText, deadline) {

    const task =
        document.createElement("div");

    task.classList.add("task");

    const formattedDate =
    new Date(deadline)
    .toLocaleString("en-IN", {
        day:"2-digit",
        month:"short",
        year:"numeric",
        hour:"2-digit",
        minute:"2-digit"
    });

    task.innerHTML = `

        <div class="task-content">

    <div>

        <div class="task-text">
            ${taskText}
        </div>

            <small class="deadline">
            📅 Due: ${formattedDate}
            </small>

    </div>

    </div>

        <div class="task-buttons">

            <button class="done-btn">
                Mark as Done
            </button>

            <button class="edit-btn">
                Edit
            </button>

            <button class="delete-btn">
                Delete
            </button>

        </div>

    `;

    taskList.appendChild(task);

    updateStats();
}

// ================= LOAD TODOS =================

async function loadTodos() {

    try {

        const response = await fetch(
            `http://localhost:5000/api/todo/${userEmail}`
        );

        const todos =
            await response.json();

        taskList.innerHTML = "";

        let dueToday = 0;

        const today =
            new Date().toDateString();

        todos.forEach(todo => {

            createTask(
                todo.task,
                todo.deadline
            );

            if (
                todo.deadline &&
                new Date(todo.deadline)
                .toDateString() === today
            ) {

                dueToday++;
            }

        });

        const dueTodayCount =
            document.getElementById(
                "dueTodayCount"
            );

        if (dueTodayCount) {

            dueTodayCount.textContent =
                `📅 Due Today: ${dueToday} Tasks`;
        }

        updateStats();

    } catch (error) {

        console.log(error);
    }
}

// ================= ADD TASK =================

addBtn.addEventListener("click", async () => {

    const taskText =    
        taskInput.value.trim();

    const deadline =
    document.getElementById(
        "deadlineInput"
    ).value;

    if (!taskText) {

        alert("Please enter a task");
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/todo/add",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                    "application/json"
                },
                body: JSON.stringify({
                    userEmail,
                    task: taskText,
                    deadline
                })
            }
        );

        const data =
            await response.json();

        if (response.ok) {

    createTask(taskText, deadline);

    taskInput.value = "";

    document.getElementById(
        "deadlineInput"
    ).value = "";

} else {

    alert(data.message);
}

    } catch (error) {

        console.log(error);

        alert("Server Error");
    }

});

// ================= ENTER KEY =================

taskInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        addBtn.click();
    }
});

// ================= DELETE & EDIT =================

taskList.addEventListener("click", (e) => {

    // Mark as Done

if (
    e.target.classList.contains(
        "done-btn"
    )
) {

    const taskText =
        e.target
        .closest(".task")
        .querySelector(".task-text");

    taskText.classList.add(
        "completed"
    );

    e.target.textContent =
        "Undo";

    e.target.classList.remove(
        "done-btn"
    );

    e.target.classList.add(
        "undo-btn"
    );

    updateStats();
}

    // Undo Task

else if (
    e.target.classList.contains(
        "undo-btn"
    )
) {

    const confirmUndo =
        confirm(
            "Are you sure you want to undo this task?"
        );

    if (!confirmUndo) {
        return;
    }

    const taskText =
        e.target
        .closest(".task")
        .querySelector(".task-text");

    taskText.classList.remove(
        "completed"
    );

    e.target.textContent =
        "Mark as Done";

    e.target.classList.remove(
        "undo-btn"
    );

    e.target.classList.add(
        "done-btn"
    );

    updateStats();
}


    // Delete

    if (
        e.target.classList.contains(
            "delete-btn"
        )
    ) {

        e.target
            .closest(".task")
            .remove();

        updateStats();
    }

    // Edit

    if (
        e.target.classList.contains(
            "edit-btn"
        )
    ) {

        const taskText =
            e.target
            .closest(".task")
            .querySelector(".task-text");

        const newTask =
            prompt(
                "Edit Task",
                taskText.textContent
            );

        if (
            newTask &&
            newTask.trim() !== ""
        ) {

            taskText.textContent =
                newTask;
        }
    }

});

// ================= COMPLETE TASK =================

taskList.addEventListener("change", (e) => {

    if (
        e.target.classList.contains(
            "checkTask"
        )
    ) {

        const taskText =
            e.target
            .closest(".task")
            .querySelector(".task-text");

        if (e.target.checked) {

            taskText.classList.add(
                "completed"
            );

        } else {

            taskText.classList.remove(
                "completed"
            );
        }

        updateStats();
    }

});

// ================= SEARCH =================

searchInput.addEventListener("input", () => {

    const value =
        searchInput.value
        .toLowerCase()
        .trim();

    const tasks =
        document.querySelectorAll(".task");

    tasks.forEach(task => {

        const taskText =
            task.querySelector(".task-text")
            .textContent
            .toLowerCase();

        if (
            taskText.includes(value)
        ) {

            task.style.display =
                "flex";

        } else {

            task.style.display =
                "none";
        }

    });

});

// ================= FILTERS =================
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const filter =
            button.textContent.trim();

        const tasks =
            document.querySelectorAll(".task");

        tasks.forEach(task => {

            const isCompleted =
                task.querySelector(".task-text")
                .classList.contains("completed");

            if (filter === "All") {

                task.style.display = "flex";

            }

            else if (filter === "Completed") {

                task.style.display =
                    isCompleted
                    ? "flex"
                    : "none";

            }

            else if (filter === "Pending") {

                task.style.display =
                    !isCompleted
                    ? "flex"
                    : "none";

            }

        });

        // Remove old message

        const oldMessage =
            document.getElementById("emptyMessage");

        if (oldMessage) {
            oldMessage.remove();
        }

        // Check visible tasks

        const visibleTasks =
            [...document.querySelectorAll(".task")]
            .filter(task =>
                task.style.display !== "none"
            );

        if (visibleTasks.length === 0) {

            const message =
                document.createElement("h2");

            message.id = "emptyMessage";

            if (filter === "Pending") {

                message.textContent =
                    "🎉 Woohoo! No pending works";

            }

            else if (filter === "Completed") {

                message.textContent =
                    "😴 No completed tasks yet";

            }

            message.style.textAlign = "center";
            message.style.marginTop = "20px";
            message.style.color = "#38bdf8";

            taskList.appendChild(message);
        }

    });

});

// ================= INITIAL LOAD =================

loadTodos();