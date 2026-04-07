import React from 'react';

import type { ErrorTextProps } from './ErrorText.type';

export function ErrorText({ errorMessage }: ErrorTextProps) {
  if (errorMessage) {
    return <div className="color-negative">{errorMessage}</div>;
  }
  return <></>;
}

export default ErrorText;
