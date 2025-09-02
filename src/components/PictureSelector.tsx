import React, { useState, useEffect, useRef } from "react";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { ProfileSelectorPropsTypes } from "./types";
import useImagePreview from "../hooks/useImagePreview";

interface UploadResponse {
  data?: string;
}

// پالت رنگی قابل تنظیم
interface ColorPalette {
  primary: string;
  error: string;
  progress: string;
  placeholder: string;
}

const PictureSelector = ({
  deleteUrl = "POST_DELETE_AVATAR",
  uploadUrl = "POST_UPLOAD_AVATAR",
  profileImageUrl,
  type = "profile",
  onChangeImage,
  viewOnly = false,
  title = "تصویر پروفایل",
  size = 180, // سایز قابل تنظیم
  colors = {
    // پالت رنگی پیشفرض ولی قابل بازنویسی
    primary: "#3B82F6",
    error: "#EF4444",
    progress: "#FACC15",
    placeholder: "#BCBEC0",
  },
  apiBaseUrl = "BASE_URL_SERVICES", // آدرس پایه قابل تنظیم
  shape = "circle", // شکل دایره یا مستطیل با گوشه گرد
  borderRadius = 16.875, // میزان انحنای گوشه برای type غیر profile
  showProgressRing = true, // نمایش حلقه پیشرفت
  enableAbortController = true, // فعال/غیرفعال کردن abort controller
  testMode = false, // حالت تست
  testUploadDelay = 2000, // تاخیر شبیه‌سازی آپلود در حالت تست (میلی‌ثانیه)
}: ProfileSelectorPropsTypes & {
  size?: number;
  colors?: ColorPalette;
  apiBaseUrl?: string;
  shape?: "circle" | "rounded";
  borderRadius?: number;
  showProgressRing?: boolean;
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

  const isCircle = type === "profile" || shape === "circle";

  const handleAbort = () => {
    if (!enableAbortController) return new AbortController();

    abortControllerRef.current?.abort();

    // پاک کردن تایمر تست در صورت لغو
    if (testMode && testProgressRef.current) {
      clearInterval(testProgressRef.current);
      testProgressRef.current = null;
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    return abortController;
  };

  // شبیه‌سازی آپلود برای حالت تست
  const simulateUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        let progress = 0;
        const interval = testUploadDelay / 100; // تقسیم تاخیر به 100 قسمت

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
      reader.onerror = () => reject(new Error("خطا در خواندن فایل"));
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    // بررسی نوع فایل
    if (!file.type.startsWith("image/")) {
      alert("لطفا یک فایل تصویر انتخاب کنید");
      return;
    }

    const abortController = handleAbort();
    setLoading(true);
    setUploadProgress(0);

    try {
      if (testMode) {
        // حالت تست - شبیه‌سازی آپلود
        console.log("🧪 Test Mode: Simulating upload...");

        // شبیه‌سازی حذف تصویر قبلی
        if (imageUrl) {
          console.log("🧪 Test Mode: Simulating delete previous image");
          await new Promise((resolve) => setTimeout(resolve, 300));
        }

        const base64Image = await simulateUpload(file);

        // بررسی اگر درخواست لغو شده باشد
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
        // حالت واقعی - درخواست API
        // حذف تصویر قبلی اگر وجود دارد
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

      // پاک کردن تایمر در صورت خطا
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
        // حالت تست - شبیه‌سازی حذف
        console.log("🧪 Test Mode: Simulating delete image");
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (abortController.signal.aborted) {
          throw new Error("Delete canceled");
        }

        setImageUrl("");
        onChangeImage("");
        console.log("🧪 Test Mode: Delete simulation completed");
      } else {
        // حالت واقعی - درخواست API
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

      // پاک کردن تایمر تست در cleanup
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

  // استایل داینامیک برای تصویر
  const imageContainerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: isCircle ? "50%" : `${borderRadius}px`,
  };

  // محاسبه موقعیت دکمه‌ها بر اساس سایز
  const buttonPosition = size * 0.1; // 10% از سایز
  const buttonSize = size * 0.18; // 15% از سایز

  return (
    <div className="max-w-sm flex flex-col mx-auto p-4 pt-0 bg-white rounded-lg">
      <div className="mb-4 text-right">
        {title}
        {testMode && (
          <span className="mr-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            🧪 حالت تست
          </span>
        )}
      </div>
      <div className="mb-4 flex flex-col items-center justify-center relative">
        {modalImagePreview()}
        <div className="relative" style={imageContainerStyle}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Profile"
              className={`w-full h-full object-cover ${
                isCircle ? "rounded-full" : `rounded-[${borderRadius}px]`
              }`}
              onError={() => setImgError(true)}
              onClick={() => openImage(imageUrl)}
              style={{ cursor: "pointer" }}
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center bg-gray-100 ${
                isCircle ? "rounded-full" : `rounded-[${borderRadius}px]`
              }`}
            >
              {isCircle ? (
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
                  <path
                    d="M368,109 C366.896,109 366,108.104 366,107 C366,105.896 366.896,105 368,105 C369.104,105 370,105.896 370,107 C370,108.104 369.104,109 368,109 L368,109 Z M368,103 C365.791,103 364,104.791 364,107 C364,109.209 365.791,111 368,111 C370.209,111 372,109.209 372,107 C372,104.791 370.209,103 368,103 L368,103 Z M390,116.128 L384,110 L374.059,120.111 L370,116 L362,123.337 L362,103 C362,101.896 362.896,101 364,101 L388,101 C389.104,101 390,101.896 390,103 L390,116.128 L390,116.128 Z M390,127 C390,128.104 389.104,129 388,129 L382.832,129 L375.464,121.535 L384,112.999 L390,118.999 L390,127 L390,127 Z M364,129 C362.896,129 362,128.104 362,127 L362,126.061 L369.945,118.945 L380.001,129 L364,129 L364,129 Z M388,99 L364,99 C361.791,99 360,100.791 360,103 L360,127 C360,129.209 361.791,131 364,131 L388,131 C390.209,131 392,129.209 392,127 L392,103 C392,100.791 390.209,99 388,99 L388,99 Z"
                    fill={colors.placeholder}
                  />
                </svg>
              )}
            </div>
          )}

          {/* Progress ring */}
          {showProgressRing &&
            uploadProgress > 0 &&
            uploadProgress < 100 &&
            isCircle && (
              <svg
                className="absolute top-0 left-0 pointer-events-none"
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
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
                }}
                className="absolute p-1 rounded-full shadow-lg flex items-center justify-center"
                onClick={triggerFileInput}
                disabled={loading}
              >
                <HiOutlinePencilSquare color="#fff" size={buttonSize * 0.7} />
              </button>
              {imageUrl && (
                <button
                  style={{
                    backgroundColor: colors.error,
                    width: `${buttonSize}px`,
                    height: `${buttonSize}px`,
                    bottom: `${buttonPosition}px`,
                    left: `${buttonPosition}px`,
                  }}
                  className="absolute p-1 rounded-full shadow-lg flex items-center justify-center"
                  onClick={handleDeleteImage}
                  disabled={loading}
                >
                  <MdDeleteOutline color="#fff" size={buttonSize * 0.7} />
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

        {/* نمایش درصد روی تصویر فقط وقتی progress ring نداریم */}
        {loading && (!showProgressRing || !isCircle) && (
          <div
            className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center"
            style={{
              borderRadius: isCircle ? "50%" : `${borderRadius}px`,
            }}
          >
            <div className="text-gray-800 text-sm font-semibold">
              {uploadProgress}%
            </div>
          </div>
        )}
      </div>

      {/* نمایش اطلاعات تست در حالت تست */}
      {testMode && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="text-xs text-yellow-800">
            <div>
              🧪 <strong>حالت تست فعال است</strong>
            </div>
            <div>• هیچ درخواست API ارسال نمی‌شود</div>
            <div>• تاخیر شبیه‌سازی: {testUploadDelay}ms</div>
            <div>• تصاویر در حافظه محلی ذخیره می‌شوند</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PictureSelector;
