import React, { useState } from "react";
import {
  IoMdAdd,
  IoMdCloseCircle,
  IoMdCreate,
  IoMdRemoveCircle,
} from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { fetchPutTaskData } from "../../redux/slices/apiSlice";

const ReviewItem = ({ task }) => {
  const { images, title, description, date, grade, _id, userid } = task;
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [updatedDate, setUpdatedDate] = useState(date);
  const [updatedGrade, setUpdatedGrade] = useState(grade);
  const [selectedImages, setSelectedImages] = useState(images);

  const userKey = useSelector((state) => state.auth.authData?.sub);
  const dispatch = useDispatch();

  const defaultImage = process.env.PUBLIC_URL + "/campimg.png";
  // 서버의 이미지 URL 기본 경로 설정
  const BASE_IMAGE_URL = "https://campback.thxmin.com";
  // 서버 이미지 URL 설정
  const imageUrl = (imagePath) => `${BASE_IMAGE_URL}${imagePath}`;

  // 모달 열기/닫기 함수
  const openReview = () => setIsReviewOpen(true);
  const closeReview = () => {
    setIsReviewOpen(false);
    setIsEditing(false);
  };

  const handleEditClick = () => setIsEditing(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 수정된 데이터로 기존 데이터를 대체합니다.
    dispatch(
      fetchPutTaskData({
        id: _id,
        images: selectedImages, // 새 이미지 목록을 서버에 전송
        title: updatedTitle,
        description: updatedDescription,
        date: updatedDate,
        grade: updatedGrade,
      })
    ).then(() => {
      // 서버에 성공적으로 업데이트 후 모달 닫기
      setIsEditing(false);
    });
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
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

            {/* 모달 내용 */}
            {isEditing ? (
              <div className="mt-4">
                <form
                  onSubmit={handleSubmit}
                  encType="multipart/form-data"
                  method="post"
                  action="/uploads"
                >
                  <input
                    type="text"
                    value={updatedTitle}
                    onChange={(e) => setUpdatedTitle(e.target.value)}
                    className="border p-2 w-full mb-2"
                    placeholder="제목"
                  />
                  <textarea
                    value={updatedDescription}
                    onChange={(e) => setUpdatedDescription(e.target.value)}
                    className="border p-2 w-full mb-2"
                    placeholder="설명"
                  />
                  <input
                    type="date"
                    value={updatedDate}
                    onChange={(e) => setUpdatedDate(e.target.value)}
                    className="border p-2 w-full mb-2"
                  />
                  <input
                    type="number"
                    value={updatedGrade}
                    onChange={(e) => setUpdatedGrade(e.target.value)}
                    className="border p-2 w-full mb-2"
                    placeholder="평점"
                  />
                  {/* 사진 추가 버튼 */}
                  <label className="w-full h-48 flex justify-center items-center border border-dashed rounded-lg cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center">
                      <IoMdAdd className="text-4xl" />
                      <span className="text-lg">+ 사진추가하기</span>
                    </div>
                  </label>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative w-1/2 p-1">
                        <img
                          src={image}
                          alt={`Preview ${index}`}
                          className="w-full h-32 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 text-red-600"
                        >
                          <IoMdRemoveCircle />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg mt-2"
                  >
                    저장
                  </button>
                </form>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p className="mb-2">⭐ {grade}/5</p>
                <p className="mb-2">방문한 날짜: {date}</p>
                <p className="mb-4">후기: {description}</p>

                {/* 이미지들 표시 */}
                <div className="flex w-full h-full gap-4 flex-wrap justify-between p-x-5">
                  {images &&
                    images.map((img, index) => (
                      <div key={index} className="mb-4 w-[48%] h-[40vh]">
                        <img
                          src={img ? imageUrl(img) : defaultImage}
                          alt={`Image ${index + 1}`}
                          className="object-fill rounded-lg w-full h-full"
                          onError={(e) => {
                            e.target.src = defaultImage; // 이미지 로드 오류 시 기본 이미지로 변경
                          }}
                        />
                      </div>
                    ))}
                </div>
                {/* 수정하기 버튼 */}
                <div className="flex justify-end">
                  {userKey === userid && (
                    <button
                      onClick={handleEditClick}
                      className="flex justify-center items-center bottom-2 right-2 bg-blue-500
                       text-white px-2 py-2 rounded-lg gap-1"
                    >
                      <IoMdCreate /> 수정하기
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewItem;
