import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Navbar from './components/Navbar.jsx';
import MyPage from './pages/MyPage.jsx';
import CreatePost from './pages/CreatePost.jsx';
import PostList from './pages/PostList.jsx'
import { apiFetch } from './api.jsx';
import PostDetail from './pages/PostDetail.jsx';
import PostEdit from './pages/PostEdit.jsx';
import './App.css'

function App() {
  const [message, setMessage] = useState('서버에서 아직 데이터 안 옴');
  const [msg, setMsg] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 서버 연결 테스트용
  useEffect(() => {
    apiFetch('/api/hello')
      .then((res) => res.json())
      .then((data) => setMessage(data.msg))
      .catch((err) => {
        console.error(err);
        setMessage('에러 발생 😢');
      });
  }, []);

  // 로그인 여부 체크
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await apiFetch('/me', { method: 'GET' });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data.user);

        
      } catch (err) {
        console.error(err);
        setUser(null);
      }
    };

    checkLogin();
  }, []);

  // 로그아웃
  const handleLogout = async () => {
  try {
    const res = await apiFetch('/logout', { method: 'POST' });
    const data = await res.json();
    setMsg(data.msg || '로그아웃 되었습니다.');
    setUser(null);
    setTimeout(() => {
      setMsg('');
      navigate('/');
    }, 2000);
  } catch (err) {
    console.error(err);
    setMsg('로그아웃 중 오류가 발생했습니다.');
    setTimeout(() => setMsg(''), 2000);
  }
};


  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home message={message} />} />
        <Route path="/Login" element={<Login setUser={setUser} />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/me" element={<MyPage user={user} />} />
        <Route path='/CreatePost' element={<CreatePost />} />
        <Route path='/PostList' element={<PostList />} />
        <Route path='/posts/:id' element={<PostDetail user={user}/>} />
        <Route path='/posts/:id/edit' element={<PostEdit user={user}/>} />
      </Routes>

      {msg && (<div className="popup">{msg}</div>)}
    </>
  );
}

export default App;
