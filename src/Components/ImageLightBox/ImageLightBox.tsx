'use client';

import { JSX, useEffect, useState } from 'react';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { usePhonePortraitAndBelowMediaQuery } from '../../hooks/useMediaQuery';

export type { ImageDto, ImageLightBoxProps, MediaType } from './ImageLightBox.type';
import type { ImageLightBoxProps, MediaType } from './ImageLightBox.type';

import styles from './ImageLightBox.module.scss';

export function ImageLightBox({
    data,
    type,
    selectedImage,
    onClose,
    children,
    setSelectedImageParent,
}: ImageLightBoxProps) {
    const isMobile = usePhonePortraitAndBelowMediaQuery();
    const [imageError, setImageError] = useState(false);
    const [selectedImageState, setSelectedImage] = useState(selectedImage);

    useEffect(() => {
        setSelectedImage(selectedImage);
        setImageError(false);
    }, [selectedImage]);

    function handleImageChange(direction: "next" | "prev") {
        if (!data?.length) return;

        const currentIndex = data.findIndex(
            (img) => img.imageId === selectedImageState.imageId
        );
        if (currentIndex < 0) return;

        const nextIndex =
            direction === "next"
                ? (currentIndex + 1) % data.length
                : (currentIndex - 1 + data.length) % data.length;

        const nextImage = data[nextIndex];
        setSelectedImage(nextImage);
        setSelectedImageParent?.(nextImage);
        setImageError(false);
    }

    const selectedType: MediaType = type ?? "image";
    const showNoImage =
        !selectedImageState.href ||
        (selectedType === "image" && imageError);

    const typeMapper: Record<MediaType, JSX.Element> = {
        image: showNoImage ? (
            <div className={styles.noImage}>Kein Bild</div>
        ) : (
            <img
                src={selectedImageState.href ?? ""}
                alt={selectedImageState.imageId ?? "Image"}
                onError={() => setImageError(true)}
                className={styles["lightbox-image"]}
            />
        ),

        video: (
            <video
                controls
                src={selectedImageState.href ?? ""}
                className={styles["lightbox-video"]}
            />
        ),

        audio: (
            <audio
                controls
                src={selectedImageState.href ?? ""}
                className={styles["lightbox-audio"]}
            />
        ),

        document: (
            <a
                href={selectedImageState.href ?? ""}
                target="_blank"
                rel="noopener noreferrer"
            >
                {selectedImageState.imageId ?? "Document"}
                {selectedImageState.format
                    ? `.${selectedImageState.format}`
                    : ""}
            </a>
        ),

        base64: showNoImage ? (
            <div className={styles.noImage}>Kein Bild</div>
        ) : (
            <img
                src={`data:image/png;base64,${selectedImageState.href}`}
                alt={selectedImageState.imageId ?? "Base64 Image"}
                onError={() => setImageError(true)}
                className={styles["lightbox-image"]}
            />
        ),

        iframe: (
            <iframe
                src={selectedImageState.href ?? ""}
                title={selectedImageState.imageId ?? "Iframe"}
            />
        ),
    };

    return (
        <div
            className={`${styles["lightbox-overlay"]} ${isMobile ? styles["is-mobile"] : ""}`}
            onClick={onClose}
        >
            <div
                className={styles["lightbox-content"]}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`${styles["lightbox-toper"]} ${isMobile ? styles["is-mobile"] : ""}`}>
                    <div className={styles["lightbox-filename"]}>
                        {selectedImageState.imageId}
                        {selectedImageState.format
                            ? `.${selectedImageState.format}`
                            : ""}
                    </div>
                    <div className={styles["lightbox-children"]}>
                        {children}
                    </div>
                </div>

                <div className={styles["lightbox-main"]}>
                    {typeMapper[selectedType]}

                    {data && data.length > 1 && (
                        <>
                            <button
                                className={styles["lightbox-prev"]}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleImageChange("prev");
                                }}
                            >
                                <FontAwesomeIcon icon={faAngleLeft} />
                            </button>

                            <button
                                className={styles["lightbox-next"]}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleImageChange("next");
                                }}
                            >
                                <FontAwesomeIcon icon={faAngleRight} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}