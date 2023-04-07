import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

import RequireAuth from "./pages/Protected";
import Authentication from "./pages/Login";
import Transcription from "./pages/Transcription";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Authentication />} />
        <Route index element={
          <RequireAuth>
            <Transcription />
          </RequireAuth>
        } />
        <Route path="*" element={<Navigate to={"/"} replace={true} />} />
      </Routes>
    </Router>
  );
}
