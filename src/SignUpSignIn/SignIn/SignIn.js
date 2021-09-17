import { useState } from 'react';
import { BASE_URL } from '../../BASE_URL/baseUrl';

const SignIn = () => {
  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      const x = await fetch(BASE_URL + '/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const xj = await x.json();
      alert('sign');
    } catch (err) {
      console.log(err);
      alert('errr');
    }
  };

  return (
    <div>
      <h4>ورود</h4>

      <form onSubmit={loginHandler}>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>ثبت</button>
      </form>
    </div>
  );
};

export default SignIn;
