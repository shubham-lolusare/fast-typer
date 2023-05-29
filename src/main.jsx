import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
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

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />}>
      <Route index element={<HomePage />} />
    </Route>
  )
);

// configuring the dark store
if (localStorage.getItem("theme") === "dark")
  document.documentElement.classList.add("dark");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
