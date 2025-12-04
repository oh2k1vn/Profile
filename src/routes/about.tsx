import { seo } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
	head: () =>
		seo({
			title: "About Me | Frontend Dev",
			description: "Learn more about my experience and skills.",
			image: "https://mysite.com/avatar.jpg",
			keywords: "react, frontend, developer",
		}),
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/about"!</div>;
}
