import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../api';

function PostEdit() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [msg, setMsg] = useState('');
  const [image, setImage] = useState(null);            // 새로 선택한 이미지
  const [currentImageUrl, setCurrentImageUrl] = useState(''); // 기존 이미지

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await apiFetch(`/posts/${id}`);
      const data = await res.json();

      if (!res.ok) {
        setMsg(data.msg || "글을 불러오지 못했습니다.");
        return;
      }

      setTitle(data.title);
      setContent(data.content);
      setCurrentImageUrl(data.imageUrl || '');
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // FormData로 전송
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    // 새 이미지 선택한 경우에만 추가
    if (image) {
      formData.append('image', image);
    }

    const res = await apiFetch(`/posts/${id}`, {
      method: "PUT",
      body: formData,               //  Content-Type 헤더 직접 넣지 말기
    });

    const data = await res.json();
    setMsg(data.msg);

    if (res.ok) {
      setTimeout(() => {
        navigate(`/posts/${id}`);
      }, 1500);
    } else {
      setTimeout(() => setMsg(""), 2000);
    }
  };

  return(
    <div className="post-page">
      <div className="post-card">
        <h2 className="post-title">글 수정</h2>

        <form onSubmit={handleSubmit} className="post-form">
          <label className="post-label">
            제목
            <input
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="post-input"
            />
          </label>

          <label className="post-label">
            내용
            <textarea
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="post-textarea"
              rows={5}
            />
          </label>

          {/* 기존 이미지 미리보기 */}
          {currentImageUrl && (
            <div className="post-label" style={{ marginTop: '12px' }}>
              <span>현재 이미지</span>
              <img
                src={currentImageUrl}
                alt="현재 이미지"
                className="post-detail-image"
              />
            </div>
          )}

          {/* 새 이미지 선택 */}
          <label className="post-label" style={{ marginTop: '12px' }}>
            이미지 변경 (선택 안 하면 기존 이미지 유지)
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="post-input"
            />
          </label>

          <button type="submit" className="post-button">
            수정하기
          </button>
        </form>
      </div>
      {msg && <div className="popup">{msg}</div>}
    </div>
  );
}

export default PostEdit;
