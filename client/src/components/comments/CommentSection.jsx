import { useEffect, useState } from 'react';
import { apiFetch } from '../../api';
import CommentItem from './CommentItem';
import './Comment.css';

function CommentSection({ postId, user }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/posts/${postId}/comments`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (err) {
      console.error('댓글 불러오기 에러:', err);
      setMsg('댓글을 불러오는 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await apiFetch(`/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ comment: newComment }),
      });

      const data = await res.json();
      setMsg(data.msg || '');

      if (res.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (err) {
      console.error('댓글 작성 에러:', err);
      setMsg('댓글 작성 중 오류 발생');
    } finally {
      setTimeout(() => setMsg(''), 2000);
    }
  };

   return (
    <section className="comment-section">
      <h3>댓글</h3>

      {msg && <div className="popup">{msg}</div>}

      {user ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <input
            className="comment-input"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
          />
          <button type="submit" className="comment-btn">
            댓글 작성
          </button>
        </form>
      ) : (
        <p>댓글을 작성하려면 로그인하세요.</p>
      )}

      {loading && <div>댓글 불러오는 중...</div>}

      {!loading && comments.length === 0 && (
        <div>아직 댓글이 없습니다.</div>
      )}

      {!loading && comments.length > 0 && (
        <div className="comment-list">
          {comments.map((c) => (
            <CommentItem
              key={c._id}
              comment={c}
              user={user}
              postId={postId}
              onChanged={fetchComments}
            />
          ))}
        </div>
      )}
    </section>
  );
}


export default CommentSection;
