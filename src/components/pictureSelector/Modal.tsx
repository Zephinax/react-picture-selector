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

  // Size mapping
  const sizeStyles = {
    sm: { width: "370px" },
    md: { width: "750px" },
    lg: { width: "1100px" },
    xl: { width: "80%" },
    full: { width: "90%" },
    fit: {},
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: "rgba(0, 0, 0, 0.424)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: isOpen ? "translateY(0)" : "translateY(100%)",
    transition: "transform 500ms ease",
  };

  const modalStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 9999,
    borderTopLeftRadius: "1rem",
    borderTopRightRadius: "1rem",
    borderBottomLeftRadius: "0.5rem",
    borderBottomRightRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    marginLeft: 0,
    marginRight: 0,
    transition: "all 300ms ease 200ms",
    opacity: isOpen ? 1 : 0,
    maxWidth: "90%",
    ...sizeStyles[size as keyof typeof sizeStyles],
  };

  const contentStyle: React.CSSProperties = {
    maxHeight: "80svh",
    borderRadius: "1rem",
    overflowY: overflowY === "overflow-y-auto" ? "auto" : "visible",
  };

  return (
    isOpen &&
    ReactDOM.createPortal(
      <div onClick={handleClose} style={overlayStyle}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={modalStyle}
          className={className}
        >
          <div style={contentStyle} className={childrenClass}>
            {children}
          </div>
        </div>
      </div>,
      document.body,
    )
  );
};

export default Modal;
