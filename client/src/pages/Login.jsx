import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css';
import { apiFetch } from '../api';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {

  const [username, setUsername] = useState('');
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {    // 로그인 버튼을 눌렀을 때 실행되는 함수
  e.preventDefault();

  try {
    // 서버에 로그인 요청 보내기
    const res = await apiFetch('/Login', {     
      method: 'POST',
      body: JSON.stringify({ username, password: pw }),
    });

    // 서버에서 온 응답json 읽기
    const data = await res.json();       
    setMsg(data.msg);                      

    // 실패처리
    if (!res.ok) {                         
      setTimeout(() => setMsg(''), 2000);
      return;
    }

    // 성공처리
    setUsername('');                  
    setPw('');
    setUser(data.user);

    setTimeout(() => {
      setMsg('');
      navigate('/');
    }, 2000);

  } catch (err) {
    console.error(err);
    setMsg('요청 중 에러남');
    setTimeout(() => setMsg(''), 2000);
  }
};


  return (
     <div style={{ padding: '40px', textAlign: 'center' }}>
      <div className="signup-container">
        <form className="signup-box" onSubmit={handleSubmit}>     {/* 폼 제출 될 때 실행될 함수 연결 */}
          <h2>로그인</h2>
          
          <input
            type="username"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />

          <button type="submit">로그인</button>
        </form>
      </div>
       {msg && <div className="popup">{msg}</div>}
    </div>
  );
}

export default Login;