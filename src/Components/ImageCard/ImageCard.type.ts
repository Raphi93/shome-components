export type ImageCardMediaType = 'image' | 'video' | 'audio' | 'document' | 'base64' | 'iframe';

export interface ImageCardProps {
  type: ImageCardMediaType;
  href: string;
  extension?: string;
  filename?: string;
  model?: string;
  onDelete?: () => void;
  onDownload?: () => void;
  onFullScreen?: () => void;
}
