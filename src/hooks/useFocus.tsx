import { RefObject, useEffect, useState } from 'react';

export function useFocus(ref: RefObject<any>, blurTimeout?: number): boolean {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    const onFocus = () => setIsFocused(true);
    const onBlur = blurTimeout ? () => setTimeout(() => setIsFocused(false), blurTimeout) : () => setIsFocused(false);

    const currentRef = ref.current;

    if (currentRef) {
      currentRef.addEventListener('focus', onFocus);
      currentRef.addEventListener('blur', onBlur);

      return () => {
        currentRef.removeEventListener('focus', onFocus);
        currentRef.removeEventListener('blur', onBlur);
      };
    }
  }, [blurTimeout, ref]);

  return isFocused;
}
