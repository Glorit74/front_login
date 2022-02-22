import { useState, useEffect } from 'react';
import http from 'axios';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [todoUserName, setTodoUserName] = useState('');
  const [todoPassword, setTodoPassword] = useState('');
  const [todo, setTodo] = useState('');
  const [page, setPage] = useState('reg');

  const login = async () => {
    try {
      const response = await http.post(
        'http://localhost:4000/api/login',
        {},
        {
          headers: {
            Authorization: `${todoUserName}&&&${todoPassword}`,
          },
        }
      );
      localStorage.setItem('sessionID', response.data);
      setPage('todo');
    } catch (error) {
      alert('wrong username/password');
    }
  };
  const createToDo = async () => {
    try {
      const response = await http.post(
        'http://localhost:4000/api/todo',
        { msg: todo },
        {
          headers: {
            Authorization: localStorage.getItem('sessionID'),
          },
        }
      );
      setTodo('');
      alert('todo created');
    } catch (error) {
      if (error.response.status === 401) {
        alert('Your session has expired');
        setPage('login');
        localStorage.removeItem('sessionID');
      }
    }
  };

  const signup = async () => {
    try {
      const response = await http.post('http://localhost:4000/api/signup', {
        username,
        password,
      });
      alert('yay');
      setUsername('');
      setPassword('');
      setPage('login');
    } catch (error) {
      if (error.response.status === 400) {
        alert('missing credentials');
      } else if (error.response.status === 409) {
        alert('username taken');
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem('sessionID')) {
      setPage('todo');
    }
  }, []);

  return (
    <div className='card'>
      {page === 'reg' && (
        <div className='registration'>
          <h2>Registration</h2>
          <label for='username'>Username: </label>
          <input
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            id='username'
          />
          <label for='password'>Password: </label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id='password'
          />

          <button onClick={() => signup()}>Sign up!</button>
          <button onClick={() => setPage('login')}>
            I already have an account!
          </button>
        </div>
      )}
      {page === 'todo' && (
        <div className='user'>
          <h2>To-do's</h2>
          <input
            type='text'
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            placeholder='Todo'
          />
          <button onClick={(e) => createToDo()} disabled={!todo}>
            Create todo
          </button>
          <button
            onClick={(e) => {
              setPage('login');
              setTodoUserName('');
              setTodoPassword('');
              localStorage.clear();
            }}
          >
            Log out
          </button>
        </div>
      )}
      {page === 'login' && (
        <div className='user'>
          <h2>Login</h2>
          <label for='username'>Username</label>
          <input
            type='text'
            value={todoUserName}
            onChange={(e) => setTodoUserName(e.target.value)}
            id='username'
          />
          <label for='password'>Password</label>
          <input
            type='password'
            name={todoPassword}
            onChange={(e) => setTodoPassword(e.target.value)}
            id='password'
          />
          <button onClick={() => login()}>Login</button>
          <button onClick={() => setPage('reg')}>Back to registration!</button>
        </div>
      )}
    </div>
  );
}

export default App;
