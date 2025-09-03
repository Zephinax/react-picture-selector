import React from "react";
import PictureSelector from "./components/PictureSelector";
import Particles from "./components/Particles";
import Card from "./components/Card";

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
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      <div className="py-4 px-2">
        <div
          dir="ltr"
          className="flex flex-wrap gap-3 items-center justify-between w-full mb-8"
        >
          <h1 className="text-2xl font-bold text-center">
            Picture Selector Examples
          </h1>
          <h3
            dir="ltr"
            className="py-2 border text-yellow-200 max-w-xs rounded-2xl px-4"
          >
            <strong>Test Mode Activated</strong> 🧪
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1300px] mx-auto">
          {/* Default example (Profile) */}
          <Card>
            <PictureSelector
              additionalClassNames={{
                edit: "cursor-target",
                delete: "cursor-target",
                image: "cursor-target",
              }}
              profileImageUrl=""
              onChangeImage={handleImageChange}
              title="Default example (Profile)"
              testMode
            />
          </Card>

          {/* Small size example */}
          <Card>
            <PictureSelector
              profileImageUrl=""
              onChangeImage={handleImageChange}
              size={120}
              title="Small size example"
              testMode
            />
          </Card>

          {/* Custom colors example */}
          <Card>
            <PictureSelector
              profileImageUrl=""
              onChangeImage={handleImageChange}
              colors={customColors}
              title="Custom colors example"
              testMode
            />
          </Card>

          {/* Rectangle shape example */}
          <Card>
            <PictureSelector
              profileImageUrl=""
              onChangeImage={handleImageChange}
              title="Rectangle shape example"
              colors={customColors}
              type="image"
              testMode
            />
          </Card>

          {/* View-only example (non-editable) */}
          <Card>
            <PictureSelector
              profileImageUrl="https://avatars.githubusercontent.com/u/156062098?v=4"
              onChangeImage={handleImageChange}
              viewOnly={true}
              title="View only example (non editable)"
              testMode
            />
          </Card>

          {/* No progress ring example */}
          <Card>
            <PictureSelector
              profileImageUrl=""
              onChangeImage={handleImageChange}
              showProgressRing={false}
              title="No progress ring example"
              testMode
            />
          </Card>
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
