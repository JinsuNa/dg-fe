import axios from "axios";

// API 기본 URL 설정
const API_BASE_URL = "http://3.37.145.80:8080/api/user";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://3.37.145.80:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 로그인 API
export const loginUser = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, formData);
    return (await response).data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// 회원가입 API
/**
 * @param {FormData} formData - 사용자 정보 + 이미지 파일
 * @returns {Promise<any>}
 */
export const register = async (formData) => {
  try {
    const response = await axios.post(
      "http://3.37.145.80:8080/api/user/register",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data; // 서버 응답 반환
  } catch (error) {
    console.error("회원가입 API 오류:", error.response?.data || error.message);
    throw error;
  }
};

// 닉네임 중복 api
export const checkUsername = async (username) => {
  const response = await axios.get(`${API_BASE_URL}/check-username`, {
    params: { username },
  });
  return response.data;
};

// 이메일 중복 api
export const checkEmail = async (email) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/check-email`, {
      params: { email },
    });
    return response.data;
  } catch (error) {
    console.error("닉네임 중복 확인 에러: ", error);
    return false;
  }
};

export default api;
