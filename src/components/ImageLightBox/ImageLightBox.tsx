'use client';

import { JSX, useEffect, useRef, useState } from 'react';
import { faAngleLeft, faAngleRight, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { usePhonePortraitAndBelowMediaQuery } from '../../hooks/useMediaQuery';

export type { ImageDto, ImageLightBoxProps, MediaType } from '../../types/ImageLightBox.types';
import type { ImageLightBoxProps, MediaType } from '../../types/ImageLightBox.types';

import styles from './ImageLightBox.module.scss';

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const SWIPE_THRESHOLD = 50;
const SWIPE_TIME_MS = 400;

export function ImageLightBox({
    data,
    type,
    selectedImage,
    onClose,
    children,
    setSelectedImageParent,
    hasFavorit,
    isFavorit,
    isFavoritClicked,
}: ImageLightBoxProps) {
    const { t } = useTranslation();
    const isMobile = usePhonePortraitAndBelowMediaQuery();
    const [imageError, setImageError] = useState(false);
    const [selectedImageState, setSelectedImage] = useState(selectedImage);

    // Zoom state
    const [scale, setScale] = useState(1);
    const imgRef = useRef<HTMLImageElement>(null);

    // Touch swipe tracking
    const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

    useEffect(() => {
        setSelectedImage(selectedImage);
        setImageError(false);
    }, [selectedImage]);

    // Reset zoom on image change
    useEffect(() => {
        setScale(1);
    }, [selectedImageState.imageId]);

    // Scroll-to-zoom: only on the image element (non-passive so we can preventDefault)
    useEffect(() => {
        const el = imgRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaY) < 10) return;
            e.preventDefault();
            e.stopPropagation();
            setScale(prev => Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev - e.deltaY * 0.005)));
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [selectedImageState, imageError]);

    function handleImageChange(direction: 'next' | 'prev') {
        if (!data?.length) return;
        const currentIndex = data.findIndex(img => img.imageId === selectedImageState.imageId);
        if (currentIndex < 0) return;
        const nextIndex = direction === 'next'
            ? (currentIndex + 1) % data.length
            : (currentIndex - 1 + data.length) % data.length;
        const nextImage = data[nextIndex];
        setSelectedImage(nextImage);
        setSelectedImageParent?.(nextImage);
        setImageError(false);
    }

    // Touch swipe: left → prev, right → next
    function handleTouchStart(e: React.TouchEvent) {
        if (e.touches.length === 1) {
            touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, time: Date.now() };
        }
    }

    function handleTouchEnd(e: React.TouchEvent) {
        if (!touchStartRef.current || e.changedTouches.length !== 1) return;
        const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
        const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
        const dt = Date.now() - touchStartRef.current.time;
        touchStartRef.current = null;
        if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) && dt < SWIPE_TIME_MS) {
            handleImageChange(dx < 0 ? 'prev' : 'next');
        }
    }

    // Double-click on image resets zoom
    function handleImageDoubleClick() {
        setScale(1);
    }

    const selectedType: MediaType = type ?? 'image';
    const showNoImage = !selectedImageState.href || (selectedType === 'image' && imageError);

    const zoomedImageStyle: React.CSSProperties = {
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        transition: 'transform 0.1s ease',
        cursor: scale > 1 ? 'zoom-out' : 'default',
    };

    const typeMapper: Record<MediaType, JSX.Element> = {
        image: showNoImage ? (
            <div className={styles.noImage}>{t('No image')}</div>
        ) : (
            <img
                ref={imgRef}
                src={selectedImageState.href ?? ''}
                alt={selectedImageState.imageId ?? t('Image')}
                onError={() => setImageError(true)}
                onDoubleClick={handleImageDoubleClick}
                className={styles['lightbox-image']}
                style={zoomedImageStyle}
                draggable={false}
            />
        ),

        video: (
            <video controls src={selectedImageState.href ?? ''} className={styles['lightbox-video']} />
        ),

        audio: (
            <audio controls src={selectedImageState.href ?? ''} className={styles['lightbox-audio']} />
        ),

        document: (
            <a href={selectedImageState.href ?? ''} target="_blank" rel="noopener noreferrer">
                {selectedImageState.imageId ?? t('Document')}
                {selectedImageState.format ? `.${selectedImageState.format}` : ''}
            </a>
        ),

        base64: showNoImage ? (
            <div className={styles.noImage}>{t('No image')}</div>
        ) : (
            <img
                ref={imgRef}
                src={`data:image/png;base64,${selectedImageState.href}`}
                alt={selectedImageState.imageId ?? t('Image')}
                onError={() => setImageError(true)}
                onDoubleClick={handleImageDoubleClick}
                className={styles['lightbox-image']}
                style={zoomedImageStyle}
                draggable={false}
            />
        ),

        iframe: (
            <iframe src={selectedImageState.href ?? ''} title={selectedImageState.imageId ?? t('Iframe')} />
        ),
    };

    return (
        <div
            className={`${styles['lightbox-overlay']} ${isMobile ? styles['is-mobile'] : ''}`}
            onClick={onClose}
        >
            <div
                className={styles['lightbox-content']}
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div className={`${styles['lightbox-toper']} ${isMobile ? styles['is-mobile'] : ''}`}>
                    <div className={styles['lightbox-toper-top']}>
                        <div className={styles['lightbox-filename']}>
                            {selectedImageState.imageId}
                            {selectedImageState.format ? `.${selectedImageState.format}` : ''}
                        </div>
                        {hasFavorit && (
                            <button
                                className={`${styles['favorit-btn']} ${isFavorit ? styles['is-favorit'] : ''}`}
                                onClick={(e) => { e.stopPropagation(); isFavoritClicked?.(); }}
                                title={isFavorit ? t('Remove from favourites') : t('Add to favourites')}
                            >
                                <FontAwesomeIcon icon={isFavorit ? faStar : faStarOutline} />
                            </button>
                        )}
                    </div>
                    {children && (
                        <div className={styles['lightbox-children']}>
                            {children}
                        </div>
                    )}
                </div>

                <div className={styles['lightbox-main']}>
                    {typeMapper[selectedType]}

                    {scale > 1 && (
                        <div className={styles['lightbox-zoom-badge']}>
                            {Math.round(scale * 100)}%
                        </div>
                    )}

                    {data && data.length > 1 && (
                        <>
                            <button
                                className={styles['lightbox-prev']}
                                onClick={(e) => { e.stopPropagation(); handleImageChange('prev'); }}
                            >
                                <FontAwesomeIcon icon={faAngleLeft} />
                            </button>
                            <button
                                className={styles['lightbox-next']}
                                onClick={(e) => { e.stopPropagation(); handleImageChange('next'); }}
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
