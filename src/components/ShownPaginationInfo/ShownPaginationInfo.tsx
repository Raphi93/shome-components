'use client';

import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { useNumberFormat } from '../../hooks/numberFormat';

import type { ShownPaginationInfoProps } from '../../types/Pager.types';

import style from '../Pager/Pager.module.scss';

export function ShownPaginationInfo({ variant, entryCount, pageCount, culture }: ShownPaginationInfoProps) {
  const { t } = useTranslation();
  const numberFormat = useNumberFormat(culture);
  let content: ReactNode | null = null;

  if (variant === 'none') {
    return <></>;
  }

  if (variant === 'both') {
    content = (
      <>
        <strong>{numberFormat(entryCount)}</strong> {t('Items in')} <strong>{numberFormat(pageCount)}</strong>{' '}
        {t('Pages')}
      </>
    );
  }

  if (variant === 'items') {
    content = (
      <>
        <strong>{numberFormat(entryCount)}</strong> {t('Items')}
      </>
    );
  }

  if (variant === 'pages') {
    content = (
      <>
        <strong>{numberFormat(pageCount)}</strong> {t('Pages')}
      </>
    );
  }

  return <div className={style.info}>{content}</div>;
}
