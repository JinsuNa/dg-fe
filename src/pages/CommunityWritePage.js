'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Community.css';
import axios from 'axios';

function CommunityWritePage({ isAuthenticated }) {
  const navigate = useNavigate();

  // 상태 관리 (태그 필드 삭제!)
  const [formData, setFormData] = useState({
    category: '자유게시판',
    title: '',
    content: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 인증 상태 확인
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/community/write' } });
    }
  }, [isAuthenticated, navigate]);

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/posts?userId=${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert('게시글 등록 성공!');
        navigate('/community');
      } else {
        throw new Error('게시글 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 등록 실패:', error);
      alert('게시글 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="write-page">
      <div className="writeImage">
        <img src="/favicon.png" alt="" />
        <h1 className="write-title">글쓰기</h1>
      </div>

      <p className="write-subtitle">커뮤니티에 새 글을 작성합니다</p>

      <form onSubmit={handleSubmit} className="write-form">
        {/* 카테고리 선택 */}
        <div className="form-group">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-select"
            disabled={isSubmitting}
          >
            <option value="자유게시판">자유게시판</option>
            <option value="소모임">소모임</option>
            <option value="펫시터">펫시터</option>
            <option value="댕댕이 찾기">댕댕이 찾기</option>
          </select>
        </div>

        {/* 제목 입력 */}
        <div className="form-group">
          <input
            type="text"
            name="title"
            placeholder="제목을 입력하세요"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            disabled={isSubmitting}
            required
          />
        </div>

        {/* 내용 입력 */}
        <div className="form-group">
          <textarea
            name="content"
            placeholder="내용을 입력하세요"
            value={formData.content}
            onChange={handleChange}
            className="form-textarea"
            disabled={isSubmitting}
            required
          />
        </div>

        {/* 버튼 */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            취소
          </button>
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CommunityWritePage;
