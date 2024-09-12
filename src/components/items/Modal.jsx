import React from 'react';
import { MdClose } from 'react-icons/md';

const Modal = ({ showModal, closeModal, title, children }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-md shadow-lg w-1/2 max-w-lg">
        <h2 className="text-xl font-bold mb-4 flex justify-between">
          {title}
          <button onClick={closeModal}>
            <MdClose />
          </button>
        </h2>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
