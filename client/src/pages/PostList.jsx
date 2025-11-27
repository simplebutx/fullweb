import { useEffect } from "react";
import { useState } from "react";
import { apiFetch } from "../api";
import './PostList.css'
import { useNavigate } from 'react-router-dom';


function PostList() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = async () => {
      const res = await apiFetch('/posts');
      const data = await res.json();
      setPosts(data.posts);
    };

    loadPosts();
  }, []);

    return (
    <div className="post-list">
      {posts.map((post) => (
        <article  onClick={() => navigate(`/posts/${post._id}`)} className="post-card" key={post._id} style={{ cursor: 'pointer' }}>
          <h3 className="post-card-title">{post.title}</h3>
          <p className="post-card-content">{post.content}</p>
          <div className="post-card-meta">
            <span>
              작성날짜 : {new Date(post.createdAt).toLocaleString()}
            </span>
            <span>작성자 : {post.authorName}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

export default PostList;