import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../backendUrl";

const Analytics = ({ user, setUser }) => {
  const { urlId } = useParams();
  const [analytics, setAnalytics] = useState("");
  const navigate = useNavigate();

  const getAnalytics = async () => {
    try {
      const token = localStorage.getItem("authToken");
      // console.log(token);
      const response = await axios.get(`${backendUrl}/analytics/${urlId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAnalytics(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Authentication Failed");
        setUser({});
        localStorage.removeItem("authToken");
        navigate("/login");
      }
      toast.error(error.response?.data?.message);
    }
  };
  useEffect(() => {
    getAnalytics();
  }, [urlId]);
  return (
    <div className="min-h-screen text-white">
      <Header user={user} setUser={setUser} />
      <div className="mt-11 p-5 flex flex-col items-center">
        <p className="text-xl md:text-3xl ">
          {backendUrl}/{analytics.shortId}
        </p>
        <div className="bg-blue-700 px-7 py-2 mt-6 rounded-md">
          Total clicks on Url :- {analytics?.totalClicks}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
