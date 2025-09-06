import React from "react";
import { ModalProps } from "./types";
import ReactDOM from "react-dom";

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  size = "fit",
  overflowY = "overflow-y-auto",
  childrenClass,
}) => {
  const handleClose = () => {
    onClose();
  };
  return (
    isOpen &&
    ReactDOM.createPortal(
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-[999] bg-[#0000006c]/30 backdrop-blur-[4px] flex items-end md:items-center justify-center ${
          isOpen ? "translate-y-0" : "translate-y-[100%] delay-500"
        }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative z-[9999] rounded-t-2xl md:rounded-lg border-secondary-200 mx-0  transition-all duration-300 delay-200 ${
            isOpen ? "opacity-100" : "opacity-0"
          } md:max-w-[90%] ${
            size === "sm"
              ? "w-[370px]"
              : size === "md"
              ? "w-[750px]"
              : size === "lg"
              ? "w-[1100px]"
              : size === "xl"
              ? "!w-[80%]"
              : size === "full"
              ? "w-[90%]"
              : ""
          }  max-md:!w-full ${className || ""}`}
        >
          <div
            className={`max-h-[80svh] rounded-2xl ${childrenClass} ${overflowY}`}
          >
            {children}
          </div>
        </div>
      </div>,
      document.body
    )
  );
};

export default Modal;
