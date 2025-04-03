/**
 * 폼 유효성 검사 유틸리티
 *
 * 이 파일은 로그인, 회원가입, 비밀번호 찾기 등의 폼에서 사용되는
 * 유효성 검사 함수들을 제공합니다.
 */

/**
 * 이메일 유효성 검사
 * @param {string} email - 검사할 이메일 주소
 * @returns {boolean} 유효한 이메일인지 여부
 */
export const isValidEmail = (email) => {
  // 기본적인 이메일 형식 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 비밀번호 유효성 검사
 * @param {string} password - 검사할 비밀번호
 * @returns {boolean} 유효한 비밀번호인지 여부
 */
export const isValidPassword = (password) => {
  // 비밀번호는 6~12자리로 제한
  return password.length >= 6 && password.length <= 12
}

/**
 * 비밀번호 확인 일치 검사
 * @param {string} password - 원래 비밀번호
 * @param {string} confirmPassword - 확인용 비밀번호
 * @returns {boolean} 두 비밀번호가 일치하는지 여부
 */
export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword
}

/**
 * 사용자 이름 유효성 검사
 * @param {string} username - 검사할 사용자 이름
 * @returns {boolean} 유효한 사용자 이름인지 여부
 */
export const isValidUsername = (username) => {
  // 사용자 이름은 최소 3자 이상, 특수문자 없이
  const usernameRegex = /^[a-zA-Z0-9가-힣]{3,20}$/
  return usernameRegex.test(username)
}

/**
 * 전화번호 유효성 검사
 * @param {string} phone - 검사할 전화번호
 * @returns {boolean} 유효한 전화번호인지 여부
 */
export const isValidPhone = (phone) => {
  // 한국 전화번호 형식 (010-1234-5678 또는 01012345678)
  const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/
  return phoneRegex.test(phone)
}

/**
 * 나이 유효성 검사
 * @param {string|number} age - 검사할 나이
 * @returns {boolean} 유효한 나이인지 여부
 */
export const isValidAge = (age) => {
  const ageNum = Number(age)
  return !isNaN(ageNum) && ageNum > 0 && ageNum < 30 // 반려견 나이 제한
}

/**
 * 필수 입력 필드 검사
 * @param {string} value - 검사할 값
 * @returns {boolean} 값이 비어있지 않은지 여부
 */
export const isNotEmpty = (value) => {
  return value.trim() !== ""
}

/**
 * 폼 전체 유효성 검사
 * @param {Object} form - 폼 데이터 객체
 * @param {Array} requiredFields - 필수 필드 배열
 * @returns {boolean} 폼이 유효한지 여부
 */
export const isFormValid = (form, requiredFields) => {
  // 모든 필수 필드가 비어있지 않은지 확인
  for (const field of requiredFields) {
    if (!isNotEmpty(form[field])) {
      return false
    }
  }

  // 이메일 필드가 있으면 유효성 검사
  if (form.email && !isValidEmail(form.email)) {
    return false
  }

  // 비밀번호 필드가 있으면 유효성 검사
  if (form.password && !isValidPassword(form.password)) {
    return false
  }

  // 비밀번호 확인 필드가 있으면 일치 검사
  if (form.password && form.confirmPassword && !doPasswordsMatch(form.password, form.confirmPassword)) {
    return false
  }

  // 사용자 이름 필드가 있으면 유효성 검사
  if (form.username && !isValidUsername(form.username)) {
    return false
  }

  // 전화번호 필드가 있으면 유효성 검사
  if (form.phone && !isValidPhone(form.phone)) {
    return false
  }

  // 반려견 나이 필드가 있으면 유효성 검사
  if (form.petAge && !isValidAge(form.petAge)) {
    return false
  }

  return true
}

/**
 * 폼 에러 메시지 생성
 * @param {Object} form - 폼 데이터 객체
 * @returns {Object} 필드별 에러 메시지 객체
 */
export const getFormErrors = (form) => {
  const errors = {}

  if (form.username && !isValidUsername(form.username)) {
    errors.username = "사용자 이름은 3~20자의 영문, 숫자, 한글만 가능합니다."
  }

  if (form.email && !isValidEmail(form.email)) {
    errors.email = "유효한 이메일 주소를 입력해주세요."
  }

  if (form.password && !isValidPassword(form.password)) {
    errors.password = "비밀번호는 6~12자리로 입력해주세요."
  }

  if (form.password && form.confirmPassword && !doPasswordsMatch(form.password, form.confirmPassword)) {
    errors.confirmPassword = "비밀번호가 일치하지 않습니다."
  }

  if (form.phone && !isValidPhone(form.phone)) {
    errors.phone = "유효한 전화번호를 입력해주세요. (예: 010-1234-5678)"
  }

  if (form.petAge && !isValidAge(form.petAge)) {
    errors.petAge = "유효한 나이를 입력해주세요."
  }

  return errors
}

