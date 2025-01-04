import React, { useState, useEffect } from 'react';
    import Cookies from 'js-cookie';

    function App() {
      const [todos, setTodos] = useState([]);
      const [newTodo, setNewTodo] = useState('');

      useEffect(() => {
        const storedTodos = Cookies.get('todos');
        if (storedTodos) {
          setTodos(JSON.parse(storedTodos));
        }
      }, []);

      useEffect(() => {
        Cookies.set('todos', JSON.stringify(todos), { expires: 365 });
      }, [todos]);

      const addTodo = () => {
        if (newTodo.trim() !== '') {
          const now = new Date().toISOString();
          const newTodoItem = {
            id: Date.now(),
            text: newTodo,
            completed: false,
            createdAt: now,
            editedAt: now,
          };
          setTodos([newTodoItem, ...todos]);
          setNewTodo('');
        }
      };

      const toggleComplete = (id) => {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo,
          ),
        );
      };

      const deleteTodo = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
      };

      const editTodo = (id, newText) => {
        setTodos(
          todos.map((todo) =>
            todo.id === id
              ? { ...todo, text: newText, editedAt: new Date().toISOString() }
              : todo,
          ),
        );
      };

      return (
        <div className="container">
          <h1>Todo List</h1>
          <div className="input-container">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add new todo"
            />
            <button onClick={addTodo}>Add</button>
          </div>
          <ul>
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                toggleComplete={toggleComplete}
                deleteTodo={deleteTodo}
                editTodo={editTodo}
              />
            ))}
          </ul>
        </div>
      );
    }

    function TodoItem({ todo, toggleComplete, deleteTodo, editTodo }) {
      const [isEditing, setIsEditing] = useState(false);
      const [editText, setEditText] = useState(todo.text);

      const handleEdit = () => {
        if (isEditing) {
          editTodo(todo.id, editText);
        }
        setIsEditing(!isEditing);
      };

      return (
        <li key={todo.id}>
          <div className="todo-text-container">
            {isEditing ? (
              <input
                type="text"
                className="edit-input"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            ) : (
              <span
                className={`todo-text ${todo.completed ? 'completed' : ''}`}
                onClick={() => toggleComplete(todo.id)}
              >
                {todo.text}
              </span>
            )}
            <span className="date-info">
              Created: {new Date(todo.createdAt).toLocaleString()}
              {todo.createdAt !== todo.editedAt &&
                ` | Edited: ${new Date(todo.editedAt).toLocaleString()}`}
            </span>
          </div>
          <div className="todo-actions">
            <button onClick={handleEdit}>{isEditing ? 'Save' : 'Edit'}</button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </div>
        </li>
      );
    }

    export default App;
