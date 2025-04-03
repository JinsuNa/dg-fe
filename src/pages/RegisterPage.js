"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AuthPages.css";
import { register, uploadFile, checkUsername, checkEmail } from "../utils/api";
import {
  isValidUsername,
  isValidEmail,
  isValidPassword,
  doPasswordsMatch,
  isValidAge,
} from "../utils/validation";
import axios from "axios";

function RegisterPage({ onLogin }) {
  const navigate = useNavigate();

  // 상태 관리
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repeatPassword: "",
    username: "",
    phone: "",
    address: "",
    location: "",
    name: "",
    age: "",
    petGender: "남아",
    breed: "",
    personality: "",
  });

  const [validation, setValidation] = useState({
    email: { isChecking: false, isValid: false, isChecked: false, message: "" },
    username: {
      isChecking: false,
      isValid: false,
      isChecked: false,
      message: "",
    },
    password: { isValid: false, message: "" },
    repeatPassword: { isValid: false, message: "" },
    formIsValid: false,
  });
  const [image, setimage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl); // 정리
  }, [image]);

  const [formValidation, setFormValidation] = useState({
    username: {
      isChecking: false,
      isValid: false,
      isChecked: false,
      message: "",
    },
    email: { isChecking: false, isValid: false, isChecked: false, message: "" },
  });

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // 닉네임이 바뀌면 중복 확인 상태 초기화
    setFormValidation((prev) => ({
      ...prev,
      [e.target.name]: {
        isChecked: false,
        isValid: false,
        isChecking: false, // ⬅ 변경하면 다시 입력 가능!
        message: "",
      },
    }));
  };

  // 회원가입 에러 메시지 초기화
  if (registerError) {
    setRegisterError("");
  }

  // 폼 제출 핸들러 (Spring Boot API 연동)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 이메일 또는 닉네임이 확인되지 않았거나, 유효하지 않으면 회원가입 불가
    if (!formValidation.email.isValid || !formValidation.username.isValid) {
      setRegisterError("이메일과 닉네임 중복 확인을 완료해야 합니다.");
      return;
    }

    setIsLoading(true);

    try {
      // FormData 생성 (JSON + 이미지 함께 전송)
      const formDataToSend = new FormData();

      // JSON 데이터를 Blob 형태로 변환 후 추가
      const userBlob = new Blob([JSON.stringify(formData)], {
        type: "application/json",
      });
      formDataToSend.append("user", userBlob);

      // 프로필 이미지 추가 (선택 사항)
      if (image) {
        formDataToSend.append("image", image);
      }

      // 회원가입 API 호출
      const response = await register(formDataToSend);

      console.log("🔹 회원가입 응답 데이터:", response); // 확인용 로그
      console.log("🔹 응답 success 값:", response.success);

      navigate("/login");
    } catch (error) {
      setRegisterError(
        error.message || "회원가입에 실패했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 check validation 시작
  // 비밀번호 유효성 검사
  useEffect(() => {
    if (formData.password) {
      if (isValidPassword(formData.password)) {
        setValidation((prev) => ({
          ...prev,
          password: { isValid: true, message: "사용 가능한 비밀번호입니다." },
        }));
      } else {
        setValidation((prev) => ({
          ...prev,
          password: {
            isValid: false,
            message: "비밀번호는 6~12자리로 입력해주세요.",
          },
        }));
      }
    } else {
      setValidation((prev) => ({
        ...prev,
        password: { isValid: false, message: "" },
      }));
    }

    // 비밀번호 확인 유효성 검사
    if (formData.repeatPassword) {
      if (doPasswordsMatch(formData.password, formData.repeatPassword)) {
        setValidation((prev) => ({
          ...prev,
          repeatPassword: { isValid: true, message: "비밀번호가 일치합니다." },
        }));
      } else {
        setValidation((prev) => ({
          ...prev,
          repeatPassword: {
            isValid: false,
            message: "비밀번호가 일치하지 않습니다.",
          },
        }));
      }
    } else {
      setValidation((prev) => ({
        ...prev,
        repeatPassword: { isValid: false, message: "" },
      }));
    }
  }, [formData.password, formData.repeatPassword]);

  // 비밀번호 check validation 끝

  //  닉네임 validation 시작
  const handleCheckUsername = async () => {
    if (!formData.username.trim()) {
      setFormValidation((prev) => ({
        ...prev,
        username: {
          isChecked: true,
          isValid: false,
          isChecking: false,
          message: "닉네임을 입력하세요.",
        },
      }));
      return;
    }

    setFormValidation((prev) => ({
      ...prev,
      username: { ...prev.username, isChecking: true },
    }));

    const isAvailable = await checkUsername(formData.username); // ✅ API 호출

    setFormValidation((prev) => ({
      ...prev,
      username: {
        isChecked: true,
        isValid: isAvailable, // true면 사용 가능, false면 중복
        isChecking: false,
        message: isAvailable
          ? "사용 가능한 닉네임입니다."
          : "이미 사용 중인 닉네임입니다.",
      },
    }));
  };

  // 이메일 중복 확인
  const handleCheckEmail = async () => {
    const email = formData.email.trim();

    // 이메일이 비어 있는 경우
    if (!email) {
      setFormValidation((prev) => ({
        ...prev,
        email: {
          isChecked: true,
          isValid: false,
          isChecking: false,
          message: "이메일을 입력하세요.",
        },
      }));
      return;
    }

    // 이메일 형식이 올바르지 않은 경우
    if (!isValidEmail(email)) {
      setFormValidation((prev) => ({
        ...prev,
        email: {
          isChecked: true,
          isValid: false,
          isChecking: false,
          message: "유효한 이메일 주소를 입력해주세요.",
        },
      }));
      return;
    }

    setFormValidation((prev) => ({
      ...prev,
      email: { ...prev.email, isChecking: true },
    }));

    // 이메일 중복 확인 API 호출
    const isAvailable = await checkEmail(email);

    setFormValidation((prev) => ({
      ...prev,
      email: {
        isChecked: true,
        isValid: isAvailable,
        isChecking: false,
        message: isAvailable
          ? "사용 가능한 이메일입니다."
          : "이미 사용 중인 이메일입니다.",
      },
    }));
  };

  // 이메일 및 닉네임 validation 끝

  // 카카오 다음 api 주소 시작
  // ✅ 카카오 우편번호 API 자동 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // ✅ 주소 검색 실행 (버튼 클릭 시 바로 실행)
  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const fullAddress = data.roadAddress || data.jibunAddress;
        const districtMatch = fullAddress.match(/([가-힣]+구)/);
        const district = districtMatch ? districtMatch[1] : "";

        setFormData((prev) => ({
          ...prev,
          address: fullAddress,
          location: district, // 구 정보 자동 설정
        }));
      },
    }).open();
  };
  // 카카오 다음 api 주소 끝

  // 이미지 s3업로드 시작
  // 파일 입력 핸들러
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setimage(e.target.files[0]);
    }
  };
  // 이미지 s3업로드 끝

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-card-title">회원가입</h2>
            <p className="auth-card-description">
              댕근의 새로운 회원이 되어보세요.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-card-content">
              {/* 회원가입 에러 메시지 */}
              {registerError && (
                <div className="auth-alert auth-alert-error">
                  {registerError}
                </div>
              )}
              {/* 이메일 입력 필드 */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  이메일
                </label>
                <div className="address-input-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-input ${
                      formValidation.email.isChecked &&
                      (formValidation.email.isValid ? "valid" : "error")
                    }`}
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={formValidation.email.isChecking}
                  />
                  <button
                    type="button"
                    className="address-search-button"
                    onClick={handleCheckEmail} // 중복 확인 버튼에 이벤트 추가
                    disabled={
                      formValidation.email.isChecking ||
                      formValidation.email.isValid
                    } // 사용 가능이면 버튼 비활성화
                  >
                    {formValidation.email.isChecking
                      ? "확인 중..."
                      : "중복 확인"}
                  </button>
                </div>

                {/* 이메일 중복 확인 결과 메시지 */}
                {formValidation.email.message && (
                  <p
                    className={`${
                      formValidation.email.isValid
                        ? "form-success"
                        : "form-error"
                    }`}
                  >
                    {formValidation.email.message}
                  </p>
                )}

                {/* 에러 메시지 */}
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>
              {/* 닉네임 입력 필드 */}
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  닉네임
                </label>
                <div className="address-input-group">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className={`form-input ${
                      formValidation.username.isChecked &&
                      (formValidation.username.isValid ? "valid" : "error")
                    }`}
                    placeholder="사용자 닉네임"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={formValidation.username.isChecking}
                  />
                  <button
                    type="button"
                    onClick={handleCheckUsername}
                    className="address-search-button"
                    disabled={
                      formValidation.username.isChecking ||
                      formValidation.username.isValid
                    } // 사용 가능이면 버튼 비활성화
                  >
                    {formValidation.username.isValid
                      ? "사용 가능"
                      : "중복 확인"}
                  </button>
                </div>
                {/* 닉네임 중복 확인 결과 메시지 */}
                {formValidation.username.message && (
                  <p
                    className={`${
                      formValidation.email.isValid
                        ? "form-success"
                        : "form-error"
                    }`}
                  >
                    {formValidation.username.message}
                  </p>
                )}
              </div>

              {/* 비밀번호 입력 필드 */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-input ${
                    formData.password &&
                    (validation.password.isValid ? "valid" : "error")
                  }`}
                  placeholder="비밀번호"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {formData.password && (
                  <p
                    className={`${
                      validation.password.isValid
                        ? "form-success"
                        : "form-error"
                    }`}
                  >
                    {validation.password.message}
                  </p>
                )}
                <p className="form-hint">비밀번호는 6~12자리로 입력해주세요.</p>
                {errors.password && (
                  <p className="form-error">{errors.password}</p>
                )}
              </div>

              {/* 비밀번호 확인 필드 */}
              <div className="form-group">
                <label htmlFor="repeatPassword" className="form-label">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  id="repeatPassword"
                  name="repeatPassword"
                  className={`form-input ${
                    formData.repeatPassword &&
                    (validation.repeatPassword.isValid ? "valid" : "error")
                  }`}
                  placeholder="비밀번호 확인"
                  onChange={handleChange}
                  disabled={isLoading}
                />
                {formData.repeatPassword && (
                  <p
                    className={`${
                      validation.repeatPassword.isValid
                        ? "form-success"
                        : "form-error"
                    }`}
                  >
                    {validation.repeatPassword.message}
                  </p>
                )}
                {errors.repeatPassword && (
                  <p className="form-error">{errors.repeatPassword}</p>
                )}
              </div>

              {/* 주소 입력 필드 */}
              <div className="form-group">
                <label htmlFor="address" className="form-label">
                  주소
                </label>
                <div className="address-input-group">
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="form-input"
                    placeholder="주소 검색을 클릭하세요"
                    value={formData.address}
                    readOnly
                  />
                  <button
                    type="button"
                    className="address-search-button"
                    onClick={handleAddressSearch}
                  >
                    🔍 검색
                  </button>
                </div>
                {formData.location && (
                  <p className="form-hint">
                    지역: {formData.location} (자동 설정됨)
                  </p>
                )}
              </div>

              <div className="pet-info-section">
                <h3 className="pet-info-title">반려견 정보</h3>
                {/* 반려견 이미지 업로드 */}
                <div className="form-group">
                  <label htmlFor="image" className="form-label">
                    반려견 사진
                  </label>
                  <div className="profile-upload">
                    <div className="profile-image-preview">
                      {image ? (
                        <img
                          src={preview}
                          alt="프로필 미리보기"
                          className="profile-image"
                        />
                      ) : (
                        <span className="profile-placeholder">👤</span>
                      )}
                    </div>
                    <div className="profile-upload-input">
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        className="form-input"
                      />
                      <p className="profile-upload-hint">
                        JPG, PNG 형식의 이미지를 업로드해주세요.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="petName" className="form-label">
                    반려견 이름
                  </label>
                  <input
                    type="text"
                    id="petName"
                    name="petName"
                    className="form-input"
                    placeholder="초코"
                    value={formData.petName}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {errors.petName && (
                    <p className="form-error">{errors.petName}</p>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="petAge" className="form-label">
                      나이
                    </label>
                    <input
                      type="number"
                      id="petAge"
                      name="petAge"
                      className="form-input"
                      placeholder="3"
                      value={formData.petAge}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    {errors.petAge && (
                      <p className="form-error">{errors.petAge}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="petGender" className="form-label">
                      성별
                    </label>
                    <select
                      id="petGender"
                      name="petGender"
                      className="form-input"
                      value={formData.petGender}
                      disabled={isLoading}
                      onChange={handleChange}
                    >
                      <option value="남아">남아</option>
                      <option value="여아">여아</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="petBreed" className="form-label">
                    견종
                  </label>
                  <input
                    type="text"
                    id="petBreed"
                    name="petBreed"
                    className="form-input"
                    placeholder="포메라니안"
                    value={formData.petBreed}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {errors.petBreed && (
                    <p className="form-error">{errors.petBreed}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="petPersonality" className="form-label">
                    성격
                  </label>
                  <input
                    type="text"
                    id="petPersonality"
                    name="petPersonality"
                    className="form-input"
                    placeholder="활발하고 친절해요"
                    value={formData.petPersonality}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="auth-card-footer">
              <button
                type="submit"
                className="auth-button auth-button-primary"
                disabled={
                  isLoading ||
                  !formValidation.email.isValid ||
                  !formValidation.username.isValid
                }
              >
                {isLoading ? "가입 중..." : "회원가입"}
              </button>

              <p className="auth-footer-text">
                이미 계정이 있으신가요?{" "}
                <Link to="/login" className="auth-link">
                  로그인
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
