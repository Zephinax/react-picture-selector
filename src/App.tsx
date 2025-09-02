import React from "react";
import PictureSelector from "./components/PictureSelector";

const App: React.FC = () => {
  const handleImageChange = (newImageUrl: string) => {
    console.log("Selected image URL:", newImageUrl);
    // اینجا میتونی URL رو به سرور بفرستی یا state مدیریت کنی
  };

  const handleDelete = () => {
    console.log("Image deleted");
    // عملیات بعد از حذف عکس
  };

  // پالت رنگی سفارشی
  const customColors = {
    primary: "#8B5CF6", // بنفش
    error: "#F43F5E", // صورتی
    progress: "#06B6D4", // cyan
    placeholder: "#94A3B8", // slate-400
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-center mb-8">
        Picture Selector Examples
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* نمونه پیشفرض (پروفایل) */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">پروفایل پیشفرض</h2>
          <PictureSelector
            profileImageUrl=""
            onChangeImage={handleImageChange}
            title="عکس پروفایل"
            testMode
          />
        </div>

        {/* نمونه با سایز کوچکتر */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">پروفایل کوچک</h2>
          <PictureSelector
            profileImageUrl=""
            onChangeImage={handleImageChange}
            size={120}
            title="عکس کوچک"
            testMode
          />
        </div>

        {/* نمونه با رنگ‌های سفارشی */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">پالت رنگی سفارشی</h2>
          <PictureSelector
            profileImageUrl=""
            onChangeImage={handleImageChange}
            colors={customColors}
            title="پالت سفارشی"
            testMode
          />
        </div>

        {/* نمونه عکس معمولی (غیر پروفایل) */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">عکس معمولی</h2>
          <PictureSelector
            profileImageUrl=""
            onChangeImage={handleImageChange}
            title="عکس محصول"
            testMode
          />
        </div>

        {/* نمونه با انحنای زیاد */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">انحنای زیاد</h2>
          <PictureSelector
            profileImageUrl=""
            onChangeImage={handleImageChange}
            borderRadius={30}
            title="گوشه گرد"
            testMode
          />
        </div>

        {/* نمونه فقط نمایشی (غیرقابل ویرایش) */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">حالت نمایشی</h2>
          <PictureSelector
            profileImageUrl="https://archive.smashing.media/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/68dd54ca-60cf-4ef7-898b-26d7cbe48ec7/10-dithering-opt.jpg"
            onChangeImage={handleImageChange}
            viewOnly={true}
            title="فقط نمایش"
            testMode
          />
        </div>

        {/* نمونه با آدرس API سفارشی */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">API سفارشی</h2>
          <PictureSelector
            profileImageUrl=""
            onChangeImage={handleImageChange}
            uploadUrl="api/upload-image"
            deleteUrl="api/delete-image"
            apiBaseUrl="https://my-api.com/"
            title="API سفارشی"
            testMode
          />
        </div>

        {/* نمونه بدون حلقه پیشرفت */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">بدون حلقه پیشرفت</h2>
          <PictureSelector
            profileImageUrl=""
            onChangeImage={handleImageChange}
            showProgressRing={false}
            title="بدون Progress"
            testMode
          />
        </div>

        {/* نمونه با شکل مستطیل */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">مستطیل</h2>
          <PictureSelector
            profileImageUrl=""
            onChangeImage={handleImageChange}
            shape="rounded"
            borderRadius={10}
            title="عکس مستطیل"
            testMode
          />
        </div>
      </div>
    </div>
  );
};

export default App;
