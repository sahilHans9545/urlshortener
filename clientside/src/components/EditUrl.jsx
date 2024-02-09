import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import { backendUrl } from "../backendUrl";

const EditUrl = ({ url, setUrl, urls, setUrls }) => {
  const inputElement = useRef();
  const [loading, setLoading] = useState(false);

  const focusInput = () => {
    inputElement.current.focus();
  };

  const updateUrl = async () => {
    setUrl("");
    try {
      const token = localStorage.getItem("authToken");
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/editUrl`,
        { id: url._id, newUrl: url.realUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUrls((prevData) =>
        prevData.map((item) =>
          item._id === url._id
            ? {
                ...item,
                realUrl: response.data.url.realUrl,
                shortId: response.data.url.shortId,
              }
            : item
        )
      );
      toast.success("Url Updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    focusInput();
  }, []);
  const editUrlFunc = () => {
    setUrl("");
  };
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-[500px] max-w-[90%]  p-4">
      <input
        type="text"
        value={url.realUrl}
        className="w-full py-2 px-3 bg-blue-100 rounded-sm"
        ref={inputElement}
        onChange={(e) => setUrl({ ...url, realUrl: e.target.value })}
      />
      <div className="flex gap-2 justify-end items-center mt-4">
        {loading ? (
          <Oval
            visible={true}
            height="28"
            width="28"
            color="#fff"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        ) : (
          <button
            className="text-white bg-[#69a52a] py-1 px-3"
            onClick={updateUrl}
          >
            Save{" "}
          </button>
        )}
        <button
          className="text-white bg-red-600 py-1 px-3 "
          onClick={editUrlFunc}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EditUrl;
