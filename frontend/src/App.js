import "./App.css";
import "react-router-dom";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import BannerPage from "./pages/BannerPage/BannerPage";
import { useContext } from "react";
import AuthContext from "./store/auth-context";

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <Routes>
      {!authCtx.isLoggedIn && <Route path="/login" element={<LoginPage />} />}
      {authCtx.isLoggedIn && <Route path="/banners" element={<BannerPage />} />}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
