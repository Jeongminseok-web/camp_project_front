// HotItem.jsx
import React from 'react';
import { CiSquarePlus } from 'react-icons/ci';
import { useState, useEffect } from 'react';

import { FaRegHeart } from 'react-icons/fa6';
import { FaHeart } from 'react-icons/fa6';

import {
  fetchDeleteItemData,
  fetchGetItemsData,
  fetchPostItemData,
} from '../../redux/slices/apiSlice';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

const HotItem = ({ item, index, indexOfFirstItem, openModal }) => {
  const [isAddMap, setIsAddMap] = useState({});
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.authData);
  const googleId = user?.sub;

  // 컴포넌트가 처음 렌더링될 때 로컬 저장소에서 캠핑장 상태 불러오기
  useEffect(() => {
    const savedIsAddMap = JSON.parse(localStorage.getItem('isAddMap')) || {};
    setIsAddMap(savedIsAddMap);
  }, []);

  useEffect(() => {
    // 로그아웃하거나 googleId가 없을 때 isAddMap 초기화
    if (!googleId) {
      setIsAddMap({});
      localStorage.removeItem('isAddMap');
    } else {
      // googleId가 존재할 때 데이터베이스에서 데이터 가져와서 상태 업데이트
      dispatch(fetchGetItemsData(googleId)).then((result) => {
        const visitedCampgrounds = result.payload;
        const updatedIsAddMap = {};
        // 인기 캠핑장 데이터와 비교하여 isAddMap 상태를 설정
        visitedCampgrounds.forEach((campground) => {
          if (campground.name === item.facltNm) {
            updatedIsAddMap[item.facltNm] = true;
          }
        });

        setIsAddMap((prevState) => ({
          ...prevState,
          ...updatedIsAddMap,
        }));
        localStorage.setItem('isAddMap', JSON.stringify(updatedIsAddMap));
      });
    }
  }, [dispatch, googleId, item.facltNm]);

  const changeAdd = async (selectedItem) => {
    if (!googleId) {
      toast.error('로그인이 필요한 서비스입니다.');
      return;
    }

    if (!selectedItem) {
      console.error('캠핑장 정보가 없습니다.');
      toast.error('캠핑장 정보가 없습니다.');
      return;
    }
    console.log('currentCamping:', selectedItem.facltNm); // 현재 캠핑장 정보 확인
    console.log('currentCamping.id:', selectedItem.id); // ID 확인

    const isCurrentlyAdded = isAddMap[selectedItem.facltNm];

    if (isCurrentlyAdded) {
      // 채워진 하트 클릭 시 캠핑장 삭제
      const confirm = window.confirm('캠핑장을 삭제하시겠습니까?');
      if (!confirm) return;

      try {
        console.log('캠핑장 삭제 시도');
        await dispatch(fetchDeleteItemData(selectedItem.facltNm)).unwrap();
        // await dispatch(fetchGetItemsData()).unwrap();
        toast.success('캠핑장이 삭제되었습니다.');
        setIsAddMap((prevState) => {
          const updatedState = { ...prevState, [selectedItem.facltNm]: false };
          localStorage.setItem('isAddMap', JSON.stringify(updatedState));
          return updatedState;
        });
      } catch (error) {
        toast.error('캠핑장 삭제에 실패했습니다.');
        console.error(error);
      }
    } else {
      // 빈 하트 클릭 시 캠핑장 추가
      const updateAddData = {
        name: selectedItem.facltNm,
        location: selectedItem.addr1,
        image: selectedItem.firstImageUrl || 'No Image',
        isadd: true,
        googleId: user?.sub,
      };

      try {
        console.log('캠핑장 추가 시도');
        console.log(updateAddData);
        await dispatch(fetchPostItemData(updateAddData)).unwrap();
        toast.success('캠핑장을 추가하였습니다.');
        setIsAddMap((prevState) => {
          const updatedState = { ...prevState, [selectedItem.facltNm]: true };
          localStorage.setItem('isAddMap', JSON.stringify(updatedState));
          return updatedState;
        });
      } catch (error) {
        toast.error('캠핑장 추가에 실패했습니다.');
        console.error('Error updating data:', error);
      }
    }
  };
  return (
    <div className="border rounded-md shadow-md p-3 mt-3 relative">
      <h3 className="text-lg font-bold flex justify-between">
        {indexOfFirstItem + index + 1}위 {item.facltNm}
        <button onClick={() => openModal(item)} className="ml-4 text-cyan-600">
          <CiSquarePlus />
        </button>
      </h3>
      <div className="flex items-center">
        <img
          src={item.firstImageUrl}
          className="w-[10%] h[10%] mt-3 border rounded-lg"
          alt={item.facltNm}
        />
        <div className="ml-5 mt-3">
          <p>주소: {item.addr1}</p>
          <p>전화번호: {item.tel}</p>
        </div>
      </div>
      <button
        className="absolute bottom-1 right-1 text-xl mb-2 mr-2"
        onClick={() => changeAdd(item)}
      >
        {isAddMap[item.facltNm] ? (
          <FaHeart style={{ color: 'red' }} />
        ) : (
          <FaRegHeart style={{ color: 'red' }} />
        )}
      </button>
    </div>
  );
};

export default HotItem;
