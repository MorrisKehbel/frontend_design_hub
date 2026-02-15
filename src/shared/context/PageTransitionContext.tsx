import { createContext, useContext } from "react";

export type TransitionPhase = "idle" | "covering" | "covered" | "revealing";

export interface TransitionConfig {
  colors: [string, string, string];
  targetRoute: string;
}

export interface PageTransitionContextValue {
  phase: TransitionPhase;
  config: TransitionConfig | null;
  isTransitioning: boolean;
  startTransition: (config: TransitionConfig) => void;
  onCoverComplete: () => void;
  onRevealComplete: () => void;
}

export const PageTransitionContext =
  createContext<PageTransitionContextValue | null>(null);

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) {
    throw new Error(
      "usePageTransition must be used within a PageTransitionProvider",
    );
  }
  return ctx;
}
