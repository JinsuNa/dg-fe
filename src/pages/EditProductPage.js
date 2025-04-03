"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditMarketItem.css"; // 스타일 추가

function EditMarketItemPage() {
  const { id } = useParams(); // URL에서 상품 ID 가져오기
  const productId = Number(id);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [sellerId, setSellerId] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // 상품 정보 상태
  const [product, setProduct] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
    location: "",
  });

  // ✅ 이미지 미리보기 URL 생성
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const userId = localStorage.getItem("userId"); // ✅ 로그인된 사용자 ID 가져오기

      if (!productId || isNaN(productId)) {
        setError("유효하지 않은 상품 ID입니다.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://3.37.145.80:8080/api/products/${productId}`
        );
        setProduct(response.data);
        setSellerId(Number(response.data.sellerId)); // ✅ 판매자 ID를 숫자로 변환
        setCurrentUserId(userId ? Number(userId) : null); // ✅ 로그인된 사용자 ID를 숫자로 변환

        console.log("✅ 상품 데이터 로드 완료:", response.data);
        console.log("✅ 로그인된 사용자 ID:", userId);
        console.log("✅ 상품 판매자 ID:", response.data.sellerId);
      } catch (err) {
        console.error("❌ 상품 데이터 가져오기 실패:", err);
        setError("상품 정보를 찾을 수 없습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // ✅ 로그인된 사용자와 판매자가 다르면 수정 불가능
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/login"); // ✅ 로그인 안 했으면 자동으로 로그인 페이지로 이동
    } else {
      setCurrentUserId(Number(userId));
    }
  }, [navigate]);
  if (
    currentUserId !== null &&
    sellerId !== null &&
    currentUserId !== sellerId
  ) {
    return (
      <div className="error-container">
        <p>⚠️ 해당 상품을 수정할 권한이 없습니다.</p>
        <button className="btn-primary" onClick={() => navigate("/market")}>
          🔙 목록으로 돌아가기
        </button>
      </div>
    );
  }

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // 상품 수정 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId"); // ✅ 로그인된 사용자 ID 가져오기

    console.log("📡 수정 요청 데이터:", { ...product, userId });

    try {
      const formData = new FormData();
      formData.append("title", product.title);
      formData.append("price", product.price);
      formData.append("description", product.description);
      formData.append("location", product.location);
      formData.append("userId", userId);

      if (imageFile) {
        formData.append("image", imageFile); // ✅ 이미지 파일 추가
      }

      const response = await axios.put(
        `http://3.37.145.80:8080/api/products/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("✅ 상품이 성공적으로 수정되었습니다!");
        navigate(`/market/${productId}`);
      }
    } catch (err) {
      console.error("❌ 상품 수정 실패:", err);
      alert("상품 수정 중 오류가 발생했습니다.");
    }
  };

  // 로딩 중 화면
  if (isLoading) {
    return <div className="loading">⏳ 상품 정보를 불러오는 중...</div>;
  }

  // 에러 발생 시 화면
  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button className="btn-primary" onClick={() => navigate("/market")}>
          🔙 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="write-page">
      {/* ✅ 헤더 */}
      <div className="writeImage">
        <img src="/favicon.svg" alt="상품 수정 아이콘" />
        <h2 className="write-title">📝 상품 수정</h2>
      </div>
  
      <form className="write-form" onSubmit={handleSubmit}>
        {/* ✅ 상품명 */}
        <div className="form-group">
          <label className="form-label">상품명</label>
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
  
        {/* ✅ 가격 */}
        <div className="form-group">
          <label className="form-label">가격</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
  
        {/* ✅ 설명 */}
        <div className="form-group">
          <label className="form-label">설명</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            className="form-textarea"
          />
        </div>
  
        {/* ✅ 이미지 업로드 */}
        <div className="form-group">
          <label className="form-label">이미지 업로드</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {previewImage && (
            <div className="image-preview">
              <img
                src={previewImage}
                alt="미리보기"
                style={{ width: "150px", height: "auto", marginTop: "10px" }}
              />
            </div>
          )}
        </div>
  
        {/* ✅ 위치 */}
        <div className="form-group">
          <label className="form-label">위치</label>
          <input
            type="text"
            name="location"
            value={product.location}
            onChange={handleChange}
            className="form-input"
          />
        </div>
  
        {/* ✅ 버튼 영역 */}
        <div className="form-actions">
          <button type="submit" className="btn-submit">저장</button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate(`/market/${productId}`)}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
  
}

export default EditMarketItemPage;
