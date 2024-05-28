import { useState, useEffect } from 'react';
import axios from 'axios';
import TodoSearch from './components/TodoSearch';
import TodoFilter from './components/TodoFilter';
import TodoList from './components/TodoList';

function App() {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/todos")
      .then(res => {
        setTodos(res.data);
        setFilteredTodos(res.data); // Initialize filteredTodos with all todos
      })
      .catch(err => setErrors(err.message));
  }, []);

  const addTodo = (data) => {
    const originalTodos = [...todos];
    const newTodo = { ...data, id: parseInt(todos[todos.length - 1]?.id || 0) + 1, status: "Active" };
    setTodos([...todos, newTodo]);
    setFilteredTodos([...filteredTodos, newTodo]);
    axios.post("http://127.0.0.1:8000/todos", newTodo)
      .then(res => {
        setTodos([...todos, res.data]);
        setFilteredTodos([...filteredTodos, res.data]);
      })
      .catch(err => {
        setErrors(err.message);
        setTodos(originalTodos);
        setFilteredTodos(originalTodos);
      });
  };

  const updateTodo = (e, id, text, todo) => {
    e.preventDefault();
    const updatedTodo = { ...todo, task: text, status: "Active" };
    setTodos(todos.map(t => t.id === todo.id ? updatedTodo : t));
    setFilteredTodos(filteredTodos.map(t => t.id === todo.id ? updatedTodo : t));

    axios.patch("http://127.0.0.1:8000/todos/" + id, updatedTodo)
      .catch(err => {
        setErrors(err.message);
        setTodos(todos);
        setFilteredTodos(filteredTodos);
      });
  };

  const completeTodo = (e, id, todo) => {
    const updatedTodo = { ...todo, completed: e.target.checked };
    setTodos(todos.map(t => t.id === id ? updatedTodo : t));
    setFilteredTodos(filteredTodos.map(t => t.id === id ? updatedTodo : t));

    axios.patch("http://127.0.0.1:8000/todos/" + id, updatedTodo)
      .catch(err => {
        setErrors(err.message);
        setTodos(todos);
        setFilteredTodos(filteredTodos);
      });
  };

  const filterTodo = (status) => {
    if (status === 'All') {
      setFilteredTodos(todos);
    } else if (status === 'Active') {
      setFilteredTodos(todos.filter(todo => !todo.completed));
    } else if (status === 'Completed') {
      setFilteredTodos(todos.filter(todo => todo.completed));
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    setFilteredTodos(filteredTodos.filter(todo => todo.id !== id));
    axios.delete("http://127.0.0.1:8000/todos/" + id)
      .catch(err => setErrors(err.message));
  };

  return (
    <div className="todo-container">
      {errors && <p>{errors}</p>}
      <TodoSearch add_todo={addTodo} />
      <TodoFilter filter_todo={filterTodo} />
      <TodoList todos={filteredTodos} delete_todo={deleteTodo} updated_todo={updateTodo} complete_todo={completeTodo} />
    </div>
  );
}

export default App;