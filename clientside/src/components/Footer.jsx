import React from "react";
import Coding from "../images/coding.png";
const Footer = () => {
  return (
    <div className=" text-white bg-[#020b2b] fixed bottom-0 p-1 pb-2 w-full font-semibold flex justify-center gap-2 items-center text-sm md:text-base ">
      <img src={Coding} alt="" className="w-[32px]" /> created by Sahil Hans
    </div>
  );
};

export default Footer;
