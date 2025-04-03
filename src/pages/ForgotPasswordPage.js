"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/AuthPages.css"
import { forgotPassword, resetPassword } from "../utils/api"
import { isValidUsername, isValidEmail, isValidPassword, doPasswordsMatch } from "../utils/validation"

function ForgotPasswordPage() {
  const navigate = useNavigate()

  // 상태 관리
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [step, setStep] = useState(1) // 1: 계정확인, 2: 비밀번호 재설정
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // 에러 메시지 초기화
    if (error) {
      setError("")
    }
  }

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (step === 1) {
      // 계정 확인 단계
      if (!formData.username.trim()) {
        setError("아이디를 입력해주세요.")
        setIsLoading(false)
        return
      }

      if (!isValidUsername(formData.username)) {
        setError("유효한 아이디를 입력해주세요.")
        setIsLoading(false)
        return
      }

      if (!formData.email.trim()) {
        setError("이메일을 입력해주세요.")
        setIsLoading(false)
        return
      }

      if (!isValidEmail(formData.email)) {
        setError("유효한 이메일 주소를 입력해주세요.")
        setIsLoading(false)
        return
      }

      try {
        // 비밀번호 찾기 API 호출
        const response = await forgotPassword(formData.username, formData.email)

        if (response.success) {
          setSuccess(response.message)
          // 계정 확인 성공 시 다음 단계로
          setStep(2)
        }
      } catch (err) {
        setError(err.message || "계정 정보를 확인할 수 없습니다. 다시 시도해주세요.")
      } finally {
        setIsLoading(false)
      }
    } else {
      // 비밀번호 재설정 단계
      if (!formData.password.trim()) {
        setError("새 비밀번호를 입력해주세요.")
        setIsLoading(false)
        return
      }

      if (!isValidPassword(formData.password)) {
        setError("비밀번호는 6~12자 이상이어야 합니다.")
        setIsLoading(false)
        return
      }

      if (!formData.confirmPassword.trim()) {
        setError("비밀번호 확인을 입력해주세요.")
        setIsLoading(false)
        return
      }

      if (!doPasswordsMatch(formData.password, formData.confirmPassword)) {
        setError("비밀번호가 일치하지 않습니다.")
        setIsLoading(false)
        return
      }

      try {
        // 비밀번호 재설정 API 호출
        // 실제 구현 시에는 이메일로 받은 토큰을 사용
        const token = "dummy-reset-token"
        const response = await resetPassword(formData.password, token)

        if (response.success) {
          setSuccess(response.message)
          setIsSubmitted(true)
        }
      } catch (err) {
        setError(err.message || "비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="flex items-center">
              <Link to="/login" className="auth-link mr-4">
                ← 돌아가기
              </Link>
              <div>
                <h2 className="auth-card-title">비밀번호 찾기</h2>
                <p className="auth-card-description">
                  {isSubmitted
                    ? "비밀번호가 성공적으로 변경되었습니다."
                    : step === 1
                      ? "아이디와 이메일을 입력하여 계정을 확인해주세요."
                      : "새로운 비밀번호를 입력해주세요."}
                </p>
              </div>
            </div>
          </div>

          {isSubmitted ? (
            <div className="auth-card-content">
              <div className="auth-alert auth-alert-success">
                <p className="text-center">비밀번호가 성공적으로 변경되었습니다.</p>
                <p className="text-center form-hint">새 비밀번호로 로그인해주세요.</p>
              </div>

              <div className="auth-card-footer">
                <button className="auth-button auth-button-primary" onClick={() => navigate("/login")}>
                  로그인 페이지로 돌아가기
                </button>
              </div>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-card-content">
                {error && <div className="auth-alert auth-alert-error">{error}</div>}

                {success && <div className="auth-alert auth-alert-success">{success}</div>}

                {step === 1 ? (
                  // 계정 확인 단계
                  <>
                    <div className="form-group">
                      <label htmlFor="username" className="form-label">
                        아이디
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        className="form-input"
                        placeholder="사용자 아이디"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        이메일
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                  </>
                ) : (
                  // 비밀번호 재설정 단계
                  <>
                    <div className="form-group">
                      <label htmlFor="password" className="form-label">
                        새 비밀번호
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-input"
                        placeholder="새 비밀번호"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      <p className="form-hint">비밀번호는 6~12자리로 입력해주세요.</p>
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword" className="form-label">
                        비밀번호 확인
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="form-input"
                        placeholder="비밀번호 확인"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="auth-card-footer">
                <button type="submit" className="auth-button auth-button-primary" disabled={isLoading}>
                  {isLoading ? "처리 중..." : step === 1 ? "계정 확인하기" : "비밀번호 변경하기"}
                </button>

                <p className="auth-footer-text">
                  <Link to="/login" className="auth-link">
                    로그인 페이지로 돌아가기
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage

