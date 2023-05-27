import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Page1 from "./page1.jsx";
import Page2 from "./page2.jsx";
import Error from "./error.jsx";
import "./index.css";
import {
  createHashRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<Error />}>
      <Route index element={<Page1 />} />
      <Route path="page2" element={<Page2 />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
