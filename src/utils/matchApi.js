import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/match";

const getSenderId = () => {
  return localStorage.getItem("userId");
};

// 랜덤한 카드 두개 가져오기
export const getRandomUsers = () => {
  const senderId = getSenderId();

  if (!senderId) {
    console.error("❌ 사용자 ID가 없습니다 (로컬스토리지 확인)");
    return;
  }

  return axios.get(`${API_BASE_URL}/random`, {
    params: { senderId },
  });
};

// 선택한 댕댕이 like +1씩 증가시키기
export const likeCount = (id) => axios.post(`${API_BASE_URL}/like/${id}`);
// like가 많은 순서대로 3개 출력
export const topLiked = () => axios.get(`${API_BASE_URL}/top-liked`);

// 채팅 api

/**
 * 특정 사용자 간의 채팅 내역 조회
 * @param {number} senderId - 메시지를 보낸 사용자 ID
 * @param {number} receiverId - 메시지를 받은 사용자 ID
 * @returns {Promise<Array>} 채팅 메시지 배열
 */

export const getChatHistory = async (senderId, receiverId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${senderId}/${receiverId}`
    );
    return response.data;
  } catch (error) {
    console.error("채팅 내역 조회 실패 : ", error);
    return [];
  }
};

/**
 * 메시지 전송
 * @param {number} senderId - 메시지를 보낸 사용자 ID
 * @param {number} receiverId - 메시지를 받은 사용자 ID
 * @param {string} message - 메시지 내용
 * @returns {Promise<Object>} 전송된 메시지 데이터
 */
export const sendMessage = async (senderId, receiverId, message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/send`, {
      senderId,
      receiverId,
      message,
    });
    return response.data;
  } catch (error) {
    console.error("❌ 메시지 전송 실패:", error);
    return null;
  }
};

// 매칭 리스트 조회
export const fetchMatches = async () => {
  const senderId = getSenderId();
  if (!senderId) {
    return;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/doglist`, {
      params: { senderId },
    });
    console.log("✅ 매칭 리스트 조회 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ 매칭 리스트 조회 실패:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 새로운 매칭 생성
export const createMatch = async (receiverId) => {
  const senderId = getSenderId();
  if (!senderId) {
    console.error("❌ 로그인된 사용자 ID를 찾을 수 없습니다.");
    return;
  }

  try {
    const response = await axios.post(API_BASE_URL, { senderId, receiverId });
    console.log("✅ 매칭 생성 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ 매칭 생성 실패:", error.response?.data || error.message);
    throw error;
  }
};

// 매칭 삭제

export const deleteMatch = async (receiverId) => {
  const senderId = getSenderId();
  if (!senderId) {
    console.error("❌ 로그인된 사용자 ID를 찾을 수 없습니다.");
    return;
  }

  try {
    const response = await axios.delete(API_BASE_URL, {
      params: { senderId, receiverId },
    });
    console.log("✅ 매칭 삭제 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ 매칭 삭제 실패:", error.response?.data || error.message);
    throw error;
  }
};
