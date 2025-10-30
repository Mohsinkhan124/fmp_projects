var firebaseConfig = {
  apiKey: "AIzaSyCB6NTCQ90Mlfj1jSq0RBtlONgn8UDlrdM",
  authDomain: "mohsin-portfolio-4aca9.firebaseapp.com",
  databaseURL: "https://mohsin-portfolio-4aca9-default-rtdb.firebaseio.com",
  projectId: "mohsin-portfolio-4aca9",
  storageBucket: "mohsin-portfolio-4aca9.firebasestorage.app",
  messagingSenderId: "952247237398",
  appId: "1:952247237398:web:77cafe767d884f10436e37",
  measurementId: "G-FJWBT8YRN1"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.database();

const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");

function addTask() {
  const taskText = input.value.trim();
  if (taskText === "") return alert("Please enter a task!");

  const key = db.ref("todos").push().key;
  const taskObj = { id: key, text: taskText };

  db.ref("todos/" + key).set(taskObj);
  input.value = "";
}

db.ref("todos").on("child_added", snapshot => {
  const data = snapshot.val();
  renderTask(data);
});

db.ref("todos").on("child_changed", snapshot => {
  const li = document.getElementById(snapshot.key);
  if (li) li.querySelector("span").textContent = snapshot.val().text;
});

db.ref("todos").on("child_removed", snapshot => {
  const li = document.getElementById(snapshot.key);
  if (li) li.remove();
});

function renderTask(data) {
  const li = document.createElement("li");
  li.id = data.id;

  const span = document.createElement("span");
  span.textContent = data.text;

  const btnGroup = document.createElement("div");
  btnGroup.classList.add("btn-group");

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit");
  editBtn.onclick = function() {
    const newText = prompt("Edit your task:", span.textContent);
    if (newText && newText.trim() !== "") {
      db.ref("todos/" + data.id).update({ text: newText.trim() });
    }
  };

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.classList.add("delete");
  delBtn.onclick = function() {
    db.ref("todos/" + data.id).remove();
  };

  btnGroup.appendChild(editBtn);
  btnGroup.appendChild(delBtn);
  li.appendChild(span);
  li.appendChild(btnGroup);
  list.appendChild(li);
}

function deleteAll() {
  db.ref("todos").remove();
  list.innerHTML = "";
}