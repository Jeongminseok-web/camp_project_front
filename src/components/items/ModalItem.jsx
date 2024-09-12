import React, { useCallback, useEffect, useState } from "react";
import { IoIosArrowDropleft } from "react-icons/io";
import { IoIosArrowDropright } from "react-icons/io";
import { FaRegCircle } from "react-icons/fa";
import { FaCircle } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";

import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchDeleteItemData,
  fetchPostItemData,
} from "../../redux/slices/apiSlice";
import { BeatLoader, DotLoader } from "react-spinners";

const ModalItem = ({ selectedRegion, onClose, areas }) => {
  const [data, setData] = useState([]);
  // const [selectedRegion, setSelectedRegion] = useState("강원");
  const [selectedCampings, setSelectedCampings] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();
  const [isAddMap, setIsAddMap] = useState({});
  const defaultImage = process.env.PUBLIC_URL + "/campimg.png";

  const user = useSelector((state) => state.auth.authData);
  // console.log(user); // authData 전체 구조를 확인합니다.
  const googleId = user?.sub;
  // console.log(googleId); // googleId가 제대로 나오는지 확인합니다.

  // 데이터 가져오는 함수
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(
        "https://apis.data.go.kr/B551011/GoCamping/basedList?numOfRows=4000&MobileOS=ETC&MobileApp=camp&serviceKey=3tarJeicxWx1WR%2FDbmAPR9PexoyQb0fzEGJUC1BBu%2BTkihK1IJo1XOTJdVEwqPDSV99EGGyK3WUtzrGl57pJZw%3D%3D&_type=json"
      );
      const result = await response.json();
      setData(result.response.body.items.item);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);
  // console.log(data);

  // 컴포넌트가 마운트될 때 실행되는 부분
  useEffect(() => {
    fetchData();
    // 데이터 가져오는 함수 호출
  }, [fetchData]);

  // areas 객체가 업데이트 될 때 isAdd 상태 업데이트
  useEffect(() => {
    if (areas) {
      const initialIsAddMap = {};
      areas.forEach((area) => {
        initialIsAddMap[area.facltNm] = area.isAdd || false;
      });
      setIsAddMap(initialIsAddMap);
      setSelectedCampings(areas);
      setCurrentIndex(0);
    }
  }, [areas]);

  // console.log(data);
  // const filteredData = data.filter(
  //   (item) => item.addr1 && item.addr1.includes(selectedRegion)
  // );
  // console.log(filteredData);
  useEffect(() => {
    if (data.length > 0 && selectedRegion) {
      const filteredData = data.filter(
        (item) => item.addr1 && item.addr1.includes(selectedRegion)
      );
      // console.log(filteredData);
      if (filteredData.length > 0) {
        const randomIndices = [];
        while (
          randomIndices.length < 5 &&
          randomIndices.length < filteredData.length
        ) {
          const randomIndex = Math.floor(Math.random() * filteredData.length);
          if (!randomIndices.includes(randomIndex)) {
            randomIndices.push(randomIndex);
          }
        }
        const campings = randomIndices.map((index) => filteredData[index]);
        // 상태 업데이트 로직 추가
        setSelectedCampings((prevCampings) => {
          if (prevCampings.length === 0) {
            return campings;
          }
          return prevCampings;
        });
        setCurrentIndex(0);
      } else {
        setSelectedCampings([]);
        setCurrentIndex(0);
      }
    }
  }, [data, selectedRegion]);

  // console.log(selectedRegion);
  // console.log("Selected Campings:", selectedCampings);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? selectedCampings.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === selectedCampings.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentCamping = selectedCampings[currentIndex];
  const isCurrentAdd = currentCamping
    ? isAddMap[currentCamping.facltNm]
    : false;
  // 하트 클릭 시 호출되는 함수

  const changeAdd = async () => {
    if (!currentCamping) {
      console.error("캠핑장 정보가 없습니다.");
      toast.error("캠핑장 정보가 없습니다.");
      return;
    }
    console.log("currentCamping:", currentCamping.facltNm); // 현재 캠핑장 정보 확인
    console.log("currentCamping.id:", currentCamping.id); // ID 확인

    if (isCurrentAdd) {
      // 채워진 하트 클릭 시 캠핑장 삭제
      const confirm = window.confirm("캠핑장을 삭제하시겠습니까?");
      if (!confirm) return;

      try {
        console.log("캠핑장 삭제 시도");
        await dispatch(fetchDeleteItemData(currentCamping.facltNm)).unwrap();
        // await dispatch(fetchGetItemsData()).unwrap();

        toast.success("캠핑장이 삭제되었습니다.");
        setIsAddMap((prev) => ({
          ...prev,
          [currentCamping.facltNm]: false,
        }));
      } catch (error) {
        toast.error("캠핑장 삭제에 실패했습니다.");
        console.error(error);
      }
    } else {
      // 빈 하트 클릭 시 캠핑장 추가
      const updateAddData = {
        name: currentCamping.facltNm,
        location: currentCamping.addr1,
        image: currentCamping.firstImageUrl || "No Image",
        isadd: true,
        googleId: user?.sub,
      };

      try {
        console.log("캠핑장 추가 시도");
        console.log(updateAddData);
        await dispatch(fetchPostItemData(updateAddData)).unwrap();

        toast.success("캠핑장을 추가하였습니다.");
        setIsAddMap((prev) => ({
          ...prev,
          [currentCamping.facltNm]: true,
        }));
      } catch (error) {
        toast.error("캠핑장 추가에 실패했습니다.");
        console.error("Error updating data:", error);
      }
    }
  };

  // console.log("Areas:", areas);
  // console.log("Areas in Parent:", areas);
  // console.log("Selected Campings Updated:", selectedCampings);

  useEffect(() => {
    console.log("Selected Campings Updated:", selectedCampings);
  }, [selectedCampings]);

  return (
    <div
      // onClick={onClose}
      className="fixed w-full h-full left-0 top-0 bg-black bg-opacity-50 z-50"
    >
      <div className="w-full h-full flex justify-center items-center relative">
        <button onClick={handlePrevious}>
          <IoIosArrowDropleft className="text-6xl text-white" />
        </button>
        <div
          className="border border-gray-200 bg-white w-[30%] h-[70vh] overflow-auto p-2 relative
        flex flex-col justify-between rounded-md"
        >
          <div>
            {currentCamping ? (
              <div className="p-2">
                <div className="flex pb-2 mb-2 justify-between border-b border-neutral-400">
                  <img
                    src={
                      currentCamping.firstImageUrl
                        ? currentCamping.firstImageUrl
                        : defaultImage
                    }
                    alt={currentCamping.facltNm}
                    className="w-1/2 h-auto border-none rounded-lg"
                  />
                  <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-2xl"
                  >
                    <IoMdCloseCircle />
                  </button>
                </div>
                <h2 className="text-3xl my-3">{currentCamping.facltNm}</h2>
                <div className="flex flex-col gap-y-5">
                  {currentCamping.addr1 ? (
                    <p className="">오시는길 : {currentCamping.addr1}</p>
                  ) : (
                    ""
                  )}
                  {currentCamping.tel ? (
                    <p>전화번호 : {currentCamping.tel}</p>
                  ) : (
                    ""
                  )}
                  {currentCamping.sbrsCl ? (
                    <p>편의 시설 : {currentCamping.sbrsCl}</p>
                  ) : (
                    ""
                  )}
                  {currentCamping.featureNm ? (
                    <p>캠핑장 특징 : {currentCamping.featureNm}</p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-[65vh] w-full">
                <BeatLoader color="#22d3ee" loading size={10} />
              </div>
            )}
          </div>
          <div className="flex justify-between items-center mt-2">
            <div></div>
            <div className="flex gap-x-2">
              {selectedCampings.map((_, index) => (
                <div
                  key={index}
                  className={`cursor-pointer ${
                    index === currentIndex ? "text-black" : "text-gray-500"
                  }`}
                >
                  {index === currentIndex ? <FaCircle /> : <FaRegCircle />}
                </div>
              ))}
            </div>

            <button className="text-xl" onClick={changeAdd}>
              {isCurrentAdd ? (
                <FaHeart style={{ color: "red" }} />
              ) : (
                <FaRegHeart style={{ color: "red" }} />
              )}
            </button>
          </div>
        </div>

        <button onClick={handleNext}>
          <IoIosArrowDropright className="text-6xl text-white" />
        </button>
      </div>
    </div>
  );
};

export default ModalItem;
