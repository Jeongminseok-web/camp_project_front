import React, { useEffect, useState } from "react";

function Users() {
  // 상태 초기화
  const [data, setData] = useState();

  // 컴포넌트가 마운트될 때 실행되는 부분
  useEffect(() => {
    fetchData(); // 데이터 가져오는 함수 호출
  }, []);

  // 데이터 가져오는 함수
  const fetchData = () => {
    fetch(
      "https://apis.data.go.kr/B551011/GoCamping/basedList?numOfRows=4000&MobileOS=ETC&MobileApp=camp&serviceKey=3tarJeicxWx1WR%2FDbmAPR9PexoyQb0fzEGJUC1BBu%2BTkihK1IJo1XOTJdVEwqPDSV99EGGyK3WUtzrGl57pJZw%3D%3D&_type=json"
    )
      .then((response) => response.json())
      .then((data) => setData(data.response.body.items.item)) // 데이터를 가져와서 상태 업데이트
      .catch((error) => console.error("Error fetching data:", error));
  };

  // 컴포넌트가 마운트될 때 실행되는 부분
  useEffect(() => {
    fetchData();
    // 데이터 가져오는 함수 호출
  }, []);

  return (
    <div>
      {/* 여기에 데이터를 표시하는 JSX 코드를 작성합니다. */}
      {/* 예를 들어, 데이터가 있을 때만 보여지는 내용을 작성할 수 있습니다. 
      {data && (
        <div>
          {data.map((item, index) => (
            <div key={index}>
              <img
                src={item.firstImageUrl}
                style={{ height: "300px", objectFit: "cover" }}
              />
              <h1>{item.facltNm}</h1>
              <p>주소: {item.addr1}</p>
              <p>전화번호: {item.tel}</p>
            </div>
          ))}
        </div>
      )}*/}
    </div>
  );
}

export default Users;
