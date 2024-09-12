// index.jsx
import React, { useState } from "react";
import Navbar from "../Navbar";
import LocalPanel from "./LocalPanel";

const Index = () => {
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [zoom, setZoom] = useState(10);
  const [selectedRegion, setSelectedRegion] = useState({
    lat: 37.5665,
    lng: 126.978,
    doNm: "",
    시군구명: "", // 시군구명 필드 추가
  });

  const handleRegionChange = (lat, lng, doNm, sigunguNm) => {
    setCenter({ lat, lng });
    setZoom(13);
    setSelectedRegion({
      lat,
      lng,
      doNm,
      시군구명: sigunguNm, // 선택된 시군구명을 설정
    });
  };

  return (
    <div className="w-[100%] h-[100vh] m-auto flex">
      <Navbar />
      <div className="w-[80%] h-full ml-5">
        <LocalPanel
          selectedRegion={selectedRegion}
          onRegionChange={handleRegionChange}
          center={center}
          zoom={zoom}
        />
      </div>
    </div>
  );
};

export default Index;
