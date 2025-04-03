"use client"

/**
 * 박람회 페이지 컴포넌트
 *
 * 이 컴포넌트는 현재 진행 중인 박람회와 예정된 박람회 정보를 제공합니다.
 * 사용자는 박람회 정보를 확인하고 상세 정보를 볼 수 있습니다.
 *
 * @component
 * @requires React
 * @requires react-router-dom
 */

import { useState, useEffect } from "react"
import "../styles/exhibition.css"

function ExhibitionPage() {
  // 상태 관리
  const [exhibitions, setExhibitions] = useState([])
  const [activeTab, setActiveTab] = useState("current")
  const [isLoading, setIsLoading] = useState(true)

  // 박람회 데이터 로드 (실제로는 API에서 가져올 것)
  useEffect(() => {
    // 실제 구현 시에는 API 호출로 대체
    // 예시:
    /*
    const fetchExhibitions = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://3.37.145.80:8080/api/exhibitions');
        setExhibitions(response.data);
      } catch (error) {
        console.error('박람회 데이터 가져오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExhibitions();
    */

    // 임시 더미 데이터
    const dummyExhibitions = [
      {
        id: 1,
        title: "2024 서울펫쇼",
        description:
          "‘애완’이 아닌 ‘반려’하는 가족구성원을 위한 행사로 반려동물을 위하는 마음으로 함께 동반하여 참여하는 행사",
        startDate: "2025-3-10",
        endDate: "2025-4-21",
        location: "일산 킨텍스",
        image: "https://www.kintex.com/imageView.do?atchmnflNo=467931&fileseq=1",
        url: "https://www.kintex.com/web/ko/event/view.do?seq=2024037694",
        status: "current",
        tags: ["반려동물용품", "건강", "식품"],
      },
      {
        id: 2,
        title: "케이펫페어 세텍",
        description:
          "따스한 봄바람처럼 새로움이 가득한 순간, 봄나들이를 위한 완벽한 산책 아이템 총집합",
        startDate: "2025-3-16",
        endDate: "2025-4-3",
        location: "세텍 학여울역",
        url: "https://k-pet.co.kr/information/scheduled-list/2025_kpet_setec/",
        image: "https://d5bvmdkxgb6q.cloudfront.net/wp-content/uploads/2024/12/02113013/25%EC%BC%80%EC%9D%B4%ED%8E%AB%ED%8E%98%EC%96%B4-%EB%A9%94%EA%B0%80%EC%A3%BC-%ED%82%A4%EB%B9%84%EC%A3%BC%EC%96%BC_297X420mm_3.%EC%84%B8%ED%85%8D-1200x1697.jpg",
        status: "current",
        tags: ["건강검진", "영양", "운동"],
      },
      {
        id: 3,
        title: "2025 궁디팡팡 캣페스타 BUSAN 티켓(2차)",
        description: "반려동물 케어에 관한 모든 것을 다루는 엑스포입니다. 최신 케어 제품과 서비스를 만나보세요.",
        startDate: "2025-03-20",
        endDate: "2025-03-30",
        location: "서울 코엑스",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqz5Xe0YFHLfos0Xkqd5FnE3Xda1yx4kJWrg&s",
        url:"https://gdppcat.com/ticket/ticket_detail/36",
        status: "current",
        tags: ["그루밍", "미용", "케어"],
      },
      {
        id: 4,
        title: "대전펫 & 캣쇼",
        description:
          "반려동물의 행동 문제를 해결하기 위한 전문가들의 세미나입니다. 실용적인 팁과 교육 방법을 배워가세요.",
        startDate: "2025-05-09",
        endDate: "2025-05-11",
        location: "대전 컨벤션센터",
        image: "https://www.pet-show.co.kr/img_up/shop_pds/petshow/build/option/2025--po-seu-teo-05--dae-jeon10801731045751.jpg",
        url:"https://www.pet-show.co.kr/page/page139",
        status: "upcoming",
        tags: ["교육", "행동교정", "훈련"],
      },
    ]

    // 데이터 로드 시뮬레이션
    setTimeout(() => {
      setExhibitions(dummyExhibitions)
      setIsLoading(false)
    }, 500)
  }, [])

  // 탭 변경 핸들러
  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  // 현재 진행 중인 박람회 필터링
  const currentExhibitions = exhibitions.filter((exhibition) => exhibition.status === "current")

  // 예정된 박람회 필터링
  const upcomingExhibitions = exhibitions.filter((exhibition) => exhibition.status === "upcoming")

  // 박람회 카드 컴포넌트
  const ExhibitionCard = ({ exhibition }) => {
    return (
      <div className="exhibition-card">
        <div className="exhibition-image-container">
          <img src={exhibition.image || "/placeholder.svg"} alt={exhibition.title} className="exhibition-image" />
          <span className={`badge ${exhibition.status === "current" ? "badge-primary" : "badge-secondary"}`}>
            {exhibition.status === "current" ? "진행 중" : "예정"}
          </span>
        </div>
        <div className="exhibition-card-header">
          <h2 className="exhibition-card-title">{exhibition.title}</h2>
          <p className="exhibition-card-meta">
            {exhibition.startDate} ~ {exhibition.endDate}
          </p>
        </div>
        <div className="exhibition-card-content">
          <p className="exhibition-card-description">{exhibition.description}</p>
          <div className="exhibition-meta">
            <div className="exhibition-location">
              <span className="exhibition-location-icon">📍</span>
              <span>{exhibition.location}</span>
            </div>
          </div>
          <div className="tags">
            {exhibition.tags.map((tag, index) => (
              <span key={index} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <div className="exhibition-card-footer">
          <button className="btn btn-primary"><a href={exhibition.url}>자세히 보기</a> </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">반려동물 박람회 정보</h1>
      </div>
      <p className="page-description">
        현재 진행 중인 박람회와 곧 열릴 박람회 정보를 확인하고 참여해보세요. 다양한 반려동물 관련 제품과 서비스를 만나볼
        수 있습니다.
      </p>

      <div className="tabs">
        <div className="tabs-list">
          <div className={`tab ${activeTab === "current" ? "active" : ""}`} onClick={() => handleTabChange("current")}>
            진행 중인 박람회
          </div>
          <div
            className={`tab ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => handleTabChange("upcoming")}
          >
            예정된 박람회
          </div>
        </div>

        <div className={`tab-content ${activeTab === "current" ? "active" : ""}`}>
          {isLoading ? (
            <div className="loading">로딩 중...</div>
          ) : currentExhibitions.length > 0 ? (
            <div className="exhibition-card-grid">
              {currentExhibitions.map((exhibition) => (
                <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>현재 진행 중인 박람회가 없습니다.</p>
            </div>
          )}
        </div>

        <div className={`tab-content ${activeTab === "upcoming" ? "active" : ""}`}>
          {isLoading ? (
            <div className="loading">로딩 중...</div>
          ) : upcomingExhibitions.length > 0 ? (
            <div className="exhibition-card-grid">
              {upcomingExhibitions.map((exhibition) => (
                <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>예정된 박람회가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExhibitionPage

