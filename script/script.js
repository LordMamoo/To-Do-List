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

  reorderLists(oldIndex, newIndex) {
    if (oldIndex === newIndex) return;

    const listEntries = Object.entries(this.lists);
    const [movedItem] = listEntries.splice(oldIndex, 1);
    listEntries.splice(newIndex, 0, movedItem);
    this.lists = Object.fromEntries(listEntries);

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

  editTodo(index, newText) {
    if (!this.activeListId || !newText.trim()) return;

    this.lists[this.activeListId].todos[index].text = newText.trim();

    this.saveToLocalStorage();

    render();
  }

  showEditInput(index) {
    document.getElementById(`todo-text-${index}`).classList.add('d-none');
    const inputField = document.getElementById(`todo-input-${index}`);
    inputField.classList.remove('d-none');
    inputField.focus();

    // Remove any previous event listener to prevent duplication
    inputField.removeEventListener("keypress", this.handleEditKeyPress);

    // Define event handler function
    this.handleEditKeyPress = function(event) {
      if (event.key === "Enter") {
        listManager.saveEdit(index);
      }
    };

    // Attach event listener
    inputField.addEventListener("keypress", this.handleEditKeyPress);
    console.log(newText);
  }


  saveEdit(index) {
    const inputField = document.getElementById(`todo-input-${index}`);
    const newText = inputField.value.trim();

    if (newText) {
        this.editTodo(index, newText);
    } else {
        inputField.value = this.lists[listManager.activeListId].todos[index].text;
    }

    document.getElementById(`todo-text-${index}`).classList.remove('d-none');
    inputField.classList.add('d-none');

    this.saveToLocalStorage();
  }

  removeTodo(index) {
    if (!this.activeListId) return;

    this.lists[this.activeListId].todos.splice(index, 1);
    this.saveToLocalStorage();
    render();
  }

  reorderTodos(oldIndex, newIndex) {
    if (!this.activeListId || oldIndex === newIndex) return;

    const updatedTodos = this.lists[this.activeListId].todos;
    const [movedItem] = updatedTodos.splice(oldIndex, 1);
    updatedTodos.splice(newIndex, 0, movedItem);

    this.saveToLocalStorage();

    render();
  }

  deleteCompleted() {
    if (!this.activeListId) return;

    this.lists[this.activeListId].todos = this.lists[this.activeListId].todos.filter(todo => !todo.completed);
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
    } else {
      this.activeListId = null;
    }

    render();
  }
}

const listManager = new ListManager();

function render() {
  let listsHtml = '<ul id="list" class="list-group">';
  for (const key in listManager.lists) {
    const list = listManager.lists[key];
    listsHtml += `
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span><button class="btn" onclick="listManager.setActiveList('${key}')">${list.name}</button></span>
        <button class="btn rounded-2 h-25" onclick="listManager.deleteList('${key}')"><span class="material-symbols-outlined">delete</span></button>
      </li>`;
  }
  listsHtml += '</ul>';
  document.getElementById('lists').innerHTML = listsHtml;

  let currentList = listManager.lists[listManager.activeListId];

  if (currentList) {
    document.getElementById('current-list-name').innerText = currentList.name;
  } else {
    document.getElementById('current-list-name').innerText = "";
    document.getElementById('current-list-todos').innerHTML = "";
    document.getElementById('completed-todos').innerHTML = "";
    return;
  }
  

  let incompleteTodosHtml = '<ul id="todo-list" class="list-group">';
  let completedTodosHtml = '<ul id="todo-list" class="list-group">';

  currentList.todos.forEach((todo, index) => {
    const completedClass = todo.completed ? 'completed' : '';

    let todoHtml = `
    <li class="d-flex justify-content-between align-items-center list-group-item rounded-2 m-2 ${completedClass}">
      <div>
        <input type="checkbox" ${todo.completed ? 'checked' : ''} onclick="listManager.toggleTodo(${index})">
        <span id="todo-text-${index}" ondblclick="listManager.showEditInput(${index})">
          ${todo.text}
        </span>
        <input type="text" id="todo-input-${index}" class="todo-edit-input d-none" 
          value="${todo.text.replace(/"/g, '&quot;')}" 
          onblur="listManager.saveEdit(${index})" 
          onkeypress="if(event.key === 'Enter') listManager.saveEdit(${index})">
      </div>
      <button class="btn" onclick="listManager.removeTodo(${index})"><span class="material-symbols-outlined">delete</span></button>
    </li>`;
  
    if (todo.completed) {
      completedTodosHtml += todoHtml;
    } else {
      incompleteTodosHtml += todoHtml;
    }

    console.log(`Todo ${index}:`, todo);
  });

  incompleteTodosHtml += '</ul>';
  completedTodosHtml += '</ul>';

  document.getElementById('current-list-todos').innerHTML = incompleteTodosHtml;
  document.getElementById('completed-todos').innerHTML = completedTodosHtml;

  new Sortable(document.getElementById('list'), {
    animation: 150,
    ghostClass: "sortable-ghost",
    onEnd: function(evt) {
        listManager.reorderLists(evt.oldIndex, evt.newIndex);
    }
  })

  new Sortable(document.getElementById('todo-list'), {
    animation: 150,
    ghostClass: "sortable-ghost",
    onEnd: function(evt) {
        listManager.reorderTodos(evt.oldIndex, evt.newIndex);
    }
  })
}

document.getElementById("todo-add-box").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission if inside a form
    const text = event.target.value.trim();
    if (text) {
      listManager.addTodo(text);
      event.target.value = ""; // Clear input field after adding
    }
  }
});