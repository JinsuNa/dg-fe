import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FindFriendPage from './pages/FindFriendPage';
import CommunityPage from './pages/CommunityPage';
import CommunityWritePage from './pages/CommunityWritePage';
import CommunityDetailPage from './pages/CommunityDetailPage'; //
import MarketPage from './pages/MarketPage';
import MarketItemPage from './pages/MarketItemPage';
import MarketWritePage from './pages/MarketWritePage';
import ChatPage from './pages/ChatPage';
import ExhibitionPage from './pages/ExhibitionPage';
import MyPage from './pages/MyPage';

import './styles/App.css';
import EditMarketItemPage from './pages/EditProductPage';

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('nickname');
    if (storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('nickname', userData.nickname);
    setIsAuthenticated(true);
    setUser(userData.nickname);
  };

  const onLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('nickname');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="app">
      <Navbar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={onLogout}
      />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route
            path="/register"
            element={<RegisterPage onLogin={handleLogin} />}
          />
          <Route
            path="/find-friend"
            element={<FindFriendPage isAuthenticated={isAuthenticated} />}
          />
          {/* 커뮤니티 페이지들 */}
          <Route path="/community" element={<CommunityPage />} />
          <Route
            path="/community/write"
            element={<CommunityWritePage isAuthenticated={isAuthenticated} />}
          />
          <Route path="/community/post/:id" element={<CommunityDetailPage />} />{' '}
          {/* ✅ 상세페이지 추가 */}
          {/* 마켓 */}
          <Route
            path="/market/write"
            element={<MarketWritePage isAuthenticated={isAuthenticated} />}
          />
          <Route path="/market/edit/:id" element={<EditMarketItemPage />} />
          <Route path="/market/:id" element={<MarketItemPage />} />
          <Route path="/market" element={<MarketPage />} />
          {/* 채팅/캘린더/전시 */}
          <Route
            path="/chat"
            element={<ChatPage isAuthenticated={isAuthenticated} />}
          />
          <Route path="/exhibition" element={<ExhibitionPage />} />
          {/* 마이페이지 */}
          <Route
            path="/mypage"
            element={<MyPage isAuthenticated={isAuthenticated} user={user} />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;