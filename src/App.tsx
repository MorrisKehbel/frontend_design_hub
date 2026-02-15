import { useEffect } from "react";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { PageTransitionProvider } from "./shared/context/PageTransitionProvider";
import { usePageTransition } from "./shared/context/PageTransitionContext";
import PageTransitionOverlay from "./shared/components/PageTransitionOverlay";
function ScrollToTop() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isTransitioning } = usePageTransition();

  useEffect(() => {
    // When a transition is active, scroll reset is handled
    // by the transition context (while the screen is covered).
    // Only do instant scroll for non-transition navigations (e.g. browser back).
    if (!isTransitioning) {
      window.scrollTo(0, 0);
    }
  }, [pathname, isTransitioning]);

  return null;
}

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Outlet />
      <PageTransitionOverlay />
    </div>
  );
}

function App() {
  return (
    <PageTransitionProvider>
      <AppLayout />
    </PageTransitionProvider>
  );
}

export default App;
