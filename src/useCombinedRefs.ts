import React, { MutableRefObject } from 'react';

export const useCombinedRefs = <T,>(...refs: (React.Ref<T> | undefined)[]): React.RefObject<T> => {
  const targetRef = React.useRef<T>(null);

  React.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else if ('current' in ref) {
        (ref as MutableRefObject<T | null>).current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
};
