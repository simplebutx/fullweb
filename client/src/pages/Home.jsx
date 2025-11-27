import { Link } from 'react-router-dom';
import "../components/Button.css"
import PostList from './PostList';

function Home({message}) {
  return (
    <div className="home">
      <div className="home-header">
        <h2 className="home-title">게시글 목록</h2>

        <span className="server-status">
          {message}
        </span>
      </div>

      <PostList />
    </div>
  );
}

export default Home;
