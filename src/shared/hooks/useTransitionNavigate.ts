import { useCallback } from "react";
import {
  usePageTransition,
  type TransitionConfig,
} from "../context/PageTransitionContext";

export function useTransitionNavigate() {
  const { startTransition, isTransitioning } = usePageTransition();

  return useCallback(
    (config: TransitionConfig) => {
      if (isTransitioning) return;
      startTransition(config);
    },
    [startTransition, isTransitioning],
  );
}
