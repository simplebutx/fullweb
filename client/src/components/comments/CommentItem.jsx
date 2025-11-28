import { useState } from 'react';
import './Comment.css';
import { apiFetch } from '../../api';


function CommentItem({ comment, user, postId, onChanged }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.comment);
  const [localMsg, setLocalMsg] = useState('');

  const userId = user && (user._id || user.id);
  const authorId = comment && comment.authorId;
  const isAuthor =
    !!userId && !!authorId && String(userId) === String(authorId);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editText.trim()) return;

    try {
      const res = await apiFetch(
        `/posts/${postId}/comments/${comment._id}`,
        {
          method: 'PUT',
          body: JSON.stringify({ comment: editText }),
        }
      );

      const data = await res.json();
      setLocalMsg(data.msg || '');

      if (res.ok) {
        setIsEditing(false);
        onChanged && onChanged(); // 부모에서 목록 다시 불러오기
      }
    } catch (err) {
      console.error('댓글 수정 에러:', err);
      setLocalMsg('댓글 수정 중 오류');
    } finally {
      setTimeout(() => setLocalMsg(''), 2000);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm('댓글을 삭제할까요?');
    if (!ok) return;

    try {
      const res = await apiFetch(
        `/posts/${postId}/comments/${comment._id}`,
        {
          method: 'DELETE',
        }
      );

      const data = await res.json();
      setLocalMsg(data.msg || '');

      if (res.ok) {
        onChanged && onChanged();
      }
    } catch (err) {
      console.error('댓글 삭제 에러:', err);
      setLocalMsg('댓글 삭제 중 오류');
    } finally {
      setTimeout(() => setLocalMsg(''), 2000);
    }
  };

return (
    <div className="comment-card">
      {localMsg && <div className="popup">{localMsg}</div>}

      <div className="comment-author">
        {comment.authorName || '알 수 없음'}
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <textarea
            className="comment-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
            <button type="submit" className="comment-btn">
              완료
            </button>
            <button
              type="button"
              className="comment-btn"
              style={{ backgroundColor: '#64748b' }}
              onClick={() => {
                setIsEditing(false);
                setEditText(comment.comment);
              }}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="comment-content">{comment.comment}</p>
          <div
            style={{
              marginTop: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span className="comment-time">
              {new Date(comment.createdAt).toLocaleString()}
            </span>

            {isAuthor && (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className="comment-btn"
                  onClick={() => setIsEditing(true)}
                >
                  수정
                </button>
                <button
                  className="comment-btn"
                  style={{ backgroundColor: '#b91c1c' }}
                  onClick={handleDelete}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default CommentItem;

