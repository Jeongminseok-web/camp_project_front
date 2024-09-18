import React, { useEffect, useState } from "react";
import ReviewItem from "./ReviewItem";
import ReviewModal from "./ReviewModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetTasksData } from "../../redux/slices/apiSlice";
import { toast } from "react-toastify";

const ReviewPanel = () => {
  const tasks = useSelector((state) => state.api.getTasksData);
  console.log(tasks);
  const authData = useSelector((state) => state.auth.authData);
  // console.log(authData);
  const dispatch = useDispatch();
  const userKey = useSelector((state) => authData?.sub);
  console.log(userKey);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]); // 리뷰 목록을 관리
  const [localTasks, setLocalTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const maxPagesToShow = 5;

  const openModal = () => {
    if (userKey) {
      setIsModalOpen(true);
    } else {
      toast.error("로그인이 필요합니다."); // Show error toast
    }
  };
  const closeModal = () => setIsModalOpen(false);

  const addReview = (newReview) => {
    setReviews([...reviews, newReview]);
    closeModal();
  };

  useEffect(() => {
    dispatch(fetchGetTasksData()).then((result) => {
      setLocalTasks(result.payload);
    });
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(fetchGetTasksData()).then((result) => {
  //     setLocalTasks(result.payload); // 이미 서버에서 정렬된 데이터를 받음
  //   });
  //   // 컴포넌트가 마운트될 때 캠핑장 데이터를 가져옵니다.
  // }, [dispatch]);

  // 현재 페이지에 해당하는 데이터 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tasks.slice(indexOfFirstItem, indexOfLastItem);
  // console.log(currentItems);

  // 페이지 번호 배열 생성
  const totalPages = Math.ceil(tasks.length / itemsPerPage);
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

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="w-full h-full">
      <div className="w-full h-full pt-10 flex flex-wrap gap-x-4">
        {currentItems.map((task) => (
          <ReviewItem
            key={task._id} // Assuming _id is the unique identifier
            reviews={reviews}
            task={task}
            imageUrl={`http://localhost:8000/uploads/${task.image}`}
          />
        ))}
      </div>
      <div>
        <button
          onClick={openModal}
          className="fixed bottom-10 right-10 bg-cyan-500 text-white text-2xl rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
        >
          +
        </button>
      </div>
      {isModalOpen && (
        <ReviewModal closeModal={closeModal} addReview={addReview} />
      )}

      {tasks.length > itemsPerPage && (
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
                <span className="sr-only">Previous</span>
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
                      : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
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
                <span className="sr-only">Next</span>
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

export default ReviewPanel;
