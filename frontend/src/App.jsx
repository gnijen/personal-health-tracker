import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import RequireAuth from "./RequireAuth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/home" element={<RequireAuth><HomePage /></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;