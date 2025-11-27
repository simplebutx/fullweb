import { useState } from "react";
import { apiFetch } from "../api";
import { useEffect } from "react";
import './PostList.css'
import './MyPage.css'
import { useNavigate } from 'react-router-dom';

function MyPage({ user }) {

  const [myPosts, setMyPosts] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(()=>{
    if (!user) return;

    const fetchMyPost = async () => {
      const res = await apiFetch('/posts/mine');
      const data = await res.json();

      if (!res.ok || !Array.isArray(data.myPosts)) {
      setMyPosts([]);
      return;
        }
      
      setMsg(data.msg || '');
      setMyPosts(data.myPosts);
    };

    fetchMyPost();
  }, [user]);



  if (!user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>로그인이 필요합니다</h2>
      </div>
    );
  }



 return (
  <div className="mypage">

    <section className="mypage-info">
  <p className="mypage-info-text">가입일: {new Date(user.createdAt).toLocaleString()}</p>
    </section>
    

    <section className="mypage-posts">
      <div className="mypage-posts-header">
        <h3>내가 쓴 글</h3>
        <span className="mypage-posts-count">
          {myPosts.length}개
        </span>
      </div>

      {myPosts.length === 0 ? (
        <p className="mypage-empty">작성한 글이 아직 없습니다.</p>
      ) : (
        <div className="post-list">
          {myPosts.map((post) => (
            <article
              key={post._id}
              className="post-card"
              onClick={() => navigate(`/posts/${post._id}`)}
            >
              <h3 className="post-card-title">{post.title}</h3>
              <p className="post-card-content">{post.content}</p>

              <div className="post-card-meta">
                <span>
                  작성일 : {new Date(post.createdAt).toLocaleString()}
                </span>
                <span>작성자 : {post.authorName}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>



  </div>
);

}

export default MyPage;
