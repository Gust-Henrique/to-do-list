document.addEventListener('DOMContentLoaded', () => { // Garante que o script será executado apenas após todo o conteúdo da página ter sido carregado.
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const filterButtons = document.querySelectorAll('.filters button'); //Captura os elementos do HTML que serão manipulados pelo JavaScript.

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTodo();
    }); //Impede a ação padrão do formulário e chama a função addTodo para adicionar uma nova tarefa.

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterTodos(button.id);
        });
    }); // Cada botão de filtro chama a função filterTodos passando o id do botão (todos, concluídos, pendentes).

    function loadTodos() {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.forEach(todo => {
            createTodoElement(todo.text, todo.completed);
        });
    } //Recupera as tarefas do localStorage e cria os elementos de tarefa na lista.

    function saveTodos() {
        const todos = [];
        document.querySelectorAll('#todo-list li').forEach(li => {
            todos.push({
                text: li.firstChild.textContent,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('todos', JSON.stringify(todos));
    } //Coleta todas as tarefas da lista e as salva no localStorage como uma string JSON.

    function addTodo() {
        const todoText = todoInput.value.trim();
        if (todoText === '') {
            return;
        }
        createTodoElement(todoText);
        saveTodos();
        todoInput.value = '';
    } //Adiciona uma nova tarefa à lista se o campo de entrada não estiver vazio e chama saveTodos.

    function createTodoElement(text, completed = false) {
        const li = document.createElement('li');
        li.textContent = text;
        if (completed) {
            li.classList.add('completed');
        }

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete');
        deleteButton.addEventListener('click', () => {
            li.remove();
            saveTodos();
        });

        li.addEventListener('click', () => {
            li.classList.toggle('completed');
            saveTodos();
        });

        li.addEventListener('dblclick', () => {
            const newText = prompt('Edit your task:', text);
            if (newText !== null) {
                li.firstChild.textContent = newText;
                saveTodos();
            }
        });

        li.appendChild(deleteButton);
        todoList.appendChild(li);
    } //Cria um elemento li para a tarefa, adiciona eventos de clique para marcar como concluída, editar e deletar, e adiciona o elemento à lista.

    function filterTodos(filter) {
        document.querySelectorAll('#todo-list li').forEach(li => {
            switch (filter) {
                case 'all':
                    li.style.display = 'flex';
                    break;
                case 'completed':
                    li.style.display = li.classList.contains('completed') ? 'flex' : 'none';
                    break;
                case 'pending':
                    li.style.display = !li.classList.contains('completed') ? 'flex' : 'none';
                    break;
            }
        });
    } //Altera a visibilidade das tarefas com base no filtro selecionado (todas, concluídas, pendentes).

    loadTodos();
});
