import React from "react"
import ReactDOM from "react-dom/client"
import "./styles/index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { BrowserRouter } from "react-router-dom"

// React 애플리케이션의 진입점
// BrowserRouter로 App 컴포넌트를 감싸 라우팅 기능 활성화
const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  // </React.StrictMode>,
)

reportWebVitals()

