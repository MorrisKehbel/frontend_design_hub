import { createLazyFileRoute } from "@tanstack/react-router";
import HubShowcase from "../features/hub/HubShowcase";
import HubFooter from "../features/hub/HubFooter";
import "./hub.css";

export const Route = createLazyFileRoute("/")({
  component: Hub,
});

function Hub() {
  return (
    <div className="min-h-screen bg-washi text-ink">
      {/* <HubHero /> */}
      <HubShowcase />
      <HubFooter />
    </div>
  );
}
