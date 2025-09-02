import React from "react";
import PictureSelector from "./components/PictureSelector";

const App: React.FC = () => {
  const handleChange = (newImageUrl: string) => {
    console.log("Selected image URL:", newImageUrl);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-xl font-bold mb-4">Profile Picture Selector</h1>
        <PictureSelector profileImageUrl="" onChangeImage={handleChange} />
      </div>
    </div>
  );
};

export default App;
