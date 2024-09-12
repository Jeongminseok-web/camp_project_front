import React from "react";
import Navbar from "../Navbar";
import ItemPanel from "./ItemPanel";

const index = () => {
  return (
    <div className="w-[100%] h-[98vh] m-auto flex">
      <Navbar />
      <div className="w-[100%] h-full p-2 overflow-auto">
        <ItemPanel />
      </div>
    </div>
  );
};

export default index;
