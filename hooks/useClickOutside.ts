import { useEffect } from "react";

export function useClickOutside(
  ref: React.RefObject<HTMLElement | null >,
  active: any,
  onOutside: () => void
) {
  useEffect(() => {
    if (!active) return; // works with number or boolean (0/null/false all skip)

    function handler(event: MouseEvent | PointerEvent) {
      if (!(event.target instanceof Node)) return;
      if (ref.current && !ref.current.contains(event.target)) {
        onOutside();
      }
    }

    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [active, ref, onOutside]);
}
