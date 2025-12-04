import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return <div className="space-y-16 md:space-y-20"></div>;
}
