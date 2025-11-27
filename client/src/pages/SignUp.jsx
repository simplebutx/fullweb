import React, { useState } from 'react';
import './SignUp.css';
import { apiFetch } from '../api';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => { 
    e.preventDefault();

    try {
      const res = await apiFetch('/SignUp', {
        method: 'POST',
        body: JSON.stringify({
          username,
          password: pw,
          name,
          email,
        })
      });

      const data = await res.json();
      setMsg(data.msg);

      if (!res.ok) {
        setTimeout(() => setMsg(''), 2000);
        return;
      }

      setName('');
      setEmail('');
      setUsername('');
      setPw('');
      setPwCheck('');

      setTimeout(() => setMsg(''), 2000);

    } catch (err) {
      console.error(err);
      setMsg('요청 중 에러남');
      setTimeout(() => setMsg(''), 2000);
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <div className="signup-container">
        <form className="signup-box" onSubmit={handleSubmit}>
          <h2>회원가입</h2>

          <input type="text" placeholder="이름" value={name}
                 onChange={(e) => setName(e.target.value)} />

          <input type="email" placeholder="이메일" value={email}
                 onChange={(e) => setEmail(e.target.value)} />

          <input type="username" placeholder="아이디" value={username}
                 onChange={(e) => setUsername(e.target.value)} />

          <input type="password" placeholder="비밀번호" value={pw}
                 onChange={(e) => setPw(e.target.value)} />

          <input type="password" placeholder="비밀번호 확인" value={pwCheck}
                 onChange={(e) => setPwCheck(e.target.value)} />

          <button type="submit">회원가입</button>
        </form>
      </div>

      {msg && <div className="popup">{msg}</div>}
    </div>
  );
}

export default SignUp;
