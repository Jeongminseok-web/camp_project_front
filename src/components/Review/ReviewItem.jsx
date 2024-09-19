import React, { useState } from "react";
import {
  IoMdAdd,
  IoMdCloseCircle,
  IoMdCreate,
  IoMdRemoveCircle,
} from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { fetchPutTaskData } from "../../redux/slices/apiSlice";

const ReviewItem = ({ task, closeModal }) => {
  const { images, title, description, date, grade, _id, userid } = task;
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const selectedImages = useState(images);

  const userKey = useSelector((state) => state.auth.authData?.sub);
  const userName = useSelector((state) => state.auth.authData?.name);
  const dispatch = useDispatch();

  const defaultImage = process.env.PUBLIC_URL + "/campimg.png";
  // 서버의 이미지 URL 기본 경로 설정
  const BASE_IMAGE_URL = "https://campback.thxmin.com";
  // 서버 이미지 URL 설정
  const imageUrl = (imagePath) => `${BASE_IMAGE_URL}${imagePath}`;

  // 모달 열기/닫기 함수
  const openReview = () => setIsReviewOpen(true);
  const closeReview = () => setIsReviewOpen(false);

  const handleDeleteClick = async () => {
    if (userKey === userid) {
      // images 배열에서 UUID를 가져옵니다.
      const imageNames = images.map((image) => image.split("/").pop());
      console.log(images);
      console.log(imageNames);

      try {
        const response = await fetch(
          `https://campback.thxmin.com/delete_task/${_id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ images: imageNames }), // 삭제할 이미지 이름 전달
          }
        );

        if (response.ok) {
          console.log("Task deleted successfully");
          closeReview();
        } else {
          console.error("Failed to delete task");
        }
      } catch (error) {
        console.error("Error while deleting task:", error);
      }
    }
  };

  return (
    <>
      {/* 이미지 버튼 */}
      <div
        className="review-panel relative mt-2 w-[18%] h-[40vh] hover:text-slate-500 border-none rounded-sm overflow-hidden cursor-pointer"
        onClick={openReview}
      >
        {/* 이미지 */}
        <img
          src={images.length > 0 ? imageUrl(images[0]) : defaultImage}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = defaultImage; // 이미지 로드 오류 시 기본 이미지로 변경
          }}
        />

        {/* Hover 시 보여줄 오버레이 */}
        <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 hover:opacity-100 flex justify-center items-center text-white transition-opacity duration-300">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p>⭐ {grade}/5</p>
          </div>
        </div>
      </div>

      {/* 모달 */}
      {isReviewOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50
        overflow-auto"
        >
          <div className="relative bg-white p-6 rounded-lg w-auto max-w-[90vh] max-h-[90vh] overflow-y-auto">
            {/* 닫기 버튼 */}
            <button
              onClick={closeReview}
              className="absolute top-2 right-2 text-2xl"
            >
              <IoMdCloseCircle />
            </button>

            <>
              <h2 className="text-2xl font-bold mb-4">{title}</h2>
              <p className="mb-2">⭐ {grade}/5</p>
              <p className="mb-2">방문한 날짜: {date}</p>
              <p className="mb-4">후기: {description}</p>

              <div className="flex w-full h-full gap-4 flex-wrap justify-between p-x-5">
                {images &&
                  images.map((img, index) => (
                    <div key={index} className="mb-4 w-[48%] h-[40vh]">
                      <img
                        src={img ? imageUrl(img) : defaultImage}
                        alt={`Image ${index + 1}`}
                        className="object-fill rounded-lg w-full h-full"
                        onError={(e) => {
                          e.target.src = defaultImage;
                        }}
                      />
                    </div>
                  ))}
              </div>

              <div className="flex justify-end">
                {userKey === userid && (
                  <button
                    onClick={handleDeleteClick}
                    className="flex justify-center items-center bottom-2 right-2 bg-red-500 text-white px-2 py-2 rounded-lg gap-1"
                  >
                    내 리뷰 삭제하기
                  </button>
                )}
              </div>
            </>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewItem;
