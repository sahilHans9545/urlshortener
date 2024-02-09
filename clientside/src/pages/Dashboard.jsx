import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssessmentIcon from "@mui/icons-material/Assessment";
import EditUrl from "../components/EditUrl";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { backendUrl } from "../backendUrl";

const Dashboard = ({ user, setUser }) => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const getUrls = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }
      // console.log(token);
      setLoading(true);
      const response = await axios.get(`${backendUrl}/urls`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setUrls(response.data.result);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Authentication Failed");
        setUser({});
        localStorage.removeItem("authToken");
        navigate("/login");
      }
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUrls();
  }, [user]);
  const [url, setUrl] = useState("");
  const handleEdit = (inputUrl) => {
    setUrl(inputUrl);
  };

  const deleteUrl = async (urlId) => {
    try {
      const token = localStorage.getItem("authToken");
      console.log(token);
      console.log(urlId);
      const response = await axios.post(
        `${backendUrl}/deleteUrl`,
        { id: urlId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedUrls = urls.filter((item) => item._id !== urlId);
      setUrls(updatedUrls);
      toast.success("Url deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen ">
      <Header user={user} setUser={setUser} />
      {url ? (
        <EditUrl url={url} setUrl={setUrl} urls={urls} setUrls={setUrls} />
      ) : (
        ""
      )}
      <div className="px-4 lg:px-[8%] w-full">
        <h1 className="text-white text-xl md:text-2xl font-medium pb-5 mt-12 md:mt-16">
          Your shortened URLs
        </h1>
        {loading && <Loader />}
        {!loading && urls.length && (
          <table className="text-white flow-root border-1 dashboardTable text-[15px] lg:text-base  overflow-auto ">
            <thead>
              <tr>
                <th className="px-3 py-2">S.no</th>
                <th className="px-3 py-2">Redirect Url</th>
                <th className="px-3 py-2"> short Url</th>
                <th className="px-3 py-2">Edit</th>
                <th className="px-3 py-2">Delete</th>
                <th className="px-3 py-2"> Analytics</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url, index) => {
                return (
                  <tr key={index}>
                    <td className="py-2">{index + 1}</td>
                    <td className="py-2">
                      <a
                        href={url.realUrl}
                        target="_blank"
                        className="text-blue-300 hover:text-blue-200"
                        rel="noreferrer"
                      >
                        {url.realUrl}
                      </a>{" "}
                    </td>
                    <td className="py-2">
                      <a
                        href={`${backendUrl}/${url.shortId}`}
                        className=" px-2 py-1 rounded-md text-sm"
                      >
                        {" "}
                        {`${backendUrl}/${url.shortId}`}
                      </a>
                    </td>
                    <td className="py-2">
                      <span
                        className="cursor-pointer"
                        onClick={() => handleEdit(url)}
                      >
                        <EditIcon />
                      </span>
                    </td>
                    <td className="py-2">
                      <span
                        className="cursor-pointer"
                        onClick={() => deleteUrl(url._id)}
                      >
                        <DeleteIcon />
                      </span>
                    </td>
                    <td className="py-2">
                      <span className="cursor-pointer">
                        <Link to={`/analytics/${url._id}`}>
                          <AssessmentIcon />
                        </Link>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
