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

  toggleTodo(index) {
    if (!this.activeListId) return;

    const todo = this.lists[this.activeListId].todos[index];
    if (todo) todo.completed = !todo.completed;

    this.saveToLocalStorage();
  }

  setActiveList(listId) {
    if (this.lists[listId]) this.activeListId = listId;

    render();
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
    listsHtml += `<div><button onclick="listManager.setActiveList('${key}')"><li class="list-group-item d-flex">${list.name}</li></button><button class="w-25" onclick="deleteList()">-</button></div>`;
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