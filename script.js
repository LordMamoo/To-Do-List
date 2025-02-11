const lists = {
    1: {
      name: "Shopping list",
      todos: [
        {
          text: 'bananas',
          completed: false
        },
        {
          text: '1 lbs ground turkey',
          completed: false
        }
      ]
    },

    // 2: {
    //     name: "Video Games",
    //     todos: [
    //         {
    //             text: 'Elden Ring',
    //             completed: false
    //         },
    //         {
    //             text: 'Halo',
    //             completed: true
    //         }
    //     ]
    // }
}
const currentList = lists[1];

// function render() {
//     // this will hold the html that will be displayed in the sidebar
//     let listsHtml = '<ul class="list-group">';
//     // iterate through the lists to get their names
//     lists.forEach((list) => {
//       listsHtml += `<li class="list-group-item">${list.name}</li>`;
//     });
   
//     listsHtml += '</ul>';
//     // print out the lists
   
//     document.getElementById('lists').innerHTML = listsHtml;
//     // print out the name of the current list
   
//     document.getElementById('current-list-name').innerText = currentList.name;
//     // iterate over the todos in the current list
   
//     let todosHtml = '<ul class="list-group-flush">';
//     currentList.todos.forEach((list) => {
//       todosHtml += `<li class="list-group-item">${todo.text}</li>`;
//     });
//     // print out the todos
//     document.getElementById('current-list-todos').innerHTML = todosHtml;
//    }

function render() {
    // Render lists
    let listsHtml = '<ul class="list-group">';
    for (const key in lists) {
        const list = lists[key];
        listsHtml += `<li class="list-group-item">${list.name}</li>`;
    }
    listsHtml += '</ul>';
    document.getElementById('lists').innerHTML = listsHtml;

    // Render current list name and todos
    if (currentList) {
        document.getElementById('current-list-name').innerText = currentList.name;

        let todosHtml = '<ul class="list-group-flush">';
        currentList.todos.forEach((todo) => {
            const completedClass = todo.completed ? 'completed' : '';
            todosHtml += `<li class="list-group-item ${completedClass}">${todo.text}</li>`;
        });
        todosHtml += '</ul>';
        document.getElementById('current-list-todos').innerHTML = todosHtml;
    }
}

// function addList() {

// }

// function removeList() {

// }

function addTodo() {
    // get the todo text from the todo input box
    const text = document.getElementById('todo-input-box').value;
    if(text) {
        currentList.todos.push({
            text: text,
            completed: false
        })
        render();
    }
}

// function removeTodo() {

// }

// function markTodoAsCompleted() {

// }

// function removeAllTodosCompleted() {

// }