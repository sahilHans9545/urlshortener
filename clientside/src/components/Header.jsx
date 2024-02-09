import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { toast } from "react-toastify";

const Header = ({ user, setUser }) => {
  const [toggleLogout, setToggleLogout] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    toast("logout successfully");
    setUser({ isLoggedIn: false });
    navigate("/login");
  };
  return (
    <div className=" text-white py-4 shadow-md bg-[#69a52a]">
      <ul className="flex list-none  justify-center items-center text-sm md:text-base">
        <li className="px-4 sm:px-6  font-medium">
          {" "}
          <Link to="/">Home</Link>
        </li>
        <li className="px-4 sm:px-6  font-medium">
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li className="px-4 sm:px-6  font-medium relative">
          Hello {user.userData?.username}!{" "}
          <span
            className="cursor-pointer"
            onClick={() => setToggleLogout(!toggleLogout)}
          >
            <ArrowDropDownIcon />
          </span>
          {toggleLogout && (
            <div
              className="absolute top-[110%] left-0 bg-white text-gray-700 px-11 py-2 cursor-pointer"
              onClick={handleLogout}
            >
              {" "}
              Log out
            </div>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Header;
