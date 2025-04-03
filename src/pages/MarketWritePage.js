"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/marketWrite.css";

function MarketWritePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);

  // 입력 필드 변경 핸들러
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 파일 업로드 핸들러
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // 이미지 미리보기 설정
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImages([event.target.result]);
    };
    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.price || !formData.description) {
      setError("모든 필드를 입력해주세요.");
      return;
    }
    const userId = localStorage.getItem("userId");
    console.log(userId);
    setIsSubmitting(true); // ✅ 등록 중 상태 활성화
    setError(""); // ✅ 기존 에러 초기화

  
    
    const data = new FormData();

    // ✅ 상품 정보 추가
    data.append(
      "product",
      new Blob([JSON.stringify({ ...formData, sellerId: userId })], {
        type: "application/json",
      })
    );

    // ✅ 이미지 파일 추가 (선택 사항)
    if (file) {
      data.append("image", file);
    }

    try {
      const response = await axios.post(
        "http://3.37.145.80:8080/api/products",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("상품 등록 성공:", response.data);
      alert("상품이 성공적으로 등록되었습니다!");
      navigate("/market"); // 등록 후 /market 페이지로 이동
    } catch (error) {
      console.error("상품 등록 실패:", error.response?.data || error);
      setError("상품 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false); // ✅ 등록 완료 후 상태 복구
    }
  };

  return (
    <div className="write-page">
      {/* ✅ 헤더 */}
      <div className="writeImage">
        <img src="/favicon.svg" alt="상품 등록 아이콘" />
        <h2 className="write-title">상품 등록</h2>
      </div>
  
      {error && <p className="form-error">{error}</p>}
  
      <form className="write-form" onSubmit={handleSubmit}>
        {/* ✅ 제목 입력 */}
        <div className="form-group">
          <label className="form-label">제목</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="상품 제목을 입력하세요"
            className="form-input"
            required
          />
        </div>
  
        {/* ✅ 가격 입력 */}
        <div className="form-group">
          <label className="form-label">가격</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="가격을 입력하세요 (숫자만)"
            className="form-input"
            required
          />
        </div>
  
        {/* ✅ 설명 입력 */}
        <div className="form-group">
          <label className="form-label">설명</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="상품 설명을 입력하세요"
            className="form-textarea"
            required
          ></textarea>
        </div>
  
        {/* ✅ 이미지 업로드 */}
        <div className="form-group">
          <label className="form-label">이미지 업로드 (최대 5개)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
  
          <div className="image-upload-grid">
            {previewImages.length === 0 && (
              <p className="form-hint">이미지를 선택해주세요.</p>
            )}
            {previewImages.map((img, index) => (
              <div key={index} className="image-upload-item">
                <img
                  src={img}
                  alt={`미리보기-${index}`}
                  className="image-preview"
                />
              </div>
            ))}
          </div>
        </div>
  
        {/* ✅ 버튼 영역 */}
        <div className="form-actions">
   
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "등록 중..." : "상품 등록"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MarketWritePage;
