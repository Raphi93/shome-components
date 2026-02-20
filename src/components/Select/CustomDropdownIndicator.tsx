import React from 'react';
import s from './Select.module.scss';

export const CustomDropdownIndicator = () => (
  <div className={s.chevronDown}>
    <span className={s.chevronArrow}></span>
  </div>
);
