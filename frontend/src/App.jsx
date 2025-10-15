// frontend/App.jsx
import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AuthPage from "./pages/AuthPages";
import ChatPage from "./pages/ChatPage";
import LoadingIndicator from "./components/LoadingIndicator";
import api from "./api";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const skipInitialCheck = useRef(false); // Flag untuk skip check pertama dari AuthPage

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Skip jika user baru saja login via AuthPage
        if (skipInitialCheck.current) {
          skipInitialCheck.current = false;
          setLoading(false);
          return;
        }

        try {
          const token = await firebaseUser.getIdToken(true);
          localStorage.setItem("token", token);
          
          // Retry mechanism untuk handle race condition
          let retries = 3;
          let backendUser = null;
          
          while (retries > 0) {
            try {
              const res = await api.get("/users/me", {
                headers: { Authorization: `Bearer ${token}` },
              });
              backendUser = res.data;
              break;
            } catch (error) {
              retries--;
              if (retries === 0) throw error;
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
          
          setUser(backendUser);
        } catch (error) {
          console.error("Failed to fetch backend profile:", error);
          await signOut(auth);
          setUser(null);
        }
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleAuthSuccess = (backendUser) => {
    skipInitialCheck.current = true; // Set flag agar onAuthStateChanged tidak check ulang
    setUser(backendUser);
    navigate("/");
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          !user ? (
            <AuthPage onAuthSuccess={handleAuthSuccess} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/"
        element={
          user ? (
            <ChatPage user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/auth" />
          )
        }
      />
    </Routes>
  );
}