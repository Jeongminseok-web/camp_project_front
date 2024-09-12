// HotPanel.jsx
import React, { useState, useEffect } from "react";
import { FaCrown } from "react-icons/fa6";
import Modal from "../items/Modal";
import HotItem from "./HotItem";
import { BeatLoader } from "react-spinners";

const HotPanel = () => {
  const [hotData, setHotData] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const itemsPerPage = 4; // 페이지당 표시할 항목 수

  const contentIdOrder = [
    1776, 6975, 2703, 2422, 8014, 6808, 2999, 2217, 2672, 7767, 6959, 3139,
    1601, 3394, 7079, 7589, 306, 7315, 2439, 3320,
  ];

  useEffect(() => {
    const fetchHotData = async () => {
      const url = `https://apis.data.go.kr/B551011/GoCamping/basedList?numOfRows=4000&MobileOS=ETC&MobileApp=camp&serviceKey=3tarJeicxWx1WR%2FDbmAPR9PexoyQb0fzEGJUC1BBu%2BTkihK1IJo1XOTJdVEwqPDSV99EGGyK3WUtzrGl57pJZw%3D%3D&_type=json`;

      try {
        const response = await fetch(url);
        const text = await response.text(); // JSON 파싱 전에 텍스트로 응답을 읽음
        console.log("Response text:", text); // 응답을 로그로 출력

        const data = JSON.parse(text);

        if (
          data.response &&
          data.response.body &&
          data.response.body.items &&
          data.response.body.items.item
        ) {
          const items = data.response.body.items.item;

          const filteredAndSortedData = contentIdOrder
            .map((contentId) =>
              items.find((item) => parseInt(item.contentId) === contentId)
            )
            .filter(Boolean);

          setHotData(filteredAndSortedData);
        } else {
          setError("API 응답 구조가 예상과 다릅니다.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("데이터를 가져오는 중 오류 발생");
      }
    };

    fetchHotData();
  }, []);

  const openModal = (item) => {
    setModalContent(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  // 현재 페이지에 해당하는 데이터를 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = hotData.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 번호 배열 생성
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(hotData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="hot-panel mt-12 ml-4 mr-4">
      <div className="flex justify-center">
        <FaCrown className="w-5 mt-5 mr-3" />
        <p className="text-lg font-bold mt-3">전국 캠핑장 순위</p>
        <FaCrown className="w-5 mt-5 ml-3" />
      </div>

      {error ? (
        <p>{error}</p>
      ) : hotData.length > 0 ? (
        <div className="gap-2">
          {currentItems.map((item, index) => (
            <HotItem
              key={item.contentId}
              item={item}
              index={index}
              indexOfFirstItem={indexOfFirstItem}
              openModal={openModal}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-[70vh] w-full">
          <BeatLoader color="#22d3ee" loading size={10} />
        </div>
      )}

      {modalContent && (
        <Modal
          showModal={showModal}
          closeModal={closeModal}
          title={modalContent.facltNm}
        >
          <p className="mb-5">주소: {modalContent.addr1}</p>

          <p className="mb-5">
            전화번호: {modalContent.tel ? modalContent.tel : "정보 없음"}
          </p>

          <p className="mb-5">
            부대 시설: {modalContent.sbrsCl ? modalContent.sbrsCl : "정보 없음"}
          </p>
          <p className="mb-5">
            주변 시설:{" "}
            {modalContent.posblFcltyCl
              ? modalContent.posblFcltyCl
              : "정보 없음"}
          </p>
          <p>{modalContent.intro}</p>

          <p className="mt-10">
            홈페이지:{" "}
            {modalContent.resveUrl ? (
              <a
                href={modalContent.resveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline break-all"
              >
                {modalContent.resveUrl}
              </a>
            ) : (
              "정보 없음"
            )}
          </p>
        </Modal>
      )}
      <nav
        aria-label="Page navigation example"
        className="mt-4 flex justify-center"
      >
        <ul className="flex items-center -space-x-px h-10 text-base">
          {pageNumbers.map((number) => (
            <li key={number}>
              <a
                onClick={() => setCurrentPage(number)}
                className={`flex items-center justify-center px-4 h-10 leading-tight border rounded-md ml-2 ${
                  number === currentPage
                    ? "text-cyan-500 border border-cyan-300 bg-cyan-50"
                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                }`}
                href="#"
              >
                {number}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default HotPanel;
