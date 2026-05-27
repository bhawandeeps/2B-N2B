const form = document.querySelector("form");
const list = document.querySelector("#tasks");
const task = document.querySelector("#task");

const updateList = (_) => {
  window.localStorage.setItem("mytasks", JSON.stringify(tasks));
  let out = "";
  tasks.forEach((t, index) => {
    out += `
   <li class="list-item" draggable="true" data-index=${index}>
   <div class="to-do-ck">
       <div class="checkbox-wrapper-61">
         <input
           type="checkbox"
           class="check"
           id="check-${index}"
           data-index="${index}"
           ${t.status === "done" ? "checked" : ""}
         />
         <label for="check-${index}" class="label">
           <svg width="25" height="25" viewBox="0 0 95 95">
             <circle
               cx="50"
               cy="50"
               r="30"
               stroke="black"
               stroke-width="4"
               fill="none"
             />
             <g transform="translate(0,-952.36222)">
               <path
                 d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                 stroke="black"
                 stroke-width="4"
                 fill="none"
                 class="path1"
               />
             </g>
           </svg>
         </label>
       </div>
     </div>
      <div class="to-do-name" style="
      ${t.status === "done" ? "text-decoration: line-through; text-decoration-thickness: 2px;" : " "}
      ">
        <span class="ck-tname">${t.name}</span>
        </div>
      <div class="to-do-del">
        <button data-index="${index}"><img src="images/fishbone.svg" width="20" height="20"></button>
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
