import React, { useState, useEffect } from "react";
import Modal from "../items/Modal";
import ThemeItem from "./ThemeItem";
import ThemeNav from "./ThemeNav";
import { BeatLoader, DotLoader } from "react-spinners";

const ThemePanel = ({ selectedTheme, onSelectTheme }) => {
  const [themeData, setThemeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchThemeData = async () => {
      if (!selectedTheme) return;

      setLoading(true);

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

          const filteredData = items.filter(
            (item) =>
              item.themaEnvrnCl &&
              item.themaEnvrnCl.includes(selectedTheme.label)
          );

          setThemeData(filteredData);
        } else {
          console.error("API 응답 구조가 예상과 다릅니다.");
        }
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchThemeData();
  }, [selectedTheme]);

  const openModal = (item) => {
    setModalContent(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = themeData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(themeData.length / itemsPerPage);

  const pageNumbers = [];
  const maxPagesToShow = 5;

  let startPage = 1;
  let endPage = maxPagesToShow;

  if (totalPages <= maxPagesToShow) {
    endPage = totalPages;
  } else if (currentPage <= Math.floor(maxPagesToShow / 2)) {
    endPage = maxPagesToShow;
  } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
    startPage = totalPages - maxPagesToShow + 1;
    endPage = totalPages;
  } else {
    startPage = currentPage - Math.floor(maxPagesToShow / 2);
    endPage = currentPage + Math.floor(maxPagesToShow / 2);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="theme-panel m-2">
      <ThemeNav onSelectTheme={onSelectTheme} />

      {loading ? (
        <div className="flex justify-center items-center h-[70vh] w-full">
          <BeatLoader color="#22d3ee" loading size={10} />
        </div>
      ) : themeData.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 mt-2 p-2">
          {currentItems.map((item, index) => (
            <ThemeItem key={index} item={item} openModal={openModal} />
          ))}
        </div>
      ) : null}

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

      {!loading && themeData.length > 0 && (
        <nav
          aria-label="Page navigation example"
          className="mt-4 flex justify-center"
        >
          <ul className="flex items-center -space-x-px h-10 text-base">
            <li>
              <a
                href="#"
                className={`flex items-center justify-center px-4 h-10 leading-tight border rounded-md ml-2 ${
                  currentPage === 1
                    ? "cursor-not-allowed text-gray-400"
                    : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
              >
                <svg
                  className="w-3 h-3 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 1 1 5l4 4"
                  />
                </svg>
              </a>
            </li>

            {pageNumbers.map((number) => (
              <li key={number}>
                <a
                  href="#"
                  className={`flex items-center justify-center px-4 h-10 leading-tight border rounded-md ml-2 ${
                    number === currentPage
                      ? "text-cyan-500 border border-cyan-300 bg-cyan-50"
                      : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(number);
                  }}
                >
                  {number}
                </a>
              </li>
            ))}

            <li>
              <a
                href="#"
                className={`flex items-center justify-center px-4 h-10 leading-tight border rounded-md ml-2 ${
                  currentPage === totalPages
                    ? "cursor-not-allowed text-gray-400"
                    : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
              >
                <svg
                  className="w-3 h-3 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ThemePanel;
