// LocalItem.jsx
import React, { useEffect, useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDeleteItemData,
  fetchGetItemsData,
  fetchPostItemData,
} from "../../redux/slices/apiSlice";
import { toast } from "react-toastify";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";

const LocalItem = ({ camping, openModal }) => {
  const defaultImage = process.env.PUBLIC_URL + "/campimg.png";

  const [isAddMap, setIsAddMap] = useState({});
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.authData);
  const googleId = user?.sub;

  // 컴포넌트가 처음 렌더링될 때 로컬 저장소에서 캠핑장 상태 불러오기
  useEffect(() => {
    const savedIsAddMap = JSON.parse(localStorage.getItem("isAddMap")) || {};
    setIsAddMap(savedIsAddMap);
  }, []);

  useEffect(() => {
    // 로그아웃하거나 googleId가 없을 때 isAddMap 초기화
    if (!googleId) {
      setIsAddMap({});
      localStorage.removeItem("isAddMap");
    } else {
      // googleId가 존재할 때 데이터베이스에서 데이터 가져와서 상태 업데이트
      dispatch(fetchGetItemsData(googleId)).then((result) => {
        const visitedCampgrounds = result.payload;
        const updatedIsAddMap = {};
        // 인기 캠핑장 데이터와 비교하여 isAddMap 상태를 설정
        visitedCampgrounds.forEach((campground) => {
          if (campground.name === camping.facltNm) {
            updatedIsAddMap[camping.facltNm] = true;
          }
        });

        setIsAddMap((prevState) => ({
          ...prevState,
          ...updatedIsAddMap,
        }));
        localStorage.setItem("isAddMap", JSON.stringify(updatedIsAddMap));
      });
    }
  }, [dispatch, googleId, camping.facltNm]);

  const changeAdd = async (selectedItem) => {
    if (!googleId) {
      toast.error("로그인이 필요한 서비스입니다.");
      return;
    }

    if (!selectedItem) {
      console.error("캠핑장 정보가 없습니다.");
      toast.error("캠핑장 정보가 없습니다.");
      return;
    }
    console.log("currentCamping:", selectedItem.facltNm); // 현재 캠핑장 정보 확인
    console.log("currentCamping.id:", selectedItem.id); // ID 확인

    const isCurrentlyAdded = isAddMap[selectedItem.facltNm];

    if (isCurrentlyAdded) {
      // 채워진 하트 클릭 시 캠핑장 삭제
      const confirm = window.confirm("캠핑장을 삭제하시겠습니까?");
      if (!confirm) return;

      try {
        console.log("캠핑장 삭제 시도");
        await dispatch(fetchDeleteItemData(selectedItem.facltNm)).unwrap();
        // await dispatch(fetchGetItemsData()).unwrap();
        toast.success("캠핑장이 삭제되었습니다.");
        setIsAddMap((prevState) => {
          const updatedState = { ...prevState, [selectedItem.facltNm]: false };
          localStorage.setItem("isAddMap", JSON.stringify(updatedState));
          return updatedState;
        });
      } catch (error) {
        toast.error("캠핑장 삭제에 실패했습니다.");
        console.error(error);
      }
    } else {
      // 빈 하트 클릭 시 캠핑장 추가
      const updateAddData = {
        name: selectedItem.facltNm,
        location: selectedItem.addr1,
        image: selectedItem.firstImageUrl || "No Image",
        isadd: true,
        googleId: user?.sub,
      };

      try {
        console.log("캠핑장 추가 시도");
        console.log(updateAddData);
        await dispatch(fetchPostItemData(updateAddData)).unwrap();
        toast.success("캠핑장을 추가하였습니다.");
        setIsAddMap((prevState) => {
          const updatedState = { ...prevState, [selectedItem.facltNm]: true };
          localStorage.setItem("isAddMap", JSON.stringify(updatedState));
          return updatedState;
        });
      } catch (error) {
        toast.error("캠핑장 추가에 실패했습니다.");
        console.error("Error updating data:", error);
      }
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-md p-3 relative overflow-auto">
      <h3 className="text-lg font-bold mb-2 flex justify-between">
        {camping.facltNm}
        <button onClick={() => openModal(camping)} className="text-cyan-600">
          <CiSquarePlus />
        </button>
      </h3>
      <img
        src={camping.firstImageUrl ? camping.firstImageUrl : defaultImage}
        className="w-full h-auto max-h-[200px] border-none rounded-lg"
        alt={camping.facltNm}
      />

      <p className="mt-3">주소: {camping.addr1}</p>
      <p className="mt-3">전화번호: {camping.tel}</p>
      <button
        className="absolute bottom-1 right-1 text-xl"
        onClick={() => changeAdd(camping)}
      >
        {isAddMap[camping.facltNm] ? (
          <FaHeart style={{ color: "red" }} />
        ) : (
          <FaRegHeart style={{ color: "red" }} />
        )}
      </button>
    </div>
  );
};

export default LocalItem;
