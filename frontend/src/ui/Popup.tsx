import React from "react";

type PopupProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl rounded-lg bg-white shadow-lg">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-gray-300 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-400"
          >
            Close
          </button>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
