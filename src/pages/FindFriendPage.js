"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/find-friend.css";
import { createMatch, deleteMatch, fetchMatches, getRandomUsers } from "../utils/matchApi";
import chatAPI from "../utils/chatApi";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://3.37.145.80:8080/api/match";

const FindFriendPage = () => {
  const [currentProfiles, setCurrentProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMatchedDogs, setShowMatchedDogs] = useState(false);
  const [matchedDogs, setMatchedDogs] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const navigate = useNavigate();

  // 상태 관리 부분에 selectedDog 상태 추가
  const [selectedDog, setSelectedDog] = useState(null);
  const [showDogPopup, setShowDogPopup] = useState(false);


    // 랜덤 강아지 가져오기
    const fetchRandomUsers = async () => {
      try {
        setLoading(true);
        const response = await getRandomUsers();
        setCurrentProfiles(response.data);
      } catch (error) {
        console.error("랜덤 사용자 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

      // 매칭된 강아지 리스트 가져오기
  const fetchMatchedDogs = async () => {
    try {
      const response = await fetchMatches();
      setMatchedDogs(response);
    } catch (error) {
      console.error("매칭된 강아지 리스트 가져오기 실패 : ", error);
    }
  };

  
    useEffect(() => {
      fetchRandomUsers();
      fetchMatchedDogs();
    }, [userId]);
  if (!userId) {
    navigate("/login");
    return null; // 이건 컴포넌트 전체에서 렌더링 자체를 막는 용도
  }





  const handleMatchedDogsClick = () => {
    setShowMatchedDogs(!showMatchedDogs);
  };

  // 강아지 상세 정보 보기 핸들러 추가
  const handleViewDogDetails = (dog) => {
    setSelectedDog(dog);
    setShowDogPopup(true);
  };

  // 팝업 닫기 핸들러 추가
  const handleClosePopup = () => {
    setShowDogPopup(false);
  };

  //   선택하기 버튼 클릭 시 like +1 db 저장
  const handleSelect = async (id) => {
    if (!id) {
      return;
    }
    try {
      await axios.post(`${BASE_URL}/like/${id}`);
      fetchRandomUsers();
    } catch (error) {
      console.log("좋아요 증가 실패: ", error);
    }
  };

  // 선택하기 버튼 클릭 시 매칭 저장
  const handleMatch = async (receiverId) => {
    handleSelect(receiverId);
    try {
      const result = await createMatch(receiverId);
      console.log("매칭 결과:", result);
      fetchMatchedDogs();
    } catch (error) {
      console.error("매칭 처리 중 오류 발생:", error);
    }
  };

  const handleChat = async (dogId) => {
    try {
      const chatRoom = await chatAPI.createChatRoom(userId, dogId);
      navigate(`/chat?chatRoomId=${chatRoom.id}&senderId=${userId}`);
    } catch (error) {
      console.error("채팅방 생성 실패: ", error);
    }
  };

  const handleDeleteChat = async (receiverId) => {
    try {
      // ✅ 1. senderId와 receiverId로 chatRoomId 조회
      const response = await axios.get(
        `http://3.37.145.80:8080/api/chat/getChatRoomId`,
        {
          params: { senderId: userId, receiverId },
        }
      );

      if (response.status === 200 && response.data) {
        const chatRoomId = response.data;
        // 채팅방 삭제 API 호출
        await chatAPI.deleteChatRoom(chatRoomId);
      } else {
        console.log("채팅방이 존재하지 않음");
      }
    } catch (error) {
      console.error("매칭 또는 채팅방 삭제 실패:", error);
    }
  };

  // 삭제 기능
  const handleDeleteMatch = async (receiverId) => {
    try {
      await deleteMatch(receiverId); // await 사용 가능
      alert("매칭이 삭제되었습니다.");
      await handleDeleteChat(receiverId);
      fetchMatchedDogs(); // 최신 매칭 목록 다시 불러오기
    } catch (error) {
      alert("매칭 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="find-friend-page">
      <h1 className="find-friend-title">댕근찾기</h1>
      <p className="find-friend-description">마음에 드는 친구를 선택하세요!</p>

      {loading ? (
        <p>랜덤 강아지를 불러오는 중...</p>
      ) : (
        <div className="profiles-container">
          <div className="profile-card">
            <h2>{currentProfiles[0]?.userName}</h2>
            <img
              src={currentProfiles[0]?.image || "/placeholder.svg"}
              alt={currentProfiles[0]?.userName}
              className="profile-find-image"
            />
            <div className="profile-details">
              <p>견종: {currentProfiles[0]?.petBreed}</p>
              <p>나이: {currentProfiles[0]?.petAge}살</p>
              <p>성별: {currentProfiles[0]?.petGender}</p>
              <p>{currentProfiles[0]?.petPersonality}</p>
              <p>📍 {currentProfiles[0]?.location}</p>
            </div>
            <button
              className="select-button"
              onClick={() => handleMatch(currentProfiles[0]?.id)}
            >
              선택하기
            </button>
          </div>

          {/* 중앙 버튼 영역 - 카드들 사이에 위치 */}
          <div className="center-buttons">
            <button className="skip-button" onClick={fetchRandomUsers}>
              둘 다 선택 안함
            </button>
            <button
              className="matched-count-button"
              onClick={handleMatchedDogsClick}
            >
              ↩ 매칭된 댕댕이 ({matchedDogs.length})
            </button>
            {showMatchedDogs && (
              <div
                className="matched-dogs-modal"
                onClick={() => setShowMatchedDogs(false)}
              >
                <div
                  className="matched-dogs-container"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="matched-dogs-header">
                    <h3 className="matched-dogs-title">
                      매칭된 댕댕이 ({matchedDogs.length})
                    </h3>
                    <button
                      className="matched-dogs-close"
                      onClick={() => setShowMatchedDogs(false)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="matched-dogs-list">
                    {matchedDogs.map((dog) => (
                      <div
                        key={dog.id}
                        className="matched-dog-item"
                        onClick={() => handleViewDogDetails(dog)}
                      >
                        <div className="matched-dog-info">
                          <img
                            src={dog.image || "/placeholder.svg"}
                            alt={dog.nickname}
                            className="matched-dog-image"
                          />
                          <div className="matched-dog-details">
                            <span className="matched-dog-name">
                              {dog.nickname}
                            </span>
                          </div>
                        </div>
                        <div className="matched-dog-actions">
                          <button
                            className="chat-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChat(dog.id);
                            }}
                          >
                            채팅
                          </button>
                          <button
                            className="reject-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMatch(dog.id);
                            }}
                          >
                            거절
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="profile-card">
            <h2>{currentProfiles[1]?.userName}</h2>
            <img
              src={currentProfiles[1]?.image || "/placeholder.svg"}
              alt={currentProfiles[1]?.userName}
              className="profile-find-image"
            />
            <div className="profile-details">
              <p>견종: {currentProfiles[1]?.petBreed}</p>
              <p>나이: {currentProfiles[1]?.petAge}살</p>
              <p>성별: {currentProfiles[1]?.petGender}</p>
              <p>{currentProfiles[1]?.petPersonality}</p>
              <p>📍 {currentProfiles[1]?.location}</p>
            </div>
            <button
              className="select-button"
              onClick={() => handleMatch(currentProfiles[1]?.id)}
            >
              선택하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindFriendPage;
