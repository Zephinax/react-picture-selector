import React from "react";
import PictureSelector from "./components/PictureSelector";
import Particles from "./components/Particles";

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
    text: "#fafafa",
    textDisabled: "#e6e6e6",
  };

  return (
    <div className="min-h-screen w-screen  p-6 bg-black">
      <div
        style={{ width: "100%", height: "100vh", position: "absolute" }}
        className="top-0"
      >
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={300}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      <div className="min-h-screen p-6">
        <h1 className="text-2xl font-bold text-center mb-8">
          Picture Selector Examples
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1300px] mx-auto">
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
            <h2 className="text-lg font-semibold mb-16">Small Profile</h2>

            <div className="mt-10">
              <PictureSelector
                profileImageUrl=""
                onChangeImage={handleImageChange}
                size={120}
                title=""
                testMode
              />
            </div>
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
              title=""
              type="image"
              testMode
            />
          </div>
        </div>
        <h2 className="text-2xl text-[#d24670] font-bold text-center mt-8">
          Design with{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 inline text-[#d24670]"
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
             2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09
             C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 
             22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>{" "}
          by{" "}
          <a href="" className="underline cursor-pointer">
            Zephinax
          </a>
        </h2>
      </div>
    </div>
  );
};

export default App;
