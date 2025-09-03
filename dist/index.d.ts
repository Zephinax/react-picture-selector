import * as react_jsx_runtime from 'react/jsx-runtime';

interface ProfileSelectorPropsTypes {
    profileImageUrl: string | null;
    onChangeImage: (img: string) => void;
    deleteUrl?: string;
    uploadUrl?: string;
    type?: "profile" | "image";
    viewOnly?: boolean;
    title?: string;
}

interface ColorPalette {
    primary: string;
    error: string;
    progress: string;
    placeholder: string;
}
declare const PictureSelector: ({ deleteUrl, uploadUrl, profileImageUrl, type, onChangeImage, viewOnly, title, size, colors, apiBaseUrl, shape, borderRadius, showProgressRing, enableAbortController, testMode, testUploadDelay, }: ProfileSelectorPropsTypes & {
    size?: number;
    colors?: ColorPalette;
    apiBaseUrl?: string;
    shape?: "circle" | "rounded";
    borderRadius?: number;
    showProgressRing?: boolean;
    enableAbortController?: boolean;
    testMode?: boolean;
    testUploadDelay?: number;
}) => react_jsx_runtime.JSX.Element;

export { PictureSelector as default };
