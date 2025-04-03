"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { Client } from "@stomp/stompjs";
import "../styles/Chat.css";
import chatAPI from "../utils/chatApi";

function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const chatRoomId = queryParams.get("chatRoomId");
  const senderId = queryParams.get("senderId");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);

  const chatContentRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true); // ✅ 스크롤 여부 상태 추가

  // ✅ 메시지 불러오기 (REST)
  useEffect(() => {
    if (!chatRoomId) return;

    const fetchMessages = async () => {
      try {
        const chatMessages = await chatAPI.getChatMessages(chatRoomId);

        setMessages(chatMessages);
        setIsAutoScroll(true); // ✅ 초기 로딩 시 자동 스크롤
      } catch (error) {
        console.error("기존 메세지 불러오기 실패:", error);
      }
    };

    fetchMessages();

    const intervalId = setInterval(fetchMessages, 1000);
    return () => clearInterval(intervalId);
  }, [chatRoomId]);

  // ✅ WebSocket 연결
  useEffect(() => {
    if (!chatRoomId) return;

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws-chat",
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ WebSocket 연결 성공");

        client.subscribe(`/topic/chat/${chatRoomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, receivedMessage]);
          setIsAutoScroll(true); // ✅ 새 메시지 수신 시 스크롤 활성화
        });
      },
      onStompError: (error) => {
        console.error("🚨 WebSocket 오류 발생:", error);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, [chatRoomId]);

  // ✅ 스크롤 처리
  useEffect(() => {
    if (isAutoScroll && chatContentRef.current) {
      chatContentRef.current.scrollTo({
        top: chatContentRef.current.scrollHeight,
        behavior: "smooth", // ✅ 여기!
      });
      setIsAutoScroll(false); // 한 번만 스크롤 작동
    }
  }, [messages]);

  // ✅ 메시지 전송
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      chatRoomId,
      senderId,
      message: newMessage,
      createdAt: new Date().toISOString(),
    };

    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(messageData),
      });

      setNewMessage("");
      setIsAutoScroll(true); // ✅ 내가 메시지 보냈을 때도 스크롤
    } else {
      console.error("❌ WebSocket 연결이 안 되어 있음.");
    }
  };

  return (
    <div className="chat-page">
      <p></p>
      <div className="chat-container">
        <div className="chat-card">
          {/* 채팅 내용 */}
          <div className="chat-content" ref={chatContentRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.senderId === Number(senderId)
                    ? "message-mine"
                    : "message-other"
                }`}
              >
                <div className="message-bubble">
                  <div className="message-text">{message.message}</div>
                  <div className="message-time">
                    {format(new Date(message.createdAt), "HH:mm")}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 메시지 입력 폼 */}
          <div className="chat-footer">
            <form onSubmit={handleSendMessage} className="message-form">
              <input
                type="text"
                className="message-input"
                placeholder="메시지를 입력하세요..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="send-button">
                전송
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
