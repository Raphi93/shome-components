import { useState } from 'react';

import styles from './ImageCard.module.scss';

export interface ImageCardProps {
    type: 'image' | 'video' | 'audio' | 'document' | 'base64' | 'iframe';
    href: string;
    extension?: string;
    filename?: string;
    model?: string;
    onDelete?: () => void;
    onDownload?: () => void;
    onFullScreen?: () => void;
}

export function ImageCard({
    type,
    extension,
    href,
    filename,
    model,
    onDelete,
    onDownload,
    onFullScreen
}: ImageCardProps) {

    const [imageError, setImageError] = useState(false);

    const showNoImage = !href || (type === 'image' && imageError);

    const typeMapper = {
        image: showNoImage
            ? <div className={styles.noImage}>Kein Bild</div>
            : <img
                src={href} alt={filename || "Image"}
                onError={() => setImageError(true)}
                style={onFullScreen ? { cursor: "zoom-in" } : undefined}
                onClick={onFullScreen}
            />,

        video: <video
            controls
            src={href}
            style={onFullScreen ? { cursor: "zoom-in" } : undefined}
            onClick={onFullScreen}
        />,

        audio: <audio controls src={href} />,

        document: (
            <a href={href} target="_blank" rel="noopener noreferrer">
                {filename || "Document"}{extension ? `.${extension}` : ""}
            </a>
        ),

        base64: showNoImage
            ? <div className={styles.noImage}>Kein Bild</div>
            : <img
                src={`data:image/png;base64,${href}`}
                alt={filename || "Base64 Image"}
                onError={() => setImageError(true)}
                style={onFullScreen ? { cursor: "zoom-in" } : undefined}
                onClick={onFullScreen}
            />,

        iframe: <iframe
            style={onFullScreen ? { cursor: "zoom-in" } : undefined}
            onClick={onFullScreen}
            src={href} title={filename || "Iframe"}
        />
    };

    return (
        <div className={styles['image-card-container']}>
            <div className={styles['image-content']}>
                {typeMapper[type]}
            </div>

            {filename && (
                <div className={styles['image-name']} style={onFullScreen ? { cursor: "zoom-in" } : undefined} onClick={onFullScreen}>
                    {filename}{extension && `.${extension}`}{model && ` (${model})`}
                </div>
            )}

            {/* <div className={styles['image-actions']}>
                {showDelete && (
                    <Button
                        onClick={onDelete}
                        icon={faTrashAlt}
                        tooltip="Delete"
                    />
                )}

                {showDownload && (
                    <Button
                        onClick={onDownload}
                        icon={faDownload}
                        tooltip="Download"
                    />
                )}

                {showFullScreen && (
                    <Button
                        onClick={onFullScreen}
                        icon={faExpand}
                        tooltip="Full Screen"
                    />
                )}
            </div> */}
        </div>
    );
}