import { useState } from "react";
import "./App.css";
import Landing from "./pages/Landing.jsx";
import { LoginPage, SignupPage } from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Scanner from "./pages/Scanner.jsx";
import History from "./pages/History.jsx";
import About from "./pages/About.jsx";

export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);

  function navigate(target) {
    // Protect authenticated pages
    if (["dashboard", "scanner", "history", "about"].includes(target) && !user) {
      setPage("login");
      return;
    }
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleLogin(name) {
    setUser(name);
    setPage("dashboard");
  }

  function handleLogout() {
    setUser(null);
    setPage("landing");
  }

  if (page === "landing")   return <Landing onNav={navigate} />;
  if (page === "login")     return <LoginPage onNav={navigate} onLogin={handleLogin} />;
  if (page === "signup")    return <SignupPage onNav={navigate} onLogin={handleLogin} />;
  if (page === "dashboard") return <Dashboard user={user} onNav={navigate} onLogout={handleLogout} />;
  if (page === "scanner")   return <Scanner onNav={navigate} onLogout={handleLogout} />;
  if (page === "history")   return <History onNav={navigate} onLogout={handleLogout} />;
  if (page === "about")     return <About onNav={navigate} onLogout={handleLogout} />;

  return <Landing onNav={navigate} />;
}
