import React from 'react'; // 👈 이 줄이 반드시 추가되어야 합니다!
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// React.StrictMode를 사용하여 더 엄격하게 에러를 체크합니다.
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)