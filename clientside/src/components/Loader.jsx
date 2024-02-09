import React from "react";
import { Oval } from "react-loader-spinner";

const Loader = () => {
  return (
    <Oval
      visible={true}
      height="28"
      width="28"
      color="#fff"
      ariaLabel="oval-loading"
      wrapperStyle={{}}
      wrapperClass="flex justify-center"
    />
  );
};

export default Loader;
