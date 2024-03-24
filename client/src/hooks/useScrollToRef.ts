import { useRef, useCallback, useImperativeHandle } from 'react';
import throttle from 'lodash/throttle';

type TUseScrollToRef = {
  targetRef: React.RefObject<HTMLDivElement>;
  callback: () => void;
  smoothCallback: () => void;
};

type TThrottle = <T extends (...args: any[]) => any>(func: T, limit: number) => T;

export default function useScrollToRef({
  targetRef,
  callback,
  smoothCallback,
}: TUseScrollToRef) {
  const logAndScroll = (behavior: 'instant' | 'smooth', callbackFn: () => void) => {
    // Debugging:
    // console.log(`Scrolling with behavior: ${behavior}, Time: ${new Date().toISOString()}`);
    targetRef.current?.scrollIntoView({ behavior });
    callbackFn();
  };

  const throttleFunc: TThrottle = throttle;

  const scrollToRef = useCallback(
    () => throttleFunc(() => logAndScroll('instant', callback), 250),
    [callback],
  );

  const scrollToRefSmooth = useCallback(
    () => throttleFunc(() => logAndScroll('smooth', smoothCallback), 750),
    [smoothCallback],
  );

  useImperativeHandle(targetRef, () => ({
    scrollToRef,
  }));

  const handleSmoothToRef: React.MouseEventHandler<HTMLButtonElement> =
