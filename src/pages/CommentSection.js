import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function CommentSection({ postId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  console.log('🟢 전체 댓글:', comments);
  console.log('🟢 로그인 유저:', currentUser);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/post/${postId}`);
      console.log('📌 댓글 목록:', response.data);
      setComments(response.data);
    } catch (error) {
      console.error('댓글 목록 불러오기 실패', error);
    }
  };

  // 댓글 작성
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert('댓글을 입력하세요.');
      return;
    }

    try {
      await api.post(`/comments/post/${postId}?userId=${currentUser.id}`, {
        content: newComment,
      });

      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  // ✅ 댓글 삭제 (userId 같이 넘기기)
  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm('댓글을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/comments/${commentId}`, {
        params: { userId: currentUser.id }, // 🔑 현재 로그인한 userId 넘기기
      });

      alert('댓글이 삭제되었습니다.');
      fetchComments();
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      if (error.response && error.response.status === 403) {
        alert('삭제 권한이 없습니다.');
      } else {
        alert('댓글 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div className="comment-section">
      <h3>댓글</h3>

      {/* 댓글 작성 폼 */}
      <div className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <button onClick={handleAddComment} className="btn btn-outline">
          등록
        </button>
      </div>

      {/* 댓글 리스트 */}
      <ul className="comment-list">
        {comments.map((comment) => {
          console.log('✅ 댓글 작성자:', comment.userId);
          console.log('✅ 현재 로그인한 유저:', currentUser.id);

          return (
            <li key={comment.commentId} className="comment-item">
              <div>
                <strong>{comment.username}</strong> {/* 닉네임 */}
              </div>
              <div>{comment.content}</div>
              <div className="comment-meta">
                <span>{new Date(comment.createdAt).toLocaleString()}</span>

                {/* ✅ 내가 작성한 댓글일 경우에만 삭제 버튼 보여주기 */}
                {comment.userId === currentUser.id && (
                  <button
                    onClick={() => handleDeleteComment(comment.commentId)}
                    className="btn btn-delete"
                  >
                    삭제
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CommentSection;
