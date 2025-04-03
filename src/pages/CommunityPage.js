'use client';

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api'; // ✅ axios 인스턴스 사용
import '../styles/Community.css';
import axios from 'axios';

function CommunityPage() {
  const [activeTab, setActiveTab] = useState('전체'); // 초기값 '전체'로 통일!
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  // ✅ 로그인 유저 검증
  useEffect(() => {
    if (!userId) {
      setTimeout(() => navigate('/login'), 0);
    }
  }, [navigate, userId]);

  // ✅ 전체 게시글 최초 로드
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8080/api/posts');

        console.log('전체 게시글 응답:', response);
        const rawPosts = response.data;

        const data = rawPosts.map((post) => ({
          id: post.postId,
          title: post.title,
          content: post.content,
          author: post.writer || '알 수 없음',
          date: post.createdAt ? post.createdAt.substring(0, 10) : '날짜 없음',
          comments: post.commentCount || 0,
          views: post.viewCount || 0,
          category: post.category || '자유게시판',
          tags: post.tags || [],
        }));

        setPosts(data);
        filterPosts('전체', searchTerm, data); // ✅ 전체 초기 필터링
      } catch (error) {
        console.error('게시글 데이터 가져오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // ✅ 여기!! posts가 바뀔 때마다 category 목록을 확인하기!
  useEffect(() => {
    console.log('✅ 전체 posts:', posts);

    const categories = posts.map((post) => post.category);
    console.log('📂 posts 안의 category 목록:', categories);
  }, [posts]);

  // ✅ 탭 클릭 시 클라이언트 필터링만 실행
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    filterPosts(tab, searchTerm);
  };

  // ✅ 검색어 입력 시 필터링 실행
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterPosts(activeTab, value);
  };

  // ✅ 카테고리 + 검색어 필터링
  const filterPosts = (category, search, data = posts) => {
    let filtered = [...data];

    if (category !== '전체') {
      const target = category.replace(/\s+/g, '').toLowerCase();

      filtered = filtered.filter((post) => {
        const postCategory = post.category.replace(/\s+/g, '').toLowerCase();
        return postCategory === target;
      });
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          (post.tags &&
            post.tags.some((tag) => tag.toLowerCase().includes(searchLower)))
      );
    }

    setFilteredPosts(filtered);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">커뮤니티</h1>
        <Link to="/community/write" className="btn btn-primary">
          글쓰기
        </Link>
      </div>

      {/* ✅ 탭 메뉴 */}
      <div className="tabs">
        <div className="tabs-list">
          {['전체', '소모임', '펫시터', '댕댕이 찾기', '자유게시판'].map(
            (tab) => (
              <div
                key={tab}
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </div>
            )
          )}
        </div>

        {/* ✅ 검색창 */}
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder={`${
              activeTab === '전체' ? '전체' : activeTab
            } 게시글 검색`}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {/* ✅ 게시글 리스트 */}
      {isLoading ? (
        <div className="loading">로딩 중...</div>
      ) : filteredPosts.length > 0 ? (
        <div className="post-list">
          {filteredPosts.map((post) => (
            <Link
              to={`/community/post/${post.id}`}
              key={post.id}
              className="post-list-item"
            >
              <div className="post-header">
                <h2 className="post-title">{post.title}</h2>
                <span className="badge badge-primary">{post.category}</span>
              </div>

              <p className="post-content-preview">{post.content}</p>

              <div className="post-meta">
                <span className="author">{post.author}</span>
                <span className="date">{post.date}</span>
                <div className="tags">
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="post-stats">
                  <span>조회 {post.views}</span>
                  <span>댓글 {post.comments}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}

export default CommunityPage;
