import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "./backendUrl";

function App() {
  const [user, setUser] = useState({ isLoggedIn: false, userData: {} });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getUser();
  }, []);
  const getUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      console.log(token);
      const response = await axios.get(`${backendUrl}/user/getUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser({
        isLoggedIn: true,
        userData: {
          username: response.data.username,
          enail: response.data.email,
          userId: response.data._id,
        },
      });
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="App flex flex-col bg-[#020b2b] min-h-screen justify-center">
      <ToastContainer />
      {!loading && (
        <Router>
          <Routes>
            <Route
              exact
              path="/"
              element={
                user.isLoggedIn ? (
                  <div className="flex-1 ">
                    <Home user={user} setUser={setUser} />{" "}
                  </div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            ></Route>
            <Route
              path="/dashboard"
              element={
                user.isLoggedIn === true ? (
                  <Dashboard user={user} setUser={setUser} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            ></Route>
            <Route
              path="/analytics/:urlId"
              element={<Analytics user={user} setUser={setUser} />}
            ></Route>
            <Route
              path="/login"
              element={<Login user={user} setUser={setUser} />}
            ></Route>
            <Route
              path="/Signup"
              element={<Signup user={user} setUser={setUser} />}
            ></Route>
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
