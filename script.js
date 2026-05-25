const form = document.querySelector("form");
const list = document.querySelector("#tasks");
const task = document.querySelector("#task");

const updateList = (_) => {
  window.localStorage.setItem("mytasks", JSON.stringify(tasks));
  let out = "";
  tasks.forEach((t, index) => {
    out += `
   <li class="list-item" draggable="true" data-index=${index}>
      <div>
        <input id="task" type="checkbox"
          data-index="${index}"
        ${t.status === "done" ? "checked" : ""}
        value="${t.name}">
      </div>
      <div>
        <span class="ck-tname">${t.name}</span>
        <button data-index="${index}">ｘ</button>
        </div>
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
  if (t.type === "checkbox") {
    const index = Number(t.dataset.index);
    tasks[index].status = t.checked ? "done" : "active";
    updateList();
    e.preventDefault();
  }
};

//reorder
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

//change name
const renameTask = (e) => {
  const t = e.target;

  if (t.tagName !== "SPAN") {
    return;
  }

  const oldContent = t.textContent;
  const index = Number(t.closest(".list-item").dataset.index);

  const input = document.createElement("input");
  input.type = "text";
  input.value = oldContent;
  t.replaceWith(input);
  input.focus();

  const saveValue = (_) => {
    tasks[index].name = input.value || oldContent;
    updateList();
  };

  input.addEventListener("blur", saveValue);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      input.blur();
    }
  });
};

//initialize tasks as an array
let tasks = JSON.parse(localStorage.getItem("mytasks") || "[]");
updateList(tasks);

//dragging events
list.addEventListener("dragstart", (e) => {
  e.target.classList.add("dragging");
});

list.addEventListener("dragend", saveReorderedTaskToMemory);

list.addEventListener("dragover", reorderTask);

//click events
list.addEventListener("click", changeTask);
list.addEventListener("dblclick", renameTask);
form.addEventListener("submit", addTask);
