import axios from "axios";

// API 기본 URL 설정
const API_BASE_URL = "http://3.37.145.80:8080/api/products";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


/**
 * @param {FormData} formData - 사용자 정보 + 이미지 파일
 * @returns {Promise<any>}
 */
export const createMarketPost = async (formData) => {
  try {
      const response = await axios.post("http://3.37.145.80:8080/api/products", formData, {
          headers: {
              "Content-Type": "multipart/form-data",
          },
      });

      return response.data; // ✅ 항상 데이터를 반환
  } catch (error) {
      console.error("API 요청 오류:", error.response ? error.response.data : error.message);
      return { success: false, message: "상품 등록 실패" }; // ✅ 기본 응답 반환
  }
};



