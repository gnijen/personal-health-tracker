import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import RequireAuth from "./RequireAuth";
import MedicinesPage from "./pages/MedicinesPage";
import AddMedicinePage from "./pages/AddMedicinePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/home" element={<RequireAuth><HomePage /></RequireAuth>} />
        <Route path="/medicines" element={<RequireAuth><MedicinesPage /></RequireAuth>} />
        <Route path="/medicines/new" element={<RequireAuth><AddMedicinePage /></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;