var storedItem = localStorage.getItem("storedItem");
var storedItem2 = localStorage.getItem("storedItem2");
function save() {
  var item = document.getElementById("task").value;
  var item2 = document.getElementById("deskripsi").value;
  localStorage.setItem("storedItem", item);
  localStorage.setItem("storedItem2", item2);
  document.getElementById("savedText").innerHTML = item;
}

function get() {
  localStorage.getItem("storedItem");
  document.getElementById("task").value = storedItem;
  document.getElementById("deskripsi").value = storedItem2;
  document.getElementById("savedTask").innerText = storedItem;
}