
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Feed from "@/pages/Feed";
import Register from "@/pages/auth/Register";
import Login from "@/pages/auth/Login";
import UserDashboard from "@/pages/UserDashboard";
import MemeDetail from "@/pages/MemeDetail";
import MemeCreator from "@/pages/MemeCreator";
import EditMeme from "@/pages/EditMeme";
import Profile from "@/pages/Profile";
import UserProfile from "@/pages/UserProfile";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/meme/:id" element={<MemeDetail />} />
            <Route path="/create" element={<MemeCreator />} />
            <Route path="/edit/:id" element={<EditMeme />} />
            <Route path="/user/:userId" element={<Profile />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </Router>
        <Toaster position="top-center" richColors closeButton />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
