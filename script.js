class ListManager {
  constructor() {
    this.lists = JSON.parse(localStorage.getItem('lists')) || {};
    this.activeListId = null;
  }

  setActiveList(listId) {
    if (this.lists[listId]) {
      this.activeListId = listId;
      this.saveToLocalStorage();
      localStorage.setItem("activeListId", listId);

      render();
    }
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
    if (!this.lists[listId]) return;

    delete this.lists[listId];
    this.saveToLocalStorage();

    if (this.activeListId === listId) {
        this.activeListId = null;
    }

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

    this.lists[this.activeListId].todos.splice(index, 1);
    this.saveToLocalStorage();
    render();
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
  let listsHtml = '<ul class="list-group">';
  for (const key in listManager.lists) {
      const list = listManager.lists[key];
      listsHtml += `
          <li class="list-group-item d-flex justify-content-between">
              <button onclick="listManager.setActiveList('${key}')">${list.name}</button>
              <button class="btn btn-danger btn-sm" onclick="listManager.deleteList('${key}')">🗑</button>
          </li>`;
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
