import * as react_jsx_runtime from 'react/jsx-runtime';

interface ProfileSelectorPropsTypes {
    profileImageUrl: string | null;
    onChangeImage: (img: string) => void;
    type?: "profile" | "image";
    viewOnly?: boolean;
    title?: string;
}
interface ColorPalette {
    primary: string;
    error: string;
    progress: string;
    placeholder: string;
    text: string;
    textDisabled: string;
}
interface additionalClassNames {
    title?: string;
    titleContainer?: string;
    delete?: string;
    edit?: string;
    image?: string;
}
interface apiConfig {
    deleteUrl: string;
    uploadUrl: string;
    baseUrl: string;
    responsePath: string;
    formDataName?: string;
    additionalHeaders?: any;
}

declare const PictureSelector: ({ apiConfig, additionalClassNames, colors, profileImageUrl, type, onChangeImage, viewOnly, title, size, showProgressRing, blurOnProgress, enableAbortController, testMode, testUploadDelay, }: ProfileSelectorPropsTypes & {
    size?: number;
    colors?: ColorPalette;
    apiConfig?: apiConfig;
    additionalClassNames?: additionalClassNames;
    showProgressRing?: boolean;
    blurOnProgress?: boolean;
    enableAbortController?: boolean;
    testMode?: boolean;
    testUploadDelay?: number;
}) => react_jsx_runtime.JSX.Element;

export { PictureSelector as default };
