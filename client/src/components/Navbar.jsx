import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, onLogout }) {

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">MyProject</Link>
      </div>

      <div className="nav-right">
        {user && (
          <>
            <span className="nav-username">
              {user.username} 님
            </span>

            <Link to="/me">
              <button className="nav-btn">마이페이지</button>
            </Link>
            <Link to="/CreatePost">
              <button className="nav-btn">글쓰기</button>
            </Link>
            

            <button className="nav-btn" onClick={onLogout}>
              로그아웃
            </button>
          </>
        )}

        {!user && (
          <>
            <Link to="/login">
              <button className="nav-btn">로그인</button>
            </Link>
            <Link to="/signup">
              <button className="nav-btn">회원가입</button>
            </Link>
          </>
        )}
      </div>

    </nav>
  );
}

export default Navbar;
