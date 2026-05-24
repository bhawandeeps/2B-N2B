const form = document.querySelector("form");
const list = document.querySelector("#tasks");
const task = document.querySelector("#task");

const updateList = (_) => {
  window.localStorage.setItem("mytasks", JSON.stringify(tasks));
  let out = "";
  tasks.forEach((t, index) => {
    out += `
    <li class="list-item" draggable="true" data-index=${index}>
      <label>
        <input type="checkbox"
          data-index="${index}"
        ${t.status === "done" ? "checked" : ""}
        value="${t.name}"><span>${t.name}</span>
        <button data-index="${index}">ｘ</button>
        </label>
    </li>`;
  });
  list.innerHTML = out;
};

const addTask = (e) => {
  if (task.value) {
    tasks.push({ name: task.value, status: "active" });
    updateList();
    task.value = "";
  }
  e.preventDefault();
};

const changeTask = (e) => {
  let t = e.target;
  if (t.nodeName.toLowerCase() === "button") {
    const index = Number(t.dataset.index);
    tasks.splice(index, 1);
    updateList();
    e.preventDefault();
  }
  if (t.nodeName.toLowerCase() === "input") {
    const index = Number(t.dataset.index);
    tasks[index].status = t.checked ? "done" : "active";
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

const saveReorderedTaskToMemory = (e) => {
  e.target.classList.remove("dragging");

  const items = list.querySelectorAll(".list-item");

  const reorderedTasks = [];

  for (const item of items) {
    const index = Number(item.dataset.index);

    reorderedTasks.push(tasks[index]);
  }

  tasks = reorderedTasks;
  updateList();
};

//initialize tasks as an array
let tasks = JSON.parse(localStorage.getItem("mytasks") || "[]");
updateList(tasks);
console.log(tasks);
console.log(typeof tasks);
console.log(Array.isArray(tasks));

list.addEventListener("dragstart", (e) => {
  e.target.classList.add("dragging");
});

list.addEventListener("dragend", saveReorderedTaskToMemory);

list.addEventListener("dragover", reorderTask);

list.addEventListener("click", changeTask);
form.addEventListener("submit", addTask);
