import './Comment.css';

function CommentItem({ comment, currentUser }) {
  const isOwner =
    currentUser && (currentUser._id === comment.authorId || currentUser.id === comment.authorId);

  return (
    <div className="comment-card">
      <div className="comment-author">ID: {comment.authorName}</div>
      <div className="comment-content">{comment.comment}</div>
      <div className="comment-time">
        {new Date(comment.createdAt).toLocaleString('ko-KR', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>

      {/* 나중에 수정/삭제 버튼 달 때 여기 쓰면 됨 */}
      {/* {isOwner && (
        <div className="comment-actions">
          <button>수정</button>
          <button>삭제</button>
        </div>
      )} */}
    </div>
  );
}

export default CommentItem;
