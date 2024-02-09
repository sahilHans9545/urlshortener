import React, { useState } from "react";
import Banner from "../images/banner.png";
import Close from "../images/close.png";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Logo from "../images/logo.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { backendUrl } from "../backendUrl";

const Home = ({ user, setUser }) => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleInputUrl = (e) => {
    setShortUrl("");
    setUrl(e.target.value);
  };

  const shortenUrl = async () => {
    try {
      if (!url) {
        toast.error("Url can't be empty! ");
        return;
      }
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/getShortUrl`,
        {
          url,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShortUrl(`${backendUrl}/${response.data?.id}`);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Authentication Failed");
        setUser({});
        localStorage.removeItem("authToken");
        navigate("/login");
      }
      toast.error(error.response?.data?.message);
      // console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (e) => {
    let element = document.getElementById("shortUrl");

    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    e.target.innerHTML = `<span style="color:green">copied! </span>`;

    navigator.clipboard.writeText(element.innerText);
  };

  return (
    <div>
      <Header user={user} setUser={setUser} />
      <div className="py-12  pt-8 sm:pt-6 md:pt-12 flex flex-col items-center text-white">
        <img src={Logo} alt="" className="w-20 pb-1" />
        <h1 className=" text-2xl md:text-4xl  font-semibold  border-b-white border-b-2">
          URL Shortener
        </h1>

        <p className="pt-1 text-sm md:text-base">
          Generate concise links instantly.
        </p>
        <div className="flex flex-col lg:flex-row w-full px-4 lg:px-9 xl:px-[12%] justify-center items-center">
          <img
            src={Banner}
            alt=""
            className="w-[200px] sm:hidden md:inline-block lg:w-[350px] xl:w-[450px]"
          />
          <div className="w-full md:w-[72%] lg:w-full flex-1  ">
            <div className=" flex flex-col-reverse md:flex-row gap-3 justify-center items-end md:items-center">
              <div className="w-full md:w-auto flex-1">
                <input
                  type="text"
                  placeholder="Enter link here"
                  className="text-black py-2 md:py-3 px-4 w-full rounded-md"
                  value={url}
                  onChange={handleInputUrl}
                />
              </div>

              {loading ? (
                <Loader />
              ) : (
                <button
                  className="text-white px-3 rounded-md py-2 md:py-3 bg-[#69a52a] max-w-fit text-sm md:text-base"
                  onClick={shortenUrl}
                >
                  Shorten URL
                </button>
              )}
            </div>
            <div className="mt-4">
              {shortUrl && (
                <ul
                  className="flex flex-col gap-2 max-h-60 overflow-auto "
                  id="shortURLs"
                >
                  <li className="bg-white text-slate-900 px-4 py-2 md:py-3 rounded">
                    <a
                      href={`${shortUrl}`}
                      className="text-[#69a52a] font-medium"
                      id="shortUrl"
                    >
                      {shortUrl}
                    </a>
                    <div className="flex items-center float-right">
                      <span
                        className="text-blue-600  cursor-pointer "
                        onClick={handleCopy}
                      >
                        copy
                      </span>
                      <span className="ps-3 ">
                        <img
                          src={Close}
                          alt=""
                          className="w-3 cursor-pointer"
                          onClick={() => setShortUrl("")}
                        />
                      </span>
                    </div>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
