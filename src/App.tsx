import React, { useState, useEffect } from "react";
import PictureSelector from "./components/pictureSelector/PictureSelector";
import Particles from "./components/Particles";
import Card from "./components/Card";
import { FaCheck, FaGithub, FaNpm, FaRegCopy } from "react-icons/fa";
import GithubReadmeFetcher from "./components/githubReadmeFetcher/githubReadmeFetcher";

const App: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [defaultImgUrl, setDefaultImgUrl] = useState<string | null>(null);
  const [smallImgUrl, setSmallImgUrl] = useState<string | null>(null);
  const [rectangleImgUrl, setRectangleImgUrl] = useState<string | null>(null);
  const [customColorsImgUrl, setCustomColorsImgUrl] = useState<string | null>(
    null
  );
  const [noProgressImgUrl, setNoProgressImgUrl] = useState<string | null>(null);

  const handleDefaultImageChange = (newImageUrl: string) => {
    setDefaultImgUrl(newImageUrl || null);
  };
  const handleSmallImageChange = (newImageUrl: string) => {
    setSmallImgUrl(newImageUrl || null);
  };
  const handleRectangleImageChange = (newImageUrl: string) => {
    setRectangleImgUrl(newImageUrl || null);
  };
  const handleCustomColorsImageChange = (newImageUrl: string) => {
    setCustomColorsImgUrl(newImageUrl || null);
  };
  const handleNoProgressImageChange = (newImageUrl: string) => {
    setNoProgressImgUrl(newImageUrl || null);
  };

  const customColors = {
    primary: "#d24670",
    error: "#ff4754",
    progress: "#00FFF7",
    placeholder: "#A0AEC0",
    text: "#F5F5F5",
    textDisabled: "#E2E8F0",
    buttonText: "#FFFFFF",
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("npm install react-picture-selector");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-black">
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

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Default example (Profile) */}
          <Card>
            <PictureSelector
              additionalClassNames={{
                edit: "cursor-target",
                delete: "cursor-target",
                image: "cursor-target",
              }}
              imageUrl={defaultImgUrl}
              onChangeImage={handleDefaultImageChange}
              title="Default example (Profile)"
              testMode
            />
          </Card>

          {/* Small size example */}
          <Card>
            <PictureSelector
              imageUrl={smallImgUrl}
              onChangeImage={handleSmallImageChange}
              size={120}
              title="Small size example"
              testMode
            />
          </Card>

          {/* Rectangle shape example */}
          <Card>
            <PictureSelector
              imageUrl={rectangleImgUrl}
              onChangeImage={handleRectangleImageChange}
              title="Rectangle shape example"
              type="image"
              testMode
            />
          </Card>

          {/* Custom colors example */}
          <Card>
            <PictureSelector
              imageUrl={customColorsImgUrl}
              onChangeImage={handleCustomColorsImageChange}
              colors={customColors}
              title="Custom colors example"
              testMode
            />
          </Card>

          {/* View-only example (non-editable) */}
          <Card>
            <PictureSelector
              imageUrl="https://avatars.githubusercontent.com/u/156062098?v=4"
              onChangeImage={() => {}}
              viewOnly={true}
              title="View only example (non editable)"
              testMode
            />
          </Card>

          {/* No progress ring example */}
          <Card>
            <PictureSelector
              imageUrl={noProgressImgUrl}
              onChangeImage={handleNoProgressImageChange}
              showProgressRing={false}
              title="No progress ring example"
              testMode
            />
          </Card>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center my-6 gap-4 text-gray-300 w-full max-w-3xl mx-auto">
          {/* Copy Section */}
          <div
            onClick={handleCopy}
            className="flex flex-col md:flex-row items-center justify-center gap-2 bg-gray-300/30 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer select-none w-full md:w-auto"
            title="Click to copy"
          >
            <FaNpm className="w-6 h-6 text-white shrink-0" />

            <div className="flex flex-col md:flex-row items-center gap-2 text-center md:text-left mt-2 md:mt-0">
              <span className="whitespace-nowrap">Install with</span>
              <div className="flex items-center gap-2">
                <code className="bg-gray-900 px-2 py-1 rounded text-sm md:text-base break-all max-w-[70vw] md:max-w-none truncate">
                  npm install react-picture-selector
                </code>
                {copied ? (
                  <FaCheck className="w-4 h-4 text-green-600 shrink-0" />
                ) : (
                  <FaRegCopy className="w-4 h-4 text-gray-400 shrink-0" />
                )}
              </div>
            </div>
          </div>

          {/* GitHub Link */}
          <a
            href="https://github.com/Zephinax/PictureSelector"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gray-300/30 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow hover:bg-gray-700 text-white w-full md:w-auto"
          >
            <FaGithub className="w-6 h-6 text-white shrink-0" />
            <span className="whitespace-nowrap">View on GitHub</span>
          </a>
        </div>

        {/* README Section */}
        <div className="mt-12">
          <GithubReadmeFetcher readmeUrl="https://github.com/Zephinax/react-picture-selector/blob/main/README.md" />
        </div>

        <h2 className="text-xl text-[#d24670] font-bold text-center mt-8">
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
          <a
            target="_blank"
            href="https://zephinax.com"
            className="underline cursor-pointer"
          >
            Zephinax
          </a>
        </h2>
      </div>
    </div>
  );
};

export default App;
