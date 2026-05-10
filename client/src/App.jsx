import { Routes, Route } from "react-router-dom";

import SignInSide from "./pages/SignInSide";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Rooms from "./pages/Rooms";
import EditorRoom from "./pages/EditorRoom";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Routes>

      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<SignInSide />} />

      <Route path="/register" element={<SignUp />} />

      <Route path="/rooms" element={
          <ProtectedRoute>
            <Rooms />
          </ProtectedRoute>
        }
      />

      <Route path="/editor/:roomId" element={
          <ProtectedRoute>
            <EditorRoom />
            </ProtectedRoute>
          }
      />

    </Routes>
  );
}

export default App;