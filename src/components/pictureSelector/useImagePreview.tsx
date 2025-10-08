import { useState, useRef, useEffect, useCallback } from "react";
import Modal from "./Modal";
import { ImZoomIn, ImZoomOut } from "react-icons/im";
import {
  MdOutlineRotate90DegreesCcw,
  MdOutlineRotate90DegreesCw,
} from "react-icons/md";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";

function useImagePreview() {
  const [openPreview, setOpenPreview] = useState({
    status: false,
    url: "",
  });
  const [isZoomEnable, setIsZoomEnable] = useState(false);
  const [zoomValue, setZoomValue] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState(0);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [_containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  const openImage = useCallback((url: string) => {
    if (url) {
      setOpenPreview({ status: true, url });
      setIsZoomEnable(false);
      setZoomValue(1);
      setRotate(0);
    }
  }, []);

  const closeImage = useCallback(() => {
    setOpenPreview({ status: false, url: "" });
    setIsFullscreen(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container || !isZoomEnable) return;

      const rect = container.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      const xPercent = (offsetX / rect.width) * 100;
      const yPercent = (offsetY / rect.height) * 100;

      container.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
    },
    [isZoomEnable],
  );

  const updateZoom = useCallback(() => {
    const container = containerRef.current;
    if (!container || !isZoomEnable) return;

    const { width: naturalW, height: naturalH } = imageSize;
    const containerRect = container.getBoundingClientRect();

    const containerAspect = containerRect.width / containerRect.height;
    const imageAspect = naturalW / naturalH;

    let zoomScale;
    if (containerAspect > imageAspect) {
      zoomScale = (naturalH / containerRect.height) * zoomValue;
    } else {
      zoomScale = (naturalW / containerRect.width) * zoomValue;
    }

    container.style.backgroundSize =
      imageAspect > containerAspect
        ? `${zoomScale * 100}% auto`
        : `auto ${zoomScale * 100}%`;
  }, [zoomValue, isZoomEnable, imageSize]);

  const handleMouseEnter = useCallback(() => {
    if (isZoomEnable) {
      const container = containerRef.current;
      if (container) {
        container.style.cursor = "zoom-in";
        updateZoom();
      }
    }
  }, [isZoomEnable, updateZoom]);

  const handleMouseLeave = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      container.style.cursor = "default";
      container.style.backgroundSize = "contain";
      container.style.backgroundPosition = "center";
    }
    if (!isFullscreen) {
      setZoomValue(1);
      setIsZoomEnable(false);
    }
  }, [isFullscreen]);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      const container = containerRef.current;
      if (container) {
        container.requestFullscreen?.().catch((err: any) => {
          console.error(
            `Error attempting to enable fullscreen: ${err.message}`,
          );
        });
      }
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!openPreview.url) return;

    const img = new Image();
    img.src = openPreview.url;

    img.onload = () => {
      setImageSize({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      console.error("Failed to load image");
      setOpenPreview({ status: false, url: "" });
    };
  }, [openPreview.url]);

  useEffect(() => {
    updateZoom();
  }, [updateZoom]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [openPreview.status]);

  const calculateInitialSize = useCallback(() => {
    if (!imageSize.width || !imageSize.height)
      return { width: 600, height: 600 };

    const maxWidth = window.innerWidth * 0.8;
    const maxHeight = window.innerHeight * 0.8;
    const ratio = Math.min(
      maxWidth / imageSize.width,
      maxHeight / imageSize.height,
      1,
    );

    return {
      width: Math.floor(imageSize.width * ratio),
      height: Math.floor(imageSize.height * ratio),
    };
  }, [imageSize]);

  const modalImagePreview = useCallback(() => {
    const { width, height } = imageSize;
    const initialSize = calculateInitialSize();

    const containerStyle: React.CSSProperties = {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      position: "relative",
    };

    const imageWrapperStyle: React.CSSProperties = {
      position: "relative",
      width: `${initialSize.width}px`,
      height: `${initialSize.height}px`,
      maxWidth: "90vw",
      maxHeight: "90vh",
    };

    const imageContainerStyle: React.CSSProperties = {
      width: "100%",
      height: "100%",
      backgroundImage: `url(${openPreview.url})`,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      overflow: "hidden",
      transform: `rotate(${rotate}deg)`,
      transition: "transform 0.2s ease, background-size 0.15s ease",
      border: "1px solid #ccc",
      borderRadius: "8px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    };

    const controlsContainerStyle: React.CSSProperties = {
      position: "absolute",
      top: "1rem",
      left: "1rem",
      display: "flex",
      gap: "0.5rem",
      zIndex: 10,
      flexWrap: "wrap",
    };

    const buttonStyle: React.CSSProperties = {
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      borderRadius: "0.375rem",
      padding: "0.5rem",
      backdropFilter: "blur(16px)",
      transition: "background-color 0.2s ease",
      border: "none",
      cursor: "pointer",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    const buttonHoverStyle: React.CSSProperties = {
      ...buttonStyle,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    };

    const infoStyle: React.CSSProperties = {
      position: "absolute",
      bottom: "1rem",
      left: "1rem",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      borderRadius: "0.375rem",
      padding: "0.25rem 0.5rem",
      backdropFilter: "blur(16px)",
      fontSize: "0.75rem",
      lineHeight: "1rem",
    };

    const loadingStyle: React.CSSProperties = {
      minHeight: "300px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    return (
      <Modal
        title="مشاهده عکس"
        isOpen={openPreview.status}
        onClose={closeImage}
        className="image-preview-modal"
      >
        {openPreview.url && width && height ? (
          <div style={containerStyle}>
            <div
              style={imageWrapperStyle}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div ref={containerRef} style={imageContainerStyle} />
              <div style={controlsContainerStyle}>
                <button
                  onClick={() => {
                    setZoomValue((prev) => {
                      const newZoom = Math.max(prev - 0.25, 1);
                      if (newZoom <= 1) setIsZoomEnable(false);
                      return newZoom;
                    });
                  }}
                  style={buttonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(0, 0, 0, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(0, 0, 0, 0.3)";
                  }}
                  title="Zoom Out"
                >
                  <ImZoomOut />
                </button>
                <button
                  onClick={() => {
                    setZoomValue((prev) => {
                      const newZoom = Math.min(prev + 0.25, 5);
                      if (newZoom > 1) setIsZoomEnable(true);
                      return newZoom;
                    });
                  }}
                  style={buttonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(0, 0, 0, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(0, 0, 0, 0.3)";
                  }}
                  title="Zoom In"
                >
                  <ImZoomIn />
                </button>
                <button
                  onClick={() => {
                    setRotate((prev) => (prev + 90) % 360);
                  }}
                  style={buttonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(0, 0, 0, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(0, 0, 0, 0.3)";
                  }}
                  title="Rotate Clockwise"
                >
                  <MdOutlineRotate90DegreesCw />
                </button>
                <button
                  onClick={() => {
                    setRotate((prev) => (prev - 90) % 360);
                  }}
                  style={buttonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(0, 0, 0, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(0, 0, 0, 0.3)";
                  }}
                  title="Rotate Counter-Clockwise"
                >
                  <MdOutlineRotate90DegreesCcw />
                </button>
                <button
                  onClick={toggleFullscreen}
                  style={buttonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(0, 0, 0, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(0, 0, 0, 0.3)";
                  }}
                  title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                  {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
                </button>
              </div>
              <div style={infoStyle}>
                {Math.round(zoomValue * 100)}% • {width}×{height}
              </div>
            </div>
          </div>
        ) : (
          <div style={loadingStyle}>
            <p>Loading...</p>
          </div>
        )}
      </Modal>
    );
  }, [
    openPreview.status,
    openPreview.url,
    imageSize,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    rotate,
    zoomValue,
    isFullscreen,
    toggleFullscreen,
    calculateInitialSize,
    closeImage,
  ]);

  return { modalImagePreview, openImage, closeImage };
}

export default useImagePreview;
