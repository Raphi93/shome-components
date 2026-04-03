export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'base64' | 'iframe';

export type ImageDto = {
  imageId: string;
  jobId: string;
  userId: string;
  createdAtUtc?: string | null;
  sizeBytes?: number | null;
  isActive: boolean;
  base64?: string | null;
  format?: string | null;
  fullPath?: string | null;
  href?: string;
};

export interface ImageLightBoxProps {
  data?: ImageDto[];
  type?: MediaType;
  children?: React.ReactNode;
  selectedImage: ImageDto;
  setSelectedImageParent?: (image: ImageDto) => void;
  onClose: () => void;
}
