import React, { useEffect, useState } from "react";
import Item from "./Item";
import { fetchGetItemsData } from "../../redux/slices/apiSlice";
import { useDispatch, useSelector } from "react-redux";

const ItemPanel = () => {
  const dispatch = useDispatch();
  const areas = useSelector((state) => state.api.getItemsData); // 스토어에서 캠핑장 데이터를 가져옵니다.
  console.log(areas);
  const googleId = useSelector((state) => state.auth.authData?.sub); // 사용자의 ID를 가져옵니다.
  const [localAreas, setLocalAreas] = useState([]);

  useEffect(() => {
    if (googleId) {
      dispatch(fetchGetItemsData(googleId)).then((result) => {
        setLocalAreas(result.payload); // 이미 서버에서 정렬된 데이터를 받음
      });
      // 컴포넌트가 마운트될 때 캠핑장 데이터를 가져옵니다.
    }
  }, [dispatch, googleId]);

  const handleItemRemove = (name) => {
    // 삭제된 항목을 필터링하여 상태 업데이트
    const updatedAreas = localAreas.filter((area) => area.name !== name);
    setLocalAreas(updatedAreas);
  };

  if (!googleId) {
    return (
      <div className="w-full h-full justify-center items-center flex text-3xl">
        로그인이 필요한 서비스 입니다.
      </div>
    ); // 데이터가 로드되지 않은 경우 로딩 메시지를 표시합니다.
  }
  if (localAreas.length === 0) {
    return (
      <div className="w-full h-full justify-center items-center flex text-3xl">
        방문한 캠핑장 정보가 없습니다.
      </div>
    ); // 해당 사용자의 캠핑장이 없으면 메시지 표시
  }

  return (
    <div className="w-full h-auto flex flex-wrap justify-normal mt-12">
      {localAreas.map((area) => (
        <Item key={area.id} area={area} onRemove={handleItemRemove} />
      ))}
    </div>
  );
};

export default ItemPanel;
