/**
 * App 컴포넌트 테스트 파일
 *
 * 이 파일은 App 컴포넌트의 기본 렌더링 테스트를 포함합니다.
 */

import { render } from "@testing-library/react"
import App from "./App"
import { BrowserRouter } from "react-router-dom"

test("renders app without crashing", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  )
  // 기본 테스트: 앱이 충돌 없이 렌더링되는지 확인
})

