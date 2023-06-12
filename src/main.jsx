import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// importing contexts provider components
import { ThemeProvider } from "./contexts/Theme";

// importing react-router methods
import {
  createHashRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";

// importing components for the Router
import App from "./App";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import HomePage from "./components/HomePage/HomePage";
import TypingTestPage from "./components/TypingTestPage/TypingTestPage";
import Profile from "./components/Profile/Profile";
import Analysis from "./components/Analysis/Analysis";
import Feedback from "./components/FeedbackPage/FeedbackPage";

// Since browser router is not supported by git hub we are using the has router
const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />}>
      <Route index element={<HomePage />} />
      <Route path="test" element={<TypingTestPage />} />
      <Route path="profile" element={<Profile />} />
      <Route path="analysis" element={<Analysis />} />
      <Route path="feedback" element={<Feedback />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
