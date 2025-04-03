import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/chat"; // 백엔드 API 주소

const chatAPI = {
    // 채팅방 생성
    createChatRoom: async (senderId, receiverId) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/create`, {
                senderId,
                receiverId
            });
    
    
            return response.data; // 🚨 `response.data`를 반드시 반환
        } catch (error) {
            console.error("❌ 채팅방 생성 API 요청 실패:", error);
            throw error; // 에러를 던져서 호출하는 곳에서 처리 가능하게 함
        }
    },

    // 특정 채팅방의 모든 메시지 조회
    getChatMessages: async (chatRoomId) => {
        const response = await axios.get(`${API_BASE_URL}/messages/${chatRoomId}`);
        console.log(response.data);
        
        return response.data;
    },

    // 특정 채팅방에 메시지 전송 (REST API)
    sendMessage: async (chatRoomId, senderId, message) => {
        const response = await axios.post(`${API_BASE_URL}/message`, {
            chatRoomId,
            senderId,
            message
        });
        console.log("서버 응당(sendMessage) :", response.data);
        
        return response.data;
    },

    // 채팅방 삭제
    deleteChatRoom: async (chatRoomId) => {
        const response = await axios.delete(`${API_BASE_URL}/delete/${chatRoomId}`);
        return response.data;
    }
};

export default chatAPI;
