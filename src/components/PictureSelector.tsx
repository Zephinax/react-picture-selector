import React, { useState, useEffect, useRef } from "react";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { ProfileSelectorPropsTypes } from "./types";
import useImagePreview from "../hooks/useImagePreview";

interface UploadResponse {
  data?: string;
}

const PictureSelector = ({
  deleteUrl = "POST_DELETE_AVATAR",
  uploadUrl = "POST_UPLOAD_AVATAR",
  profileImageUrl,
  type = "profile",
  onChangeImage,
  viewOnly = false,
  title = "تصویر پروفایل",
}: ProfileSelectorPropsTypes) => {
  const { modalImagePreview, openImage } = useImagePreview();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(false);

  // رنگ‌ها به صورت HEX
  const colors = {
    primary: "#3B82F6", // blue-500
    error: "#EF4444", // red-500
    progress: "#FACC15", // yellow-400
  };

  const handleAbort = () => {
    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    return abortController;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    const abortController = handleAbort();
    setLoading(true);
    try {
      if (imageUrl) {
        await axios.post(
          "BASE_URL_SERVICES" + (deleteUrl || "POST_DELETE_AVATAR") + imageUrl,
          null,
          { signal: abortController.signal }
        );
      }

      const formData = new FormData();
      formData.append("File", file);

      const response = await axios.post<UploadResponse>(
        "BASE_URL_SERVICES" + (uploadUrl || "POST_UPLOAD_AVATAR"),
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
    } catch (error) {
      console.error(
        "Error uploading the image:",
        error instanceof Error ? error.message : error
      );
      setLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    const abortController = handleAbort();
    try {
      await axios.post(
        "BASE_URL_SERVICES" + (deleteUrl || "POST_DELETE_AVATAR") + imageUrl,
        null,
        { signal: abortController.signal }
      );
      setImageUrl("");
      onChangeImage("");
    } catch (error) {
      console.error(
        "Error deleting the image:",
        error instanceof Error ? error.message : error
      );
    }
  };

  useEffect(() => {
    if (profileImageUrl) setImageUrl(profileImageUrl);
    return () => abortControllerRef.current?.abort();
  }, [profileImageUrl]);

  const triggerFileInput = () => fileInputRef.current?.click();

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = (1 - uploadProgress / 100) * circumference;

  return (
    <div className="max-w-sm flex flex-col mx-auto p-4 pt-0 bg-white rounded-lg">
      <div className="mb-4 text-right">{title}</div>
      <div className="mb-4 flex flex-col items-center justify-center relative">
        {modalImagePreview()}
        <div className="relative w-[180px] h-[180px]">
          {!imageUrl && (
            <div
              className={`w-[180px] h-[180px] mb-4 flex items-center justify-center ${
                type === "profile" ? "rounded-full" : "rounded-[16.875px]"
              }`}
            >
              {type === "profile" ? (
                <svg
                  width="180"
                  height="180"
                  viewBox="-2 -2 110 110"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="53.5"
                    cy="52.5"
                    r="52.5"
                    stroke="#BCBEC0"
                    strokeWidth="2"
                  />

                  <path
                    d="M53 106C38.8432 106 25.5338 100.487 15.5234 90.4766C5.51283 80.4662 0 67.1568 0 53C0 38.8432 5.51283 25.5338 15.5234 15.5234C25.5338 5.51283 38.8432 0 53 0C67.1568 0 80.4662 5.51283 90.4766 15.5234C100.487 25.5338 106 38.8432 106 53C106 67.1568 100.487 80.4662 90.4766 90.4766C80.4662 100.487 67.1568 106 53 106ZM53 4.14062C26.0588 4.14062 4.14062 26.0588 4.14062 53C4.14062 79.9412 26.0588 101.859 53 101.859C79.9412 101.859 101.859 79.9412 101.859 53C101.859 26.0588 79.9412 4.14062 53 4.14062Z"
                    fill="#BCBEC0"
                    stroke="#BCBEC0"
                    strokeWidth="2"
                  />
                  <path
                    d="M53 62.0538C41.6963 62.0538 32.5 52.8577 32.5 41.554C32.5 30.2503 41.6961 21.054 53 21.054C64.3039 21.054 73.5001 30.2501 73.5001 41.554C73.5001 52.8577 64.3037 62.0538 53 62.0538ZM53 25.1946C43.9795 25.1946 36.6406 32.5334 36.6406 41.554C36.6406 50.5745 43.9795 57.9132 53 57.9132C62.0206 57.9132 69.3594 50.5745 69.3594 41.554C69.3594 32.5334 62.0206 25.1946 53 25.1946Z"
                    fill="#BCBEC0"
                    stroke="#BCBEC0"
                    strokeWidth="2"
                  />
                  <path
                    d="M88.4081 91.6778C87.4235 91.6778 86.5507 90.9731 86.3724 89.9698C83.4945 73.7943 69.4594 62.0537 53 62.0537C36.5406 62.0537 22.5057 73.794 19.6276 89.9698C19.4274 91.0956 18.3527 91.8459 17.2267 91.6455C16.1008 91.4453 15.3505 90.3702 15.5509 89.2446C17.0956 80.5627 21.6741 72.6276 28.443 66.9005C35.293 61.1049 44.014 57.9131 53 57.9131C61.986 57.9131 70.707 61.1049 77.557 66.9005C84.3259 72.6276 88.9044 80.5627 90.4491 89.2446C90.6495 90.3702 89.8992 91.4451 88.7733 91.6455C88.6508 91.6673 88.5284 91.6778 88.4081 91.6778Z"
                    fill="#BCBEC0"
                    stroke="#BCBEC0"
                    strokeWidth="2"
                  />
                </svg>
              ) : (
                <svg
                  width="180px"
                  height="180px"
                  viewBox="0 0 32 32"
                  version="1.1"
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
                      fill="#BCBEC0"
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

          {/* Progress ring */}
          {type === "profile" ? (
            <svg
              className="absolute top-0 left-0 pointer-events-none"
              width={radius * 2}
              height={radius * 2}
              viewBox={`0 0 ${radius * 2} ${radius * 2}`}
            >
              <circle
                cx={radius}
                cy={radius}
                r={radius - 6.5 / 2}
                fill="none"
                stroke={colors.progress}
                strokeWidth={6.5}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(-90 ${radius} ${radius})`}
                style={{ transition: "stroke-dashoffset 0.3s ease" }}
              />
            </svg>
          ) : null}

          {!viewOnly && (
            <>
              <button
                style={{ backgroundColor: colors.primary }}
                className={`absolute p-[5px] rounded-full shadow-lg ${
                  type === "profile" ? "bottom-2 right-4" : "bottom-2 right-2"
                }`}
                onClick={triggerFileInput}
              >
                <HiOutlinePencilSquare color="#fff" size={28} />
              </button>
              {imageUrl && (
                <button
                  style={{ backgroundColor: colors.error }}
                  className={`absolute p-[5px] rounded-full shadow-lg ${
                    type === "profile" ? "bottom-2 left-4" : "bottom-2 left-2"
                  }`}
                  onClick={handleDeleteImage}
                >
                  <MdDeleteOutline color="#fff" size={28} />
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
        />
      </div>
    </div>
  );
};

export default PictureSelector;
