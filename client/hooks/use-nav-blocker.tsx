/**
 * Adapted from https://dev.to/tadasgo/block-user-navigation-with-react-router-v6-417f
 */
import type { History } from 'history';
import { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { UNSAFE_NavigationContext } from 'react-router-dom';

export type NavBlockerControl = {
  confirm: () => void;
  cancel: () => void;
};

export type NavBlocker = (control: NavBlockerControl) => void;

export function useNavBlocker(onBlock: NavBlocker, when: Boolean = true): void {
  const { block } = useContext(UNSAFE_NavigationContext).navigator as History;

  // Latest ref pattern
  // Latest version of the function stored to the onBlockRef
  const onBlockRef = useRef(onBlock);
  useLayoutEffect(() => { onBlockRef.current = onBlock; });

  useEffect(() => {
    if (!when) return;

    let blockerIsActive = false;

    const unblock = block(blocker => {
      // If the user tries to navigate again while the blocker is active, just let them. This lets the user override
      // the blocker by pressing the back/forward buttons again, which is friendly.
      if (blockerIsActive) {
        unblock();
        return blocker.retry();
      }

      blockerIsActive = true;

      onBlockRef.current({
        confirm: blocker.retry,
        cancel: () => { blockerIsActive = false; },
      });
    });

    return unblock;
  }, [block, when]);
}
