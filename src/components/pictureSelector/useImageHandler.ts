import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { handleError } from "./errorHandler";
import { apiConfig } from "./types";

interface UseImageHandlerProps {
  apiConfig: apiConfig;
  testMode: boolean;
  testUploadDelay: number;
  initialImageUrl: string | null;
  onChangeImage: (url: string) => void;
  enableAbortController: boolean;
}

const getNestedValue = (obj: any, path: string | string[]): any => {
  if (!obj) return null;
  const pathArray = Array.isArray(path) ? path : path.split(".");
  return pathArray.reduce(
    (current, key) =>
      current && current[key] !== undefined ? current[key] : null,
    obj
  );
};

export const useImageHandler = ({
  apiConfig,
  testMode,
  testUploadDelay,
  initialImageUrl,
  onChangeImage,
  enableAbortController,
}: UseImageHandlerProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const testIntervalRef = useRef<any | null>(null); // فقط برای testMode
  const smoothIntervalRef = useRef<any | null>(null); // فقط برای smooth در real mode
  const targetProgressRef = useRef<number>(0);

  const handleAbort = () => {
    if (!enableAbortController) return new AbortController();
    abortControllerRef.current?.abort();
    if (testIntervalRef.current) {
      clearInterval(testIntervalRef.current);
      testIntervalRef.current = null;
    }
    if (smoothIntervalRef.current) {
      clearInterval(smoothIntervalRef.current);
      smoothIntervalRef.current = null;
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    return abortController;
  };

  // تابع smooth فقط برای real mode (هر 50ms گام کوچک به سمت هدف با ease-out)
  const smoothProgressUpdate = () => {
    if (smoothIntervalRef.current) return; // جلوگیری از multiple
    smoothIntervalRef.current = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= targetProgressRef.current || prev >= 100) {
          clearInterval(smoothIntervalRef.current!);
          smoothIntervalRef.current = null;
          return Math.min(100, prev);
        }
        // گام دینامیک با ease-out (کوچک‌تر در پایان)
        const diff = targetProgressRef.current - prev;
        const step = Math.max(0.5, diff * 0.1); // 10% از فاصله، حداقل 0.5
        return Math.min(100, prev + step);
      });
    }, 50);
  };

  const simulateUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        let progress = 0;
        const interval = testUploadDelay / 100; // e.g., 10ms for 1000ms total
        testIntervalRef.current = setInterval(() => {
          progress += 1;
          setUploadProgress(progress); // مستقیم ست کن برای test (روان)
          if (progress >= 100) {
            clearInterval(testIntervalRef.current!);
            testIntervalRef.current = null;
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
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    const abortController = handleAbort();
    setLoading(true);
    setUploadProgress(0); // از 0 شروع کن
    targetProgressRef.current = 0;

    try {
      const minUploadTime = new Promise((resolve) => setTimeout(resolve, 1000)); // حداقل 1 ثانیه

      if (testMode) {
        if (imageUrl) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
        const base64Image = await simulateUpload(file); // progress مستقیم آپدیت می‌شه
        if (abortController.signal.aborted) {
          throw new Error("Upload canceled");
        }
        await minUploadTime; // بعد از simulate، صبر اضافی اگر لازم
        setLoading(false);
        setImageUrl(base64Image);
        onChangeImage(base64Image);
        setUploadProgress(0);
      } else {
        // real mode
        if (imageUrl) {
          await axios.post(
            `${apiConfig.baseUrl}${apiConfig.deleteUrl}${imageUrl}`,
            null,
            { signal: abortController.signal }
          );
        }

        const formData = new FormData();
        formData.append(apiConfig.formDataName || "", file);

        const uploadPromise = axios.post(
          `${apiConfig.baseUrl}${apiConfig.uploadUrl}`,
          formData,
          {
            signal: abortController.signal,
            onUploadProgress: (progressEvent) => {
              let progress = 0;
              if (progressEvent.total && progressEvent.total > 0) {
                progress = Math.round(
                  (progressEvent.loaded / progressEvent.total) * 100
                );
              } else {
                // fallback
                progress = Math.min(99, uploadProgress + 2); // گام کوچکتر
              }
              targetProgressRef.current = Math.max(
                targetProgressRef.current,
                progress
              );
              smoothProgressUpdate(); // smooth فعال
            },
            headers: apiConfig.additionalHeaders,
          }
        );

        const [response] = await Promise.all([uploadPromise, minUploadTime]);

        // بعد از موفقیت، به 100% برسون
        targetProgressRef.current = 100;
        smoothProgressUpdate(); // smooth به 100

        await new Promise((resolve) => setTimeout(resolve, 300)); // کمی صبر برای دیدن 100%

        setLoading(false);
        const newImageUrl = getNestedValue(
          response,
          apiConfig.responsePath || "data.data"
        );
        if (newImageUrl) {
          setImageUrl(newImageUrl);
          onChangeImage(newImageUrl);
          setUploadProgress(0);
          targetProgressRef.current = 0;
        } else {
          throw new Error("Failed to extract image URL from response");
        }
      }
    } catch (error: any) {
      if (
        error.name === "CanceledError" ||
        error.message === "Upload canceled"
      ) {
        // نادیده بگیر
      } else {
        console.error(
          testMode
            ? "🧪 Test Mode: Error simulating upload:"
            : "Error uploading the image:",
          error instanceof Error ? error.message : error
        );
        setError("Failed to upload image");
      }
      setLoading(false);
      setUploadProgress(0);
      targetProgressRef.current = 0;
      if (testIntervalRef.current) {
        clearInterval(testIntervalRef.current);
        testIntervalRef.current = null;
      }
      if (smoothIntervalRef.current) {
        clearInterval(smoothIntervalRef.current);
        smoothIntervalRef.current = null;
      }
    }
  };

  const handleDeleteImage = async () => {
    if (!imageUrl) return;

    const abortController = handleAbort();
    setDeleting(true);
    setError(null);
    try {
      if (testMode) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (abortController.signal.aborted) {
          throw new Error("Delete canceled");
        }
        setImageUrl(null);
        onChangeImage("");
      } else {
        await axios.post(
          `${apiConfig.baseUrl}${apiConfig.deleteUrl}${imageUrl}`,
          null,
          { signal: abortController.signal }
        );
        setImageUrl(null);
        onChangeImage("");
      }
    } catch (error) {
      handleError(error, {
        setError: setError,
        context: "deleting image",
        isTestMode: testMode,
      });
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    setImageUrl(initialImageUrl);
    return () => {
      if (enableAbortController) {
        abortControllerRef.current?.abort();
      }
      if (testIntervalRef.current) {
        clearInterval(testIntervalRef.current);
        testIntervalRef.current = null;
      }
      if (smoothIntervalRef.current) {
        clearInterval(smoothIntervalRef.current);
        smoothIntervalRef.current = null;
      }
    };
  }, [initialImageUrl, enableAbortController]);

  return {
    imageUrl,
    uploadProgress,
    error,
    loading,
    deleting,
    handleImageChange,
    handleDeleteImage,
  };
};
