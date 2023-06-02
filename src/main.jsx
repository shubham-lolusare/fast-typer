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
import App from "./App.jsx";
import ErrorPage from "./components/ErrorPage/ErrorPage.jsx";
import HomePage from "./components/HomePage/HomePage.jsx";
import TypingTestPage from "./components/TypingTestPage/TypingTestPage";
import Profile from "./components/Profile/Profile";
import Compare from "./components/Compare/Compare";

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />}>
      <Route index element={<HomePage />} />
      <Route path="test" element={<TypingTestPage />} />
      <Route path="profile" element={<Profile />} />
      <Route path="compare" element={<Compare />} />
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
