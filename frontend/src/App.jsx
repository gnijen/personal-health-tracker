import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import RequireAuth from "./RequireAuth";
import MedicinesPage from "./pages/MedicinesPage";
import AddMedicinePage from "./pages/AddMedicinePage";
import LabsPage from "./pages/LabsPage";
import AddLabPage from "./pages/AddLabPage";
import SignUpPage from "./pages/SignUpPage";
import Layout from "./Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route element={<RequireAuth><Layout /></RequireAuth>}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/medicines" element={<MedicinesPage />} />
          <Route path="/medicines/new" element={<AddMedicinePage />} />
          <Route path="/labs" element={<LabsPage />} />
          <Route path="/labs/new" element={<AddLabPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;