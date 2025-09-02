import React from "react";
import PictureSelector from "./components/PictureSelector";

const App: React.FC = () => {
  const handleImageChange = (newImageUrl: string) => {
    console.log("Selected image URL:", newImageUrl);
    // You can send the URL to the server or manage state here
  };

  const handleDelete = () => {
    console.log("Image deleted");
    // Operations after image deletion
  };

  // Custom color palette
  const customColors = {
    primary: "#8B5CF6", // Purple
    error: "#F43F5E", // Pink
    progress: "#06B6D4", // Cyan
    placeholder: "#94A3B8", // Slate-400
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-center mb-8">
        Picture Selector Examples
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Default example (Profile) */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Default Profile</h2>
          <PictureSelector
            profileImageUrl=""
            onChangeImage={handleImageChange}
            title=""
            testMode
          />
        </div>

        {/* Small size example */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Small Profile</h2>
          <PictureSelector
            profileImageUrl=""
            onChangeImage={handleImageChange}
            size={120}
            title=""
            testMode
          />
        </div>

        {/* Custom colors example */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Custom Color Palette</h2>
          <PictureSelector
            profileImageUrl=""
            onChangeImage={handleImageChange}
            colors={customColors}
            title=""
            testMode
          />
        </div>

        {/* Regular image example (non-profile) */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Regular Image</h2>
          <PictureSelector
            profileImageUrl=""
            onChangeImage={handleImageChange}
            title=""
            testMode
          />
        </div>

        {/* High border radius example */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">High Border Radius</h2>
          <PictureSelector
            profileImageUrl=""
            onChangeImage={handleImageChange}
            borderRadius={30}
            title=""
            testMode
          />
        </div>

        {/* View-only example (non-editable) */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">View Only Mode</h2>
          <PictureSelector
            profileImageUrl="https://archive.smashing.media/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/68dd54ca-60cf-4ef7-898b-26d7cbe48ec7/10-dithering-opt.jpg"
            onChangeImage={handleImageChange}
            viewOnly={true}
            title=""
            testMode
          />
        </div>

        {/* Custom API URL example */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Custom API</h2>
          <PictureSelector
            profileImageUrl=""
            onChangeImage={handleImageChange}
            uploadUrl="api/upload-image"
            deleteUrl="api/delete-image"
            apiBaseUrl="https://my-api.com/"
            title=""
            testMode
          />
        </div>

        {/* No progress ring example */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">No Progress Ring</h2>
          <PictureSelector
            profileImageUrl=""
            onChangeImage={handleImageChange}
            showProgressRing={false}
            title=""
            testMode
          />
        </div>

        {/* Rectangle shape example */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Rectangle</h2>
          <PictureSelector
            profileImageUrl=""
            onChangeImage={handleImageChange}
            shape="rounded"
            borderRadius={10}
            title=""
            testMode
          />
        </div>
      </div>
    </div>
  );
};

export default App;
