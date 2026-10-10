const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
          
          {/* Modal Content */}
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 bg-white p-4 rounded-lg z-10 text-right shadow-lg">
            <button 
              className="text-black font-semibold hover:text-gray-700 focus:outline-none mr-2" 
              onClick={onClose}
            >
              ✕
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;