import React, { useEffect, useState } from "react";
import { Map, Polygon } from "react-kakao-maps-sdk";
import dataJson from "../database/sido.json";

let globalColor = [
  "#7F5A83",
  "#2E9CCA",
  "#D90429",
  "#5A3921",
  "#89ABE3",
  "#aa9030",
  "#A3628B",
  "#6A0572",
  "#F95700",
  "#1e7d74",
  "#3A89C9",
  "#194440",
  "#D00000",
  "#FF61A6",
  "#5C2751",
  "#00798C",
  "#5ce433",
  "#FFD523",
  "#7B2C3F",
  "#ADBDFF",
];

// const simplifyRegionName = (name) => {
//   if (name.includes("도")) return name.replace("도", "");
//   if (name.includes("특별시")) return name.replace("특별시", "");
//   if (name.includes("광역시")) return name.replace("광역시", "");
//   return name; // 기본적으로 원래 이름을 반환
// };
// const simplifyRegionName = (name) => {
//   // name이 문자열인지 확인
//   if (typeof name !== "string") return "";

//   if (name.includes("도")) return name.replace("도", "");
//   if (name.includes("특별시")) return name.replace("특별시", "");
//   if (name.includes("광역시")) return name.replace("광역시", "");
//   return name; // 기본적으로 원래 이름을 반환
// };

const KakaoMap = ({ onRegionClick }) => {
  const [geoList, setGeoList] = useState([]);

  useEffect(() => {
    const { features } = dataJson;

    const data = features.map((item, index) => {
      const { geometry, properties } = item;
      const { SIG_KOR_NM } = properties; // Use SIG_KOR_NM
      const { coordinates } = geometry;

      const pathList = coordinates.map((areaList) =>
        areaList.map((area) => ({
          lng: area[0],
          lat: area[1],
        }))
      );

      return {
        name: SIG_KOR_NM || `Unknown-${index}`, // Default value if SIG_KOR_NM is missing
        path: pathList,
        isHover: false,
        key: `${SIG_KOR_NM || `Unknown-${index}`}-${index}`,
      };
    });

    // console.log("GeoList:", data); // Debug output
    setGeoList(data);
  }, []);
  //   const { features } = dataJson;

  //   const data = [];

  //   for (let index = 0; index < features.length; index++) {
  //     const item = features[index];
  //     const { geometry, properties } = item;
  //     const { CTP_KOR_NM } = properties;
  //     const { coordinates } = geometry;

  //     const pathList = [];
  //     for (let areaList of coordinates) {
  //       const path = [];
  //       for (let area of areaList) {
  //         path.push({
  //           lng: area[0],
  //           lat: area[1],
  //         });
  //       }
  //       pathList.push(path);
  //     }

  //     data.push({
  //       name: CTP_KOR_NM,
  //       path: pathList,
  //       isHover: false,
  //       key: `${CTP_KOR_NM}-${index}`,
  //     });
  //   }
  //   console.log("GeoList:", data);
  //   setGeoList(data);
  // }, []);

  return (
    <div className="w-[500px] h-[500px] rounded-full">
      <Map // 지도를 표시할 Container
        center={{
          // 지도의 중심좌표
          lat: 36.3,
          lng: 127.8,
        }}
        className="w-full h-full rounded-full"
        level={13} // 지도의 확대 레벨
      >
        {geoList.map((item) => {
          const { key, path, isHover, name } = item;
          const color =
            globalColor[geoList.findIndex((geo) => geo.key === key)];
          return (
            <Polygon
              key={key}
              path={path}
              strokeWeight={2} // 선의 두께입니다
              strokeColor={color} // 선의 색깔입니다
              strokeOpacity={0.8} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
              strokeStyle={"solid"} // 선의 스타일입니다
              fillColor={isHover ? color : "#ffffff"} // 채우기 색깔입니다
              fillOpacity={0.4} // 채우기 불투명도 입니다
              onMouseover={() => {
                // 마우스 오버시 색 변경
                setGeoList((pre) =>
                  pre.map((area) => {
                    if (area.key === key) {
                      return {
                        ...area,
                        isHover: true,
                      };
                    }
                    return area;
                  })
                );
              }}
              onMouseout={() => {
                // 색 다시 reset
                setGeoList((pre) =>
                  pre.map((area) => {
                    if (area.key === key) {
                      return {
                        ...area,
                        isHover: false,
                      };
                    }
                    return area;
                  })
                );
              }}
              onClick={() => {
                // console.log("Polygon name on click:", name); // Debug output
                onRegionClick(name);
              }}
            />
          );
        })}
      </Map>
    </div>
  );
};

export default KakaoMap;
