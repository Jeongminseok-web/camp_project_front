import React, { useEffect, useState } from "react";
const { kakao } = window;

const Map = () => {
  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(36.5, 128.25),
      level: 13,
    };
    const map = new kakao.maps.Map(container, options);
  }, []);

  return (
    <div
      id="map"
      className="rounded-[100%]"
      style={{
        width: "500px",
        height: "500px",
      }}
    ></div>
  );
};

export default Map;
