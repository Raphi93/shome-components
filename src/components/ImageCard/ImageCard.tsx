'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { ImageCardProps } from '../../types/ImageCard.types';
export type { ImageCardMediaType, ImageCardProps } from '../../types/ImageCard.types';

import styles from './ImageCard.module.scss';

export function ImageCard({
  type,
  extension,
  href,
  filename,
  model,
  onFullScreen,
  hasFavorit,
  isFavorit,
  isFavoritClicked,
}: ImageCardProps) {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);

  const showNoImage = !href || (type === 'image' && imageError);

  const typeMapper = {
    image: showNoImage ? (
      <div className={styles.noImage}>{t('No image')}</div>
    ) : (
      <img
        src={href}
        alt={filename || t('Image')}
        onError={() => setImageError(true)}
        style={onFullScreen ? { cursor: 'zoom-in' } : undefined}
        onClick={onFullScreen}
      />
    ),

    video: (
      <video
        controls
        src={href}
        style={onFullScreen ? { cursor: 'zoom-in' } : undefined}
        onClick={onFullScreen}
      />
    ),

    audio: <audio controls src={href} />,

    document: (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {filename || t('Document')}{extension ? `.${extension}` : ''}
      </a>
    ),

    base64: showNoImage ? (
      <div className={styles.noImage}>{t('No image')}</div>
    ) : (
      <img
        src={`data:image/png;base64,${href}`}
        alt={filename || t('Image')}
        onError={() => setImageError(true)}
        style={onFullScreen ? { cursor: 'zoom-in' } : undefined}
        onClick={onFullScreen}
      />
    ),

    iframe: (
      <iframe
        style={onFullScreen ? { cursor: 'zoom-in' } : undefined}
        onClick={onFullScreen}
        src={href}
        title={filename || t('Iframe')}
      />
    ),
  };

  return (
    <div className={styles['image-card-container']}>
      {hasFavorit && (
        <button
          className={`${styles['favorit-btn']} ${isFavorit ? styles['is-favorit'] : ''}`}
          onClick={(e) => { e.stopPropagation(); isFavoritClicked?.(); }}
          title={isFavorit ? t('Remove from favourites') : t('Add to favourites')}
        >
          <FontAwesomeIcon icon={isFavorit ? faStar : faStarOutline} />
        </button>
      )}

      <div className={styles['image-content']}>
        {typeMapper[type]}
      </div>

      {filename && (
        <div
          className={styles['image-name']}
          style={onFullScreen ? { cursor: 'zoom-in' } : undefined}
          onClick={onFullScreen}
        >
          {filename}{extension && `.${extension}`}{model && ` (${model})`}
        </div>
      )}
    </div>
  );
}
