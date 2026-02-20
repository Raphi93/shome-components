"use client";

import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageContext } from '../context/PageContext';

export const useSetPageTitle = (title: string) => {
  const { t } = useTranslation();
  const { setPageTitle } = usePageContext();

  useLayoutEffect(() => {
    setPageTitle(title);
    return () => setPageTitle('');
  }, [setPageTitle, t, title]);
};