import { Link } from "react-router-dom"
import "../styles/Footer.css"

function Footer() {
  // 현재 연도 가져오기
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* 푸터 상단 섹션 */}
        <div className="footer-top">
          {/* 로고 및 설명 */}
          <div className="footer-info">
            <Link to="/" className="footer-logo">
              댕근
            </Link>
            <p className="footer-description">강아지 산책 친구를 찾고 소통할 수 있는 커뮤니티</p>
          </div>

          {/* 링크 섹션 */}
          <div className="footer-links">
            <Link to="/about" className="footer-link">
              서비스 소개
            </Link>
            <Link to="/terms" className="footer-link">
              이용약관
            </Link>
            <Link to="/privacy" className="footer-link">
              개인정보처리방침
            </Link>
          </div>
        </div>

        {/* 푸터 하단 섹션 - 저작권 정보 */}
        <div className="footer-bottom">
          <p className="copyright">© {currentYear} 댕근. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

