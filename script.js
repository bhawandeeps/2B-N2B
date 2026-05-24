const form = document.querySelector("form");
const list = document.querySelector("#tasks");
const task = document.querySelector("#task");

const updateList = (_) => {
  window.localStorage.setItem("mytasks", JSON.stringify(tasks));
  let out = "";
  for (t of Object.keys(tasks)) {
    out += `
    <li class="list-item" draggable="true">
      <label>
        <input type="checkbox"
        ${tasks[t] === "done" ? "checked" : ""}
        value="${t}"><span>${t}</span>
        <button data-task="${t}">ｘ</button>
        </label>
    </li>`;
  }
  list.innerHTML = out;
};

const addTask = (e) => {
  if (task.value) {
    tasks[task.value] = "active";
    updateList();
    task.value = "";
  }
  e.preventDefault();
};

const changeTask = (e) => {
  let t = e.target;
  if (t.dataset.task) {
    delete tasks[t.dataset.task];
    updateList();
    e.preventDefault();
  }
  if (t.nodeName.toLowerCase() === "input") {
    tasks[t.value] = t.checked ? "done" : "active";
    updateList();
    e.preventDefault();
  }
};

const reorderTask = (e) => {
  e.preventDefault();
  const draggingItem = document.querySelector(".dragging");
  const siblings = [...list.querySelectorAll(".list-item:not(.dragging)")];

  const nextSibling = siblings.find((sibling) => {
    const box = sibling.getBoundingClientRect();
    return e.clientY <= box.top + box.height / 2;
  });

  list.insertBefore(draggingItem, nextSibling);
};

let tasks = window.localStorage.getItem("mytasks")
  ? JSON.parse(window.localStorage.getItem("mytasks"))
  : {};
updateList(tasks);

list.addEventListener("dragstart", (e) => {
  e.target.classList.add("dragging");
});

list.addEventListener("dragend", (e) => {
  e.target.classList.remove("dragging");
});

list.addEventListener("dragover", reorderTask);

list.addEventListener("click", changeTask);
form.addEventListener("submit", addTask);
