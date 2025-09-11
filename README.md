<div style="
  background-color: black; 
  display: flex; 
  width: 100%;
  justify-content: space-evenly; 
  align-items: center; 
  padding: 20px;
  margin-bottom: 10px;
">
  <img 
    src="https://raw.githubusercontent.com/Zephinax/react-picture-selector/refs/heads/dev/public/circle.gif" 
    alt="gif1"
    style="max-width: 45%; height: auto;"
  />
</div>

# [PictureSelector Component 👉 Demo](https://zephinax.github.io/ReactPictureSelector)

![React](https://img.shields.io/badge/React-18.x-%231DAFBF) ![TypeScript](https://img.shields.io/badge/TypeScript-Included-%23178C6) ![Axios](https://img.shields.io/badge/Axios-1.x-%235A29E4)

The `PictureSelector` component is a customizable React component designed for handling profile picture or image uploads, deletions, and previews. It supports both real API-based operations and a test mode for simulating uploads and deletions. The component is highly configurable, with options for styling, API configuration, progress indicators, and more.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)
- [Dependencies](#dependencies)
- [API Configuration](#api-configuration)
- [Test Mode](#test-mode)
- [Styling](#styling)
- [Error Handling](#error-handling)
- [Example](#example)

## Features

- **Image Upload**: Upload images via an API or simulate uploads in test mode.
- **Image Deletion**: Delete existing images with API support or simulation.
- **Progress Indicator**: Display a progress ring (for circular profiles) or a percentage-based progress bar during uploads.
- **Image Preview**: Clickable image preview with a modal view.
- **Configurable Styling**: Customize colors, sizes, and additional class names.
- **Abort Controller**: Cancel ongoing uploads using an AbortController.
- **Test Mode**: Simulate upload and deletion processes for testing without API calls.
- **Responsive Design**: Supports both circular (profile) and rectangular image types.
- **Error Handling**: Displays errors during upload or deletion processes.

## Installation

1. Ensure you have React and the required dependencies installed.
2. Install the necessary packages:
   ```bash
   npm install axios react-icons
   ```
3. Copy the `PictureSelector` component and its associated files (e.g., `types.ts`, `useImagePreview.ts`, `errorHandler.ts`) into your project.
4. Import and use the component in your React application.

## Usage

Import the `PictureSelector` component and include it in your JSX. Provide the necessary props to configure its behavior and appearance.

```jsx
import PictureSelector from "./PictureSelector";

const App = () => {
  const handleImageChange = (imageUrl: string) => {
    console.log("New image URL:", imageUrl);
  };

  return (
    <PictureSelector
      profileImageUrl="https://example.com/initial-image.jpg"
      onChangeImage={handleImageChange}
      type="profile"
      title="Profile Picture"
      size={180}
    />
  );
};
```

### ColorPalette Interface

```typescript
interface ColorPalette {
  primary: string; // Color for edit button
  error: string; // Color for delete button
  progress: string; // Color for progress ring
  placeholder: string; // Color for placeholder SVG
  text: string; // Text color for progress percentage
  textDisabled: string; // Disabled text color
}
```

### apiConfig Interface

```typescript
interface apiConfig {
  deleteUrl: string; // URL endpoint for deleting images
  uploadUrl: string; // URL endpoint for uploading images
  baseUrl?: string; // Base URL for API requests
  formDataName?: string; // Name of the file field in FormData
  additionalHeaders?: any; // Additional headers for API requests
}
```

### additionalClassNames Interface

```typescript
interface additionalClassNames {
  title?: string; // Class for title text
  titleContainer?: string; // Class for title container
  delete?: string; // Class for delete button
  edit?: string; // Class for edit button
  image?: string; // Class for image element
}
```

## Dependencies

- **React**: For component rendering and state management.
- **Axios**: For making API requests in real mode.
- **React Icons**: For edit, delete, and loading icons (`MdDeleteOutline`, `MdOutlineEdit`, `LuRefreshCcw`).
- **useImagePreview**: Custom hook for handling image previews.
- **errorHandler**: Utility for handling errors during API operations.

## API Configuration

The `apiConfig` prop allows you to specify the endpoints and headers for upload and delete operations. In real mode, the component sends HTTP POST requests to the provided URLs. Ensure your API supports:

- **Upload**: Accepts a `multipart/form-data` request with the file attached.
- **Delete**: Accepts a POST request to delete an image by its URL.

Example:

```typescript
const apiConfig = {
  baseUrl: "https://api.example.com/",
  uploadUrl: "/upload",
  deleteUrl: "/delete/",
  formDataName: "image",
  additionalHeaders: {
    "Content-Type": "multipart/form-data",
    Authorization: "Bearer your-token",
  },
};
```

## Test Mode

When `testMode` is set to `true`, the component simulates upload and deletion operations without making actual API calls. This is useful for development and testing. The `testUploadDelay` prop controls the duration of the simulated upload process (in milliseconds).

## Styling

The component uses Tailwind CSS classes for basic styling, but you can override styles using:

- The `colors` prop for color customization.
- The `additionalClassNames` prop to add custom CSS classes to specific elements.
- The `size` prop to adjust the dimensions of the image container.

The progress ring (for circular images) and progress bar (for rectangular images) are rendered using SVG elements, with styles derived from the `colors` prop.

## Error Handling

Errors during upload or deletion are handled by the `errorHandler` utility. If an error occurs:

- The error message is displayed below the component.
- In test mode, errors are logged with a "🧪 Test Mode" prefix for clarity.
- If an upload or deletion is canceled (via AbortController), a cancellation message is logged.

## Example

```jsx
import PictureSelector from "./PictureSelector";

const App = () => {
  const handleImageChange = (imageUrl: string) => {
    console.log("Image changed to:", imageUrl);
  };

  const customApiConfig = {
    baseUrl: "https://api.example.com/",
    uploadUrl: "/upload",
    deleteUrl: "/delete/",
    formDataName: "image",
    additionalHeaders: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer your-token",
    },
  };

  const customColors = {
    primary: "#1E90FF",
    error: "#FF0000",
    progress: "#FF69B4",
    placeholder: "#A9A9A9",
    text: "#FFFFFF",
    textDisabled: "#D3D3D3",
  };

  return (
    <PictureSelector
      apiConfig={customApiConfig}
      profileImageUrl="https://example.com/initial-image.jpg"
      onChangeImage={handleImageChange}
      type="profile"
      title="User Avatar"
      size={200}
      colors={customColors}
      showProgressRing={true}
      blurOnProgress={true}
      enableAbortController={true}
      testMode={false}
      testUploadDelay={1500}
    />
  );
};

export default App;
```
