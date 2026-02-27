import { ReactNode } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export type AlertProps = {
    color?: 'brand' | 'primary' | 'red' | 'green' | 'orange' | 'blue' | 'yellow';
    icon?: IconProp;
    isOpened: boolean;
    title: string;
    text?: ReactNode;
    confirmButtonHandler?: (id?: string) => void;
    cancelButtonHandler?: () => void;
    confirmTitlle?: string;
    cancelTitle?: string;
    isOkDisabled?: boolean;
    setIsOpened: (value: boolean) => void;
};