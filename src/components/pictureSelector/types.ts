import { ReactNode } from "react";

export interface ProfileSelectorPropsTypes {
  profileImageUrl: string | null;
  onChangeImage: (img: string) => void;
  type?: "profile" | "image";
  viewOnly?: boolean;
  title?: string;
}

export interface ModalProps {
  title: string | ReactNode;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  childrenClass?: string;

  overflowY?:
    | "overflow-y-auto"
    | "overflow-y-hidden"
    | "overflow-y-visible"
    | "overflow-y-scroll"
    | "overflow-y-clip";
  size?: "sm" | "md" | "lg" | "xl" | "full" | "fit";
}

export interface UploadResponse {
  data?: string;
}

// Configurable color palette
export interface ColorPalette {
  primary: string;
  error: string;
  progress: string;
  placeholder: string;
  text: string;
  textDisabled: string;
}

export interface additionalClassNames {
  title?: string;
  titleContainer?: string;
  delete?: string;
  edit?: string;
  image?: string;
}

export interface apiConfig {
  deleteUrl: string;
  uploadUrl: string;
  baseUrl?: string;
  formDataName?: string;
  additionalHeaders?: any;
}
