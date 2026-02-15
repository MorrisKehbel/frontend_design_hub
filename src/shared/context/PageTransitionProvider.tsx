import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  PageTransitionContext,
  type TransitionConfig,
  type TransitionPhase,
} from "./PageTransitionContext";

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [config, setConfig] = useState<TransitionConfig | null>(null);
  const navigate = useNavigate();
  const isLoading = useRouterState({ select: (s) => s.isLoading });
  const pendingReveal = useRef(false);

  const startTransition = useCallback((cfg: TransitionConfig) => {
    setConfig(cfg);
    setPhase("covering");
  }, []);

  const onCoverComplete = useCallback(() => {
    if (!config) return;

    // Scroll to top while the screen is fully covered
    window.scrollTo(0, 0);

    // Navigate to the target route
    navigate({ to: config.targetRoute });

    setPhase("covered");
    pendingReveal.current = true;
  }, [config, navigate]);

  // Wait for lazy route to finish loading before revealing
  useEffect(() => {
    if (phase === "covered" && pendingReveal.current && !isLoading) {
      pendingReveal.current = false;
      // Use rAF instead of a fixed timeout so the reveal waits for the
      // browser to actually paint the new route before animating.
      const id = requestAnimationFrame(() => setPhase("revealing"));
      return () => cancelAnimationFrame(id);
    }
  }, [phase, isLoading]);

  const onRevealComplete = useCallback(() => {
    setPhase("idle");
    setConfig(null);
  }, []);

  return (
    <PageTransitionContext.Provider
      value={{
        phase,
        config,
        isTransitioning: phase !== "idle",
        startTransition,
        onCoverComplete,
        onRevealComplete,
      }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
}
