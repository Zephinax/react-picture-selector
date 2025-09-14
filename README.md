<p align="center">
  <img 
    src="https://raw.githubusercontent.com/Zephinax/react-picture-selector/refs/heads/dev/public/circle.gif" 
    alt="Profile Picture Upload Animation"
  />
</p>

<h1 align="center">
  React Picture Selector
  <br/>
  <a href="https://zephinax.github.io/react-picture-selector" target="_blank">Click Here To Show Demo</a>
</h1>

![React](https://img.shields.io/badge/React-18.x-%231DAFBF) ![TypeScript](https://img.shields.io/badge/TypeScript-Included-%23178C6) ![Axios](https://img.shields.io/badge/Axios-1.x-%235A29E4)

The `PictureSelector` component is a highly customizable React component designed for seamless image upload, deletion, and preview functionality, ideal for profile pictures or general image management. It supports real API-based operations and a test mode for simulating uploads and deletions, making it versatile for both production and development environments.

## Table of Contents

<ul>
  <li><a href="#features">Features</a></li>
  <li><a href="#installation">Installation</a></li>
  <li><a href="#usage">Usage</a></li>
  <li><a href="#props">Props</a></li>
  <li><a href="#dependencies">Dependencies</a></li>
  <li><a href="#api-configuration">API Configuration</a></li>
  <li><a href="#test-mode">Test Mode</a></li>
  <li><a href="#styling">Styling</a></li>
  <li><a href="#error-handling">Error Handling</a></li>
  <li><a href="#example">Example</a></li>
  <li><a href="#release-notes">Release Notes</a></li>
</ul>

## Features

- **Smooth Image Upload**: Upload images with a visually appealing progress ring (for profiles) or percentage display, powered by `requestAnimationFrame` for smooth animations and low CPU usage.
- **Image Deletion**: Delete images via API or simulated deletion in test mode.
- **Progress Indicator**: Displays a progress ring for circular profiles or a percentage-based indicator, with non-linear fallback for servers without `Content-Length`.
- **Image Preview**: Clickable modal preview for uploaded images, supporting circular and rectangular formats.
- **Configurable Styling**: Customize colors, sizes, shapes, and additional CSS classes for full control over appearance.
- **Abort Controller**: Cancel ongoing uploads using `AbortController` for better user control.
- **Test Mode**: Simulate uploads and deletions with configurable delays, ideal for testing without API dependencies.
- **Responsive Design**: Supports RTL layouts, responsive sizing, and both circular (profile) و rectangular image types.
- **Robust Error Handling**: Displays clear error messages for failed operations, with proper cleanup to prevent resource leaks.
- **Performance Optimizations**: Prevents race conditions, ensures clean percentage displays, and optimizes resource usage.

## Installation

1. Ensure you have React and the required dependencies installed.
2. Install the package:
   ```bash
   npm i react-picture-selector
   ```
3. Import and use the component in your React application.

## Usage

Import the `PictureSelector` component and configure it with the necessary props to control its behavior and appearance.

```jsx
import PictureSelector from "react-picture-selector";

const App = () => {
  const handleImageChange = (imageUrl: string) => {
    console.log("New image URL:", imageUrl);
  };

  return (
    <PictureSelector
      imageUrl="https://www.gravatar.com/avatar/f84a9c7b670949d7c5534ae374217ac9?s=256&d=initials"
      onChangeImage={handleImageChange}
      type="profile"
      title="Profile Picture"
      size={180}
    />
  );
};
```

## Props

<table>
  <thead>
    <tr>
      <th>Prop</th>
      <th>Type</th>
      <th>Default Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>apiConfig</code></td>
      <td><code>apiConfig</code></td>
      <td>See below</td>
      <td>Configuration for API endpoints and headers.</td>
    </tr>
    <tr>
      <td><code>imageUrl</code></td>
      <td><code>string | null</code></td>
      <td><code>null</code></td>
      <td>Initial image URL to display.</td>
    </tr>
    <tr>
      <td><code>onChangeImage</code></td>
      <td><code>(url: string) => void</code></td>
      <td>-</td>
      <td>Callback triggered when the image changes (upload or deletion).</td>
    </tr>
    <tr>
      <td><code>type</code></td>
      <td><code>"profile" | "image"</code></td>
      <td><code>"profile"</code></td>
      <td>Image shape: circular (<code>profile</code>) or rectangular (<code>image</code>).</td>
    </tr>
    <tr>
      <td><code>title</code></td>
      <td><code>string</code></td>
      <td><code>"Profile Picture"</code></td>
      <td>Title displayed above the component.</td>
    </tr>
    <tr>
      <td><code>size</code></td>
      <td><code>number</code></td>
      <td><code>180</code></td>
      <td>Size of the image container in pixels.</td>
    </tr>
    <tr>
      <td><code>colors</code></td>
      <td><code>ColorPalette</code></td>
      <td>See below</td>
      <td>Custom colors for buttons, progress, and text.</td>
    </tr>
    <tr>
      <td><code>additionalClassNames</code></td>
      <td><code>additionalClassNames</code></td>
      <td><code>{}</code></td>
      <td>Custom CSS classes for title, buttons, and image.</td>
    </tr>
    <tr>
      <td><code>viewOnly</code></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
      <td>Disables edit/delete buttons for view-only mode.</td>
    </tr>
    <tr>
      <td><code>showProgressRing</code></td>
      <td><code>boolean</code></td>
      <td><code>true</code></td>
      <td>Shows progress ring for circular profiles or percentage for others.</td>
    </tr>
    <tr>
      <td><code>blurOnProgress</code></td>
      <td><code>boolean</code></td>
      <td><code>true</code></td>
      <td>Applies blur effect during uploads when an image is present.</td>
    </tr>
    <tr>
      <td><code>enableAbortController</code></td>
      <td><code>boolean</code></td>
      <td><code>true</code></td>
      <td>Enables <code>AbortController</code> for canceling uploads.</td>
    </tr>
    <tr>
      <td><code>testMode</code></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
      <td>Enables test mode for simulated uploads/deletions.</td>
    </tr>
    <tr>
      <td><code>testUploadDelay</code></td>
      <td><code>number</code></td>
      <td><code>1000</code></td>
      <td>Delay (in ms) for simulated uploads in test mode.</td>
    </tr>
  </tbody>
</table>

### ColorPalette Interface

```typescript
interface ColorPalette {
  primary: string; // Edit button background color
  error: string; // Delete button background color
  progress: string; // Progress ring/percentage color
  placeholder: string; // Placeholder SVG color
  text: string; // Progress percentage text color
  textDisabled: string; // Disabled button text/icon color
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
- **React Icons**: For edit, delete, and loading icons.

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
import PictureSelector from "react-picture-selector";

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
      imageUrl="https://www.gravatar.com/avatar/f84a9c7b670949d7c5534ae374217ac9?s=256&d=initials"
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
