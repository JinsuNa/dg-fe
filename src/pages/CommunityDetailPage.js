import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../styles/Community.css';
import CommentSection from '../pages/CommentSection';

function CommunityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  const currentUser = {
    id: Number(localStorage.getItem('userId')),
    nickname: localStorage.getItem('nickname'),
  };

  console.log('✅ 현재 로그인한 유저:', currentUser);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${id}`);
        console.log('👉 post 데이터:', response.data); // ✅ 여기에 writer, createdAt 잘 오는지 확인!
        setPost(response.data);
      } catch (error) {
        console.error('게시글을 불러오는 데 실패했습니다.', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmDelete) return;

    const userId = localStorage.getItem('userId'); // ✅ 또는 currentUser.id 사용
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await api.delete(`/posts/${id}`, {
        params: {
          userId: userId, // ✅ userId 추가
        },
      });
      alert('게시글이 삭제되었습니다.');
      navigate('/community');
    } catch (error) {
      console.error('삭제 실패:', error);
      if (error.response && error.response.status === 403) {
        alert('삭제 권한이 없습니다.');
      } else {
        alert('작성자만 삭제 할 수 있습니다.');
      }
    }
  };

  if (!post) return <div>로딩 중...</div>;

  return (
    <div className="post-detail-page">
      <div className="post-detail-header">
        <img
          src="/favicon.svg"
          alt="발바닥 아이콘"
          className="post-detail-icon"
        />
        <h2 className="post-detail-title">{post.title}</h2>
      </div>

      <div className="post-detail-box">
        {/* 카테고리 + 작성자 / 작성일 */}
        <div className="post-header-row">
          <div className="post-category">
            {post.category || '카테고리 없음'}
          </div>

          <div className="post-author-date">
            <span>작성자: {post.writer || '알 수 없음'}</span>
            <span>
              작성일:{' '}
              {post.createdAt
                ? new Date(post.createdAt).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })
                : '날짜 없음'}
            </span>
          </div>
        </div>

        {/* 본문 */}
        <div className="post-content">{post.content}</div>

        {/* 조회수 / 댓글 */}
        <div className="post-footer-row">
          <span>조회수: {post.viewCount || 0}</span>
          <span>댓글: {post.commentCount || 0}</span>
        </div>
      </div>

      {/* ✅ 댓글 섹션 - currentUser를 props로 넘김 */}
      <CommentSection postId={Number(id)} currentUser={currentUser} />

      {/* 버튼을 post-detail-box 아래에 배치 */}
      <div className="post-detail-buttons">
        <button
          onClick={() => navigate('/community')}
          className="btn btn-outline"
        >
          목록으로
        </button>
        <button onClick={handleDelete} className="btn btn-delete">
          삭제
        </button>
      </div>
    </div>
  );
}

export default CommunityDetailPage;
