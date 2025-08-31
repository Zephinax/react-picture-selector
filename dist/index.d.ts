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

declare const PictureSelector: ({ deleteUrl, uploadUrl, profileImageUrl, type, onChangeImage, viewOnly, title, }: ProfileSelectorPropsTypes) => react_jsx_runtime.JSX.Element;

export { PictureSelector as default };
