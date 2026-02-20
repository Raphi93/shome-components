import React from 'react';

type Props = {
  errorMessage?: string;
};
export function ErrorText({ errorMessage }: Props) {
  if (errorMessage) {
    return <div className="color-negative">{errorMessage}</div>;
  }

  return <></>;
}

export default ErrorText;
