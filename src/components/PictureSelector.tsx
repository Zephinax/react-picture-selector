import React, { useState, useEffect, useRef } from "react";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import axios from "axios";
import { ProfileSelectorPropsTypes } from "./types";
import useImagePreview from "../hooks/useImagePreview";

interface UploadResponse {
  data?: string;
}

// Configurable color palette
interface ColorPalette {
  primary: string;
  error: string;
  progress: string;
  placeholder: string;
  text: string;
  textDisabled: string;
}

interface additionalClassNames {
  title?: string;
  titleContainer?: string;
  delete?: string;
  edit?: string;
  image?: string;
}

const PictureSelector = ({
  deleteUrl = "POST_DELETE_AVATAR",
  uploadUrl = "POST_UPLOAD_AVATAR",
  profileImageUrl,
  type = "profile", // "profile" for circle, "image" for rounded rectangle
  onChangeImage,
  viewOnly = false,
  title = "Profile Picture",
  size = 180, // Configurable size
  colors = {
    primary: "#2a84fa",
    error: "#EF4444",
    progress: "#d24670",
    placeholder: "#BCBEC0",
    text: "#fafafa",
    textDisabled: "#e6e6e6",
  },
  additionalClassNames = {
    title: "",
    titleContainer: "",
    delete: "",
    edit: "",
    image: "",
  },
  apiBaseUrl = "BASE_URL_SERVICES", // Configurable base URL
  showProgressRing = true, // Show progress ring
  blurOnProgress = true,
  enableAbortController = true, // Enable/disable abort controller
  testMode = false, // Test mode
  testUploadDelay = 1000, // Upload simulation delay in test mode (milliseconds)
}: ProfileSelectorPropsTypes & {
  size?: number;
  colors?: ColorPalette;
  additionalClassNames?: additionalClassNames;
  apiBaseUrl?: string;
  showProgressRing?: boolean;
  blurOnProgress?: boolean;
  enableAbortController?: boolean;
  testMode?: boolean;
  testUploadDelay?: number;
}) => {
  const { modalImagePreview, openImage } = useImagePreview();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const testProgressRef = useRef<any | null>(null);
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Only use type prop to determine if it's circle or not
  const isCircle = type === "profile";

  const handleAbort = () => {
    if (!enableAbortController) return new AbortController();
    abortControllerRef.current?.abort();
    // Clear test timer if canceled
    if (testMode && testProgressRef.current) {
      clearInterval(testProgressRef.current);
      testProgressRef.current = null;
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    return abortController;
  };

  // Upload simulation for test mode
  const simulateUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        let progress = 0;
        const interval = testUploadDelay / 100; // Divide delay into 100 parts

        testProgressRef.current = setInterval(() => {
          progress += 1;
          setUploadProgress(progress);

          if (progress >= 100) {
            if (testProgressRef.current) {
              clearInterval(testProgressRef.current);
              testProgressRef.current = null;
            }
            resolve(reader.result as string);
          }
        }, interval);
      };
      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    const abortController = handleAbort();
    setLoading(true);
    setUploadProgress(0);

    try {
      if (testMode) {
        // Test mode - simulate upload
        console.log("🧪 Test Mode: Simulating upload...");
        // Simulate deleting previous image
        if (imageUrl) {
          console.log("🧪 Test Mode: Simulating delete previous image");
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
        const base64Image = await simulateUpload(file);
        // Check if request was canceled
        if (abortController.signal.aborted) {
          throw new Error("Upload canceled");
        }
        setLoading(false);
        setImageUrl(base64Image);
        onChangeImage(base64Image);
        setImgError(false);
        setUploadProgress(0);

        console.log("🧪 Test Mode: Upload simulation completed successfully");
      } else {
        // Real mode - API request
        // Delete previous image if exists
        if (imageUrl) {
          await axios.post(`${apiBaseUrl}${deleteUrl}${imageUrl}`, null, {
            signal: abortController.signal,
          });
        }

        const formData = new FormData();
        formData.append("File", file);

        const response = await axios.post<UploadResponse>(
          `${apiBaseUrl}${uploadUrl}`,
          formData,
          {
            signal: abortController.signal,
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const progressPercentage = Math.round(
                  (progressEvent.loaded / progressEvent.total) * 100
                );
                setUploadProgress(progressPercentage);
              }
            },
          }
        );

        setLoading(false);
        if (response?.data?.data) {
          setImageUrl(response.data.data);
          onChangeImage(response.data.data);
          setImgError(false);
          setUploadProgress(0);
        } else {
          throw new Error("Failed to upload the image");
        }
      }
    } catch (error: any) {
      if (
        error.name === "CanceledError" ||
        error.message === "Upload canceled"
      ) {
        console.log(
          testMode ? "🧪 Test Mode: Upload canceled" : "Upload canceled"
        );
      } else {
        console.error(
          testMode
            ? "🧪 Test Mode: Error simulating upload:"
            : "Error uploading the image:",
          error instanceof Error ? error.message : error
        );
      }
      setLoading(false);
      setUploadProgress(0);
      // Clear timer on error
      if (testMode && testProgressRef.current) {
        clearInterval(testProgressRef.current);
        testProgressRef.current = null;
      }
    }
  };

  const handleDeleteImage = async () => {
    if (!imageUrl) return;

    const abortController = handleAbort();

    try {
      if (testMode) {
        // Test mode - simulate delete
        console.log("🧪 Test Mode: Simulating delete image");
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (abortController.signal.aborted) {
          throw new Error("Delete canceled");
        }

        setImageUrl("");
        onChangeImage("");
        console.log("🧪 Test Mode: Delete simulation completed");
      } else {
        // Real mode - API request
        await axios.post(`${apiBaseUrl}${deleteUrl}${imageUrl}`, null, {
          signal: abortController.signal,
        });
        setImageUrl("");
        onChangeImage("");
      }
    } catch (error) {
      if (error instanceof Error && error.message === "Delete canceled") {
        console.log(
          testMode ? "🧪 Test Mode: Delete canceled" : "Delete canceled"
        );
      } else {
        console.error(
          testMode
            ? "🧪 Test Mode: Error simulating delete:"
            : "Error deleting the image:",
          error instanceof Error ? error.message : error
        );
      }
    }
  };

  useEffect(() => {
    if (profileImageUrl) setImageUrl(profileImageUrl);

    return () => {
      if (enableAbortController) {
        abortControllerRef.current?.abort();
      }

      // Clear test timer on cleanup
      if (testProgressRef.current) {
        clearInterval(testProgressRef.current);
        testProgressRef.current = null;
      }
    };
  }, [profileImageUrl]);

  const triggerFileInput = () => fileInputRef.current?.click();

  const radius = size / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = (1 - uploadProgress / 100) * circumference;
  // Calculate button positions based on size
  const buttonPosition = size * 0.06; // 7% of size
  const buttonSize = size * 0.2; // 20% of size
  // Dynamic style for image
  const imageContainerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: isCircle ? "50%" : "12%",
  };

  return (
    <div className="max-w-xs w-full flex flex-col mx-auto p-4 pt-0 rounded-lg">
      <div
        className={`mb-4 flex items-center justify-center ${
          additionalClassNames.titleContainer || ""
        }`}
      >
        <h3 className={additionalClassNames.title || ""}>{title}</h3>
      </div>
      <div className="mb-4 flex flex-col items-center justify-center relative">
        {modalImagePreview()}
        <div className="relative" style={imageContainerStyle}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={isCircle ? "Profile" : "Image"}
              className={`w-full h-full object-cover ${
                additionalClassNames.image || ""
              }`}
              onError={() => setImgError(true)}
              onClick={() => openImage(imageUrl)}
              style={{
                cursor: "pointer",
                borderRadius: isCircle ? "50%" : "12%",
              }}
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center bg-gray-100`}
              style={{
                borderRadius: isCircle ? "50%" : "12%",
              }}
            >
              {isCircle ? (
                // Profile placeholder SVG
                <svg
                  width={size}
                  height={size}
                  viewBox="-2 -2 110 110"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="53.5"
                    cy="52.5"
                    r="52.5"
                    stroke={colors.placeholder}
                    strokeWidth="2"
                  />
                  <path
                    d="M53 106C38.8432 106 25.5338 100.487 15.5234 90.4766C5.51283 80.4662 0 67.1568 0 53C0 38.8432 5.51283 25.5338 15.5234 15.5234C25.5338 5.51283 38.8432 0 53 0C67.1568 0 80.4662 5.51283 90.4766 15.5234C100.487 25.5338 106 38.8432 106 53C106 67.1568 100.487 80.4662 90.4766 90.4766C80.4662 100.487 67.1568 106 53 106ZM53 4.14062C26.0588 4.14062 4.14062 26.0588 4.14062 53C4.14062 79.9412 26.0588 101.859 53 101.859C79.9412 101.859 101.859 79.9412 101.859 53C101.859 26.0588 79.9412 4.14062 53 4.14062Z"
                    fill={colors.placeholder}
                    stroke={colors.placeholder}
                    strokeWidth="2"
                  />
                  <path
                    d="M53 62.0538C41.6963 62.0538 32.5 52.8577 32.5 41.554C32.5 30.2503 41.6961 21.054 53 21.054C64.3039 21.054 73.5001 30.2501 73.5001 41.554C73.5001 52.8577 64.3037 62.0538 53 62.0538ZM53 25.1946C43.9795 25.1946 36.6406 32.5334 36.6406 41.554C36.6406 50.5745 43.9795 57.9132 53 57.9132C62.0206 57.9132 69.3594 50.5745 69.3594 41.554C69.3594 32.5334 62.0206 25.1946 53 25.1946Z"
                    fill={colors.placeholder}
                    stroke={colors.placeholder}
                    strokeWidth="2"
                  />
                  <path
                    d="M88.4081 91.6778C87.4235 91.6778 86.5507 90.9731 86.3724 89.9698C83.4945 73.7943 69.4594 62.0537 53 62.0537C36.5406 62.0537 22.5057 73.794 19.6276 89.9698C19.4274 91.0956 18.3527 91.8459 17.2267 91.6455C16.1008 91.4453 15.3505 90.3702 15.5509 89.2446C17.0956 80.5627 21.6741 72.6276 28.443 66.9005C35.293 61.1049 44.014 57.9131 53 57.9131C61.986 57.9131 70.707 61.1049 77.557 66.9005C84.3259 72.6276 88.9044 80.5627 90.4491 89.2446C90.6495 90.3702 89.8992 91.4451 88.7733 91.6455C88.6508 91.6673 88.5284 91.6778 88.4081 91.6778Z"
                    fill={colors.placeholder}
                    stroke={colors.placeholder}
                    strokeWidth="2"
                  />
                </svg>
              ) : (
                <svg
                  width={size}
                  height={size}
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs></defs>
                  <g
                    id="Page-1"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="Icon-Set"
                      transform="translate(-360.000000, -99.000000)"
                      fill={colors.placeholder}
                    >
                      <path
                        d="M368,109 C366.896,109 366,108.104 366,107 C366,105.896 366.896,105 368,105 C369.104,105 370,105.896 370,107 C370,108.104 369.104,109 368,109 L368,109 Z M368,103 C365.791,103 364,104.791 364,107 C364,109.209 365.791,111 368,111 C370.209,111 372,109.209 372,107 C372,104.791 370.209,103 368,103 L368,103 Z M390,116.128 L384,110 L374.059,120.111 L370,116 L362,123.337 L362,103 C362,101.896 362.896,101 364,101 L388,101 C389.104,101 390,101.896 390,103 L390,116.128 L390,116.128 Z M390,127 C390,128.104 389.104,129 388,129 L382.832,129 L375.464,121.535 L384,112.999 L390,118.999 L390,127 L390,127 Z M364,129 C362.896,129 362,128.104 362,127 L362,126.061 L369.945,118.945 L380.001,129 L364,129 L364,129 Z M388,99 L364,99 C361.791,99 360,100.791 360,103 L360,127 C360,129.209 361.791,131 364,131 L388,131 C390.209,131 392,129.209 392,127 L392,103 C392,100.791 390.209,99 388,99 L388,99 Z"
                        id="image-picture"
                      ></path>
                    </g>
                  </g>
                </svg>
              )}
            </div>
          )}
          {/* Show percentage when no progress ring or not circle */}
          {loading &&
            ((blurOnProgress && imageUrl) ||
              (!showProgressRing && !imageUrl)) && (
              <div
                className={`absolute mx-auto inset-0 bg-black/20 bg-opacity-80 backdrop-blur-xs flex items-center z-[5] justify-center !w-[${size}px] !h-[${size}px]`}
                style={{
                  borderRadius: isCircle ? "50%" : "12%",
                }}
              >
                <div
                  className="text-sm font-semibold text-white"
                  style={{ fontSize: buttonSize * 0.5 }}
                >
                  {uploadProgress}%
                </div>
              </div>
            )}

          {/* Progress ring - only show for circle (profile) type */}
          {showProgressRing &&
          uploadProgress > 0 &&
          uploadProgress < 100 &&
          isCircle ? (
            <svg
              className="absolute z-[6] top-0 left-0 pointer-events-none"
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`} // viewBox مقیاس‌پذیر
            >
              <circle
                cx={size / 2}
                cy={size / 2}
                r={size / 2 - size * 0.035} // شعاع نسبی با جبران حاشیه
                fill="none"
                stroke={colors.progress}
                strokeWidth={size * (10 / 180)} // ضخامت خط نسبی
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: "stroke-dashoffset 0.3s ease" }}
              />
            </svg>
          ) : (
            showProgressRing &&
            uploadProgress > 0 &&
            uploadProgress < 100 && (
              <div className="">
                {(() => {
                  const rectWidth = size * 0.94;
                  const rectHeight = size * 0.94;
                  const rectPerimeter = 2 * (rectWidth + rectHeight);
                  const rectProgressOffset =
                    rectPerimeter * (1 - uploadProgress / 100);

                  return (
                    <svg
                      className="absolute top-0 z-[6] left-0"
                      width={size}
                      height={size}
                      viewBox={`0 0 ${size} ${size}`}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        className="rounded-lg overflow-hidden"
                        x={size * 0.03}
                        y={size * 0.03}
                        rx={size * 0.09}
                        width={rectWidth}
                        height={rectHeight}
                        fill="none"
                        stroke={colors.progress}
                        strokeWidth={size * (10 / 180)}
                        strokeDasharray={rectPerimeter}
                        strokeDashoffset={rectProgressOffset}
                        style={{ transition: "stroke-dashoffset 0.3s ease" }}
                      />
                    </svg>
                  );
                })()}
              </div>
            )
          )}

          {!viewOnly && (
            <>
              <button
                style={{
                  backgroundColor: colors.primary,
                  width: `${buttonSize}px`,
                  height: `${buttonSize}px`,
                  bottom: `${buttonPosition}px`,
                  right: `${buttonPosition}px`,
                  borderRadius: isCircle ? "50%" : "28%",
                }}
                className={`absolute p-1 cursor-pointer  shadow-lg flex items-center justify-center z-10 ${
                  additionalClassNames.edit || ""
                } ${isCircle ? "rounded-full" : "rounded-[12px]"}`}
                onClick={triggerFileInput}
                disabled={loading}
              >
                <MdOutlineEdit
                  color={loading ? colors.text : colors.textDisabled}
                  size={buttonSize * 0.6}
                />
              </button>
              {imageUrl && (
                <button
                  style={{
                    backgroundColor: colors.error,
                    width: `${buttonSize}px`,
                    height: `${buttonSize}px`,
                    bottom: `${buttonPosition}px`,
                    left: `${buttonPosition}px`,
                    borderRadius: isCircle ? "50%" : "28%",
                  }}
                  className={`absolute p-1 cursor-pointer shadow-lg flex items-center justify-center z-10 ${
                    additionalClassNames.delete || ""
                  }`}
                  onClick={handleDeleteImage}
                  disabled={loading}
                >
                  <MdDeleteOutline
                    color={loading ? colors.text : colors.textDisabled}
                    size={buttonSize * 0.6}
                  />
                </button>
              )}
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default PictureSelector;
