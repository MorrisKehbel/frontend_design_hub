import {
  createRootRoute,
  type ErrorComponentProps,
  useRouter,
} from "@tanstack/react-router";
import App from "../App";

function RootErrorComponent({ error }: ErrorComponentProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center">
        <h1 className="font-serif text-2xl font-light text-neutral-800">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          {error.message || "Please refresh the page to try again."}
        </p>
        <button
          type="button"
          onClick={() => router.invalidate()}
          className="mt-4 cursor-pointer rounded-full bg-neutral-800 px-6 py-2 text-sm text-white hover:bg-neutral-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: App,
  errorComponent: RootErrorComponent,
});
