"use client";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import { useEffect, useState } from "react";
import axios from "axios";

function HomePage() {

  const [topDogs, setTopDogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopDogs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/match/top-liked"
        );
        setTopDogs(response.data);
      } catch (error) {
        console.log("데이터 전송 실패 : ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopDogs();
  }, []);

  return (
    <div className="home-page">
      {/* 히어로 섹션 */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">댕근과 함께하는 즐거운 산책</h1>
            <p className="hero-description">
              내 강아지에게 딱 맞는 산책 친구를 찾아보세요. 함께하는 산책은 더
              즐겁습니다!
            </p>
            <div className="hero-buttons">
              <Link to="/find-friend" className="btn btn-primary btn-lg">
                댕근찾기
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 인기 강아지 섹션 */}
      <section className="top-dogs-section">
        <div className="container">
          <h2 className="section-title">이달의 인기 댕댕이</h2>
          <p className="section-description">
            댕근 회원들이 가장 많이 찾는 인기 강아지를 소개합니다
          </p>

          <div className="top-dogs-container">
            <div className="top-dogs-row">
              {/* 2등 강아지 */}
              <div className="dog-card">
                <div className="dog-image-container">
                  <div className="dog-rank">🥈 2등</div>
                  <img
                    src={topDogs[1]?.image}
                    alt={topDogs[1]?.userName}
                    className="dog-image second"
                  />
                </div>
                <h3 className="dog-name">{topDogs[1]?.userName}</h3>
                <p className="dog-info">{topDogs[1]?.petBreed} , {topDogs[1]?.petAge}살</p>

              </div>

              {/* 1등 강아지 */}
              <div className="dog-card">
                <div className="dog-image-container">
                  <div className="dog-rank">🥇 1등</div>
                  <img
                    src={topDogs[0]?.image}
                    alt={topDogs[0]?.userName}
                    className="dog-image first"
                  />
                </div>
                <h3 className="dog-name">{topDogs[0]?.userName}</h3>
                <p className="dog-info">{topDogs[0]?.petBreed} , {topDogs[0]?.petAge}살</p>
                
              </div>

              {/* 3등 강아지 */}
              <div className="dog-card">
                <div className="dog-image-container">
                  <div className="dog-rank">🥉 3등</div>
                  <img
                    src={topDogs[2]?.image}
                    alt={topDogs[2]?.userName}
                    className="dog-image third"
                  />
                </div>
                <h3 className="dog-name">{topDogs[2]?.userName}</h3>
                <p className="dog-info">{topDogs[2]?.petBreed} , {topDogs[2]?.petAge}살</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 소개 섹션 */}
      <section className="intro-section">
        <div className="container">
          <h2 className="section-title">댕근 소개</h2>
          <div className="intro-text">
            <p className="section-description">
              댕근은 강아지 산책 친구를 찾고 소통할 수 있는 커뮤니티입니다. 내
              강아지와 잘 맞는 친구를 찾아 함께 산책하고, 다양한 정보를
              공유해보세요.
            </p>
            <p className="section-description">
              산책 친구 매칭, 채팅, 일정 관리, 커뮤니티 등 다양한 기능을
              제공합니다. 댕근과 함께 더 즐거운 반려생활을 시작해보세요!
            </p>
          </div>

          <div className="features-grid">
            <Link to="/find-friend" className="feature-card">
              <div className="feature-icon-container">
                <span className="feature-icon">🦴</span>
              </div>
              <h3 className="feature-title">댕근 찾기</h3>
              <p className="feature-description">
                산책 일정과 할 일을 관리하고, 약속을 잡아보세요.
              </p>
            </Link>

            <Link to="/exhibition" className="feature-card">
              <div className="feature-icon-container">
                <span className="feature-icon">🎪</span>
              </div>
              <h3 className="feature-title">박람회 정보</h3>
              <p className="feature-description">
                현재 진행 중인 박람회와 예정된 박람회 정보를 확인하세요.
              </p>
            </Link>

            <Link to="/community" className="feature-card">
              <div className="feature-icon-container">
                <span className="feature-icon">💬</span>
              </div>
              <h3 className="feature-title">커뮤니티</h3>
              <p className="feature-description">
                다양한 주제로 다른 견주들과 정보를 공유하고 소통하세요.
              </p>
            </Link>

            <Link to="/market" className="feature-card">
              <div className="feature-icon-container">
                <span className="feature-icon">🛒</span>
              </div>
              <h3 className="feature-title">댕근마켓</h3>
              <p className="feature-description">
                필요 없는 반려용품을 판매하거나 필요한 물품을 구매하세요.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
