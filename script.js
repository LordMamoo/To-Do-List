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

    
    document.getElementById("list-input-box").value = "";
    render();
  }

  deleteList(listId) {
    delete this.lists[listId];
    this.saveToLocalStorage();

    render();
  }

  addTodo(text) {
    if (!this.activeListId || !text.trim()) return;

    this.lists[this.activeListId].todos.push({text, completed:false});

    this.saveToLocalStorage();

    document.getElementById("todo-add-box").value = "";
    render();
  }

  removeTodo(index) {
    if (!this.activeListId) return;

    this.lists[this.activeListId].todos.splice(index, 1); // Remove the todo
    this.saveToLocalStorage(); // Save changes
    render(); // Update UI
  }

  toggleTodo(index) {
    if (!this.activeListId) return;

    const todo = this.lists[this.activeListId].todos[index];
    if (todo) {
        todo.completed = !todo.completed;
        this.saveToLocalStorage();
        render();
    }
}

  setActiveList(listId) {
    if (this.lists[listId]) {
      this.activeListId = listId;
      this.saveToLocalStorage();
      localStorage.setItem("activeListId", listId);

      render();
    }
  }

  saveToLocalStorage() {
    localStorage.setItem("lists", JSON.stringify(this.lists));
    localStorage.setItem("activeListId", this.activeListId);
  }

  loadFromLocalStorage() {
    const storedLists = localStorage.getItem("lists");
    const storedActiveListId = localStorage.getItem("activeListId");

    if (storedLists) {
        this.lists = JSON.parse(storedLists);
    }

    if (storedActiveListId && this.lists[storedActiveListId]) {
        this.activeListId = storedActiveListId;
    }

    render();
}
}

const listManager = new ListManager();

function render() {
  const lists = listManager.lists;

  let listsHtml = '<ul class="list-group d-flex">';
  for (const key in lists) {
    const list = lists[key];
    listsHtml += `<li class="list-group-item d-flex w-75" onclick="listManager.setActiveList('${key}')">${list.name}</li><button class="w-25" onclick="deleteList()">-</button>`;
  }
  listsHtml += '</ul>';
  document.getElementById('lists').innerHTML = listsHtml;

  if (!listManager.activeListId) return;

  const currentList = listManager.lists[listManager.activeListId];
  document.getElementById('current-list-name').innerText = currentList.name;

  let incompleteTodosHtml = '<ul class="list-group">';
  let completedTodosHtml = '<ul class="list-group">';

  currentList.todos.forEach((todo, index) => {
      const completedClass = todo.completed ? 'completed' : '';
      const todoHtml = `
          <li class="d-flex justify-content-between align-items-center list-group-item rounded-2 m-2 ${completedClass}">
              <div>
                  <input type="checkbox" ${todo.completed ? 'checked' : ''} onclick="listManager.toggleTodo(${index})"> 
                  ${todo.text}
              </div>
              <button class="rounded-2" onclick="listManager.removeTodo(${index})">-</button>
          </li>`;

      if (todo.completed) {
          completedTodosHtml += todoHtml; // Add to completed section
      } else {
          incompleteTodosHtml += todoHtml; // Add to incomplete section
      }
  });

  incompleteTodosHtml += '</ul>';
  completedTodosHtml += '</ul>';

  // Update UI
  document.getElementById('current-list-todos').innerHTML = incompleteTodosHtml;
  document.getElementById('completed-todos').innerHTML = completedTodosHtml;
}
