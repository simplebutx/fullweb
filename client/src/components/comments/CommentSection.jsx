import { useEffect, useState } from 'react';
import { apiFetch } from '../../api';
import CommentItem from './CommentItem';
import './Comment.css';

function CommentSection({ postId, user }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [msg, setMsg] = useState('');

  const loadComments = async () => {
    try {
      const res = await apiFetch(`/posts/${postId}/comments`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (err) {
      console.error('댓글 불러오기 에러:', err);
    }
  };

  useEffect(() => {
    if (postId) loadComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const res = await apiFetch(`/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ comment }),
      });

      const data = await res.json();
      setMsg(data.msg);

      if (res.ok) {
        setComment('');
        loadComments();
      }
    } catch (err) {
      console.error(err);
      setMsg('댓글 작성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="comment-section">
      {msg && <div className="comment-msg">{msg}</div>}

      <form onSubmit={handleSubmit} className="comment-form">
        <input
          className="comment-input"
          placeholder="댓글을 입력하세요"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="comment-btn">작성</button>
      </form>

      <div className="comment-list">
        {comments.map((c) => (
          <CommentItem key={c._id} comment={c} currentUser={user} />
        ))}
      </div>
    </div>
  );
}

export default CommentSection;
