import { useState, useEffect, DependencyList } from 'react';
import type { ReactNode } from 'react';

/**
 * A hook that delays the rendering of a component by a specified amount of time.
 * Useful for preventing flickering or flashing of components during fast updates.
 * @param delay The number of milliseconds to delay the rendering.
 * @returns A function that takes a component function and renders it after the delay.
 */
const useRenderDelay = (delay: number) => {
  const [shouldRender, setShouldRender] = useState(true);

  // Only run the effect on updates, not on the initial render
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (shouldRender) {
      timeout = setTimeout(() => setShouldRender(false), delay);
    }
    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRender] as DependencyList);

  return (fn: () => ReactNode) => shouldRender && fn();
};

export default useRenderDelay;
