import type { ReactNode } from 'react';

export interface SearchTextBoxProps {
  value?: string;
  valueChanged?: (value: string) => void;
  placeholder?: string;
  errorText?: string;
  hasBorderLabel?: boolean;
  searchDelay?: number;
  minLengthToSearch?: number;
  hasLeftIcon?: boolean;
}

export interface HelpProps {
  title?: string;
  children: ReactNode;
}

export interface SearchTextBoxWithHelpProps {
  compact?: boolean;
  children: ReactNode;
}
