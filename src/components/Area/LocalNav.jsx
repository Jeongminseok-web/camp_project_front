import React, { useState, useEffect } from "react";

const LocalNav = ({ onRegionChange }) => {
  const [regionData, setRegionData] = useState([]);
  const [doNmOptions, setDoNmOptions] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState({});

  useEffect(() => {
    const fetchRegionData = async () => {
      const url = `https://apis.data.go.kr/B551011/GoCamping/basedList?numOfRows=4000&MobileOS=ETC&MobileApp=camp&serviceKey=3tarJeicxWx1WR%2FDbmAPR9PexoyQb0fzEGJUC1BBu%2BTkihK1IJo1XOTJdVEwqPDSV99EGGyK3WUtzrGl57pJZw%3D%3D&_type=json`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (
          data.response &&
          data.response.body &&
          data.response.body.items &&
          data.response.body.items.item
        ) {
          const items = data.response.body.items.item;

          // doNm 중복 제거 및 가나다 순 정렬
          const doNmSet = new Set(items.map((item) => item.doNm));
          const sortedDoNmOptions = [...doNmSet].sort(); // 가나다 순으로 정렬
          setDoNmOptions(sortedDoNmOptions);

          setRegionData(items);
        } else {
          console.error("API 응답 구조가 예상과 다릅니다.");
        }
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchRegionData();
  }, []);

  const handleSigunguChange = (doNm, e) => {
    const selectedSigunguNm = e.target.value;
    setSelectedRegions((prevState) => ({
      ...prevState,
      [doNm]: selectedSigunguNm,
    }));

    const filteredRegions = regionData.filter(
      (item) => item.doNm === doNm && item.sigunguNm === selectedSigunguNm
    );

    if (filteredRegions.length > 0) {
      // 가장 첫 번째 항목을 사용해 지도 확대
      const region = filteredRegions[0];
      const lat = parseFloat(region.mapY);
      const lng = parseFloat(region.mapX);

      console.log(`지도 확대: ${lat}, ${lng}, ${doNm}, ${selectedSigunguNm}`);

      onRegionChange(lat, lng, doNm, selectedSigunguNm);
    }
  };

  return (
    <div className="overflow-x-auto whitespace-nowrap py-2 mt-12 flex w-full">
      {doNmOptions.map((doNm, index) => (
        <div key={index} className="mx-2 mt-4">
          <div>
            <select
              value={selectedRegions[doNm] || ""}
              onChange={(e) => handleSigunguChange(doNm, e)}
              className="text-center w-40 inline-block"
            >
              <option value="">{doNm}</option>
              {[
                ...new Set(
                  regionData
                    .filter((item) => item.doNm === doNm)
                    .map((item) => item.sigunguNm)
                ),
              ] // 시/군/구 중복 제거 및 가나다 순 정렬
                .sort()
                .map((sigunguNm, idx) => (
                  <option key={idx} value={sigunguNm}>
                    {sigunguNm}
                  </option>
                ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LocalNav;
