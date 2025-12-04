export const seo = ({
	title,
	description,
	image,
	keywords,
	url,
}: {
	title: string;
	description?: string;
	image?: string;
	keywords?: string;
	url?: string;
}) => {
	const meta = [
		// Title cho tab trình duyệt (quan trọng: phải nằm trong mảng meta để ghi đè Root)
		{ title },
		// Open Graph Defaults
		{ property: "og:title", content: title },
		{ name: "twitter:title", content: title },
		// Quan trọng để hiển thị ảnh to trên Twitter/X
		{ name: "twitter:card", content: "summary_large_image" },
	];

	if (description) {
		meta.push(
			{ name: "description", content: description },
			{ property: "og:description", content: description },
			{ name: "twitter:description", content: description },
		);
	}

	if (image) {
		meta.push(
			{ property: "og:image", content: image },
			{ name: "twitter:image", content: image },
		);
	}

	if (url) {
		meta.push({ property: "og:url", content: url });
	}

	if (keywords) {
		meta.push({ name: "keywords", content: keywords });
	}

	return {
		meta,
	};
};
