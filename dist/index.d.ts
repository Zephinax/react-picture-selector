import * as react_jsx_runtime from 'react/jsx-runtime';

interface apiConfig {
    deleteUrl: string;
    uploadUrl: string;
    baseUrl: string;
    responsePath?: string;
    formDataName?: string;
    additionalHeaders?: Record<string, string>;
    uploadMethod?: "POST" | "PUT" | "PATCH";
    deleteMethod?: "POST" | "DELETE" | "PUT";
    deleteBody?: Record<string, unknown> | ((imageUrl: string) => Record<string, unknown>);
    onUploadSuccess?: (url: string) => void;
    onUploadError?: (error: any) => void;
    onDeleteStart?: () => void;
    onDeleteSuccess?: () => void;
}
interface ProfileSelectorPropsTypes {
    imageUrl: string | null;
    onChangeImage: (img: string) => void;
    type?: "profile" | "image";
    viewOnly?: boolean;
    title?: string;
    size?: number;
    colors?: ColorPalette;
    apiConfig?: apiConfig;
    additionalClassNames?: additionalClassNames;
    showProgressRing?: boolean;
    blurOnProgress?: boolean;
    enableAbortController?: boolean;
    testMode?: boolean;
    testUploadDelay?: number;
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

declare const PictureSelector: ({ apiConfig, additionalClassNames, colors, imageUrl, type, onChangeImage, viewOnly, title, size, showProgressRing, blurOnProgress, enableAbortController, testMode, testUploadDelay, }: ProfileSelectorPropsTypes) => react_jsx_runtime.JSX.Element;

export { PictureSelector as default };
export type { ProfileSelectorPropsTypes };
