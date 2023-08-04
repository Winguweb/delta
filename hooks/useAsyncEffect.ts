import { DependencyList, useCallback, useEffect, useRef } from 'react';

type AsyncEffectDestructor = () => void;
type AsyncEffectCallback = (
  isMounted: () => boolean
) => Promise<void | AsyncEffectDestructor>;

export function useAsyncEffect(
  effect: AsyncEffectCallback,
  deps?: DependencyList
) {
  const isMountedRef = useRef<boolean>(false);

  const isMounted = useCallback(() => isMountedRef.current, []);

  useEffect(
    () => {
      isMountedRef.current = true;

      let destructor: void | AsyncEffectDestructor;
      effect(isMounted).then((res) => (destructor = res));

      return () => {
        isMountedRef.current = false;
        destructor?.();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );
}
