class ListManager {
  constructor() {
    this.lists = JSON.parse(localStorage.getItem('lists')) || {};
    this.activeListId = null;
  }

  addList(name) {
    if (!name.trim()) return;

    const newListId = Date.now().toString();
    this.lists[newListId] = { name, todos: [] };

    this.saveToLocalStorage();
    this.activeListId = newListId;
  }

  removeList(listId) {
    delete this.lists[listId];
    this.saveToLocalStorage();
  }

  addTodo(text) {
    if (!this.activeListId || !text.trim()) return;

    this.lists[this.activeListId].todos.push({text, completed:false});
  }

  removeTodo(index) {
    if (!this.activeListId) return;

    this.lists[this.activeListId].todos.splice(index, 1);
    this.saveToLocalStorage();
  }

  toggleTodo(index) {
    if (!this.activeListId) return;

    const todo = this.lists[this.activeListId].todos[index];
    if (todo) todo.completed = !todo.completed;

    this.saveToLocalStorage();
  }

  setActiveList(listId) {
    if (this.lists[listId]) this.activeListId = listId;
  }

  saveToLocalStorage() {
    localStorage.setItem("lists", JSON.stringify(this.lists));
  }
}

const listManager = new ListManager();

function render() {
  const lists = listManager.lists;

  let listsHtml = '<ul class="list-group">';
  for (const key in lists) {
    const list = lists[key];
    listsHtml += `<button onclick="setActiveList(${key})"><li class="list-group-item">${list.name}</li></button>`;
  }
  listsHtml += '</ul>';
  document.getElementById('lists').innerHTML = listsHtml;

  // Render current list name and todos
  const activeList = listManager.lists[listManager.activeListId];
  if (activeList) {
    document.getElementById('current-list-name').innerText = activeList.name;

    let todosHtml = '<ul class="list-group-flush">';
    activeList.todos.forEach((todo, index) => {
      const completedClass = todo.completed ? 'completed' : '';
      todosHtml += `<li class="d-flex justify-content-between align-items-center list-group-item rounded-2 m-2 ${completedClass}">
                    <div>
                      <input type="checkbox" ${todo.completed ? 'checked' : ''} onclick="markTodoAsCompleted(${index})"> ${todo.text}
                    </div>
                    <button class="rounded-2" onclick="removeTodo(${index})">-</button></li>`;
    });
    todosHtml += '</ul>';
    document.getElementById('current-list-todos').innerHTML = todosHtml;
  }
}

function addList() {
  const listName = document.getElementById('list-input-box').value;

  listManager.addList(listName);

  document.getElementById("list-inut-box").value = "";
  render()
}

function removeList() {
}

function setActiveList(listId) {
  listManager.setActiveList(listId);
  render();
}

// function loadActiveList() {
// //   const savedListId = localStorage.getItem("activeListId");

// //   if (savedListId && lists[savedListId]) {
// //     activeListId = savedListId;
// //     currentList = lists[savedListId];
// //   } else {
// //     activeListId = Object.keys(lists)[0];
// //     currentList = lists[activeListId];
// //   }

// //   render();
// // }

// // loadActiveList();

// function addTodo() {
//   const text = document.getElementById('todo-add-box').value;
//   if(text) {
//     currentList.todos.push({
//       text: text,
//       completed: false
//     })
//     render();
//   }
// }

// function removeTodo() {
//   const text = document.getElementById('todo-remove-box').value;
//   const rm = indexOf(text);
//   delete currentList[rm]
//   render();
// }

// function markTodoAsCompleted() {
//   if (activeListId && lists[activeListId]) {
//     lists[activeListId].todos[index].completed = !lists[activeListId].todos[index].completed; // Toggle completion

//     saveToLocalStorage(); // Save to localStorage
//     render(); // Re-render UI
//   }
// }

// // function removeAllTodosCompleted() {

// // }

// function saveToLocalStorage() {
//   localStorage.setItem("lists", JSON.stringify(lists));
// }

// function loadListsFromLocalStorage() {
//   const savedLists = localStorage.getItem("lists");
//   lists = savedLists ? JSON.parse(savedLists) : {}; // Convert back to object or start fresh
// }

loadListsFromLocalStorage();