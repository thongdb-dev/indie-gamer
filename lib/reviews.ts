import { readFile, readdir } from "node:fs/promises";
import { marked } from "marked";
import matter from "gray-matter";

export interface Review {
  slug: string;
  title: string;
  date: string;
  image: string;
  body: string | Promise<string>;
}

export async function getReview(slug: string): Promise<Review> {
  const text = await readFile(`./content/reviews/${slug}.md`, "utf-8");
  const {
    content,
    data: { title, date, image },
  } = matter(text);
  const body = marked(content);

  return { slug, title, date, image, body };
}

export async function getReviews(): Promise<Review[]> {
  const files = await readdir('./content/reviews');
  const slugs = files
    .filter((file: string) => file.endsWith('.md'))
    .map((file: any) => file.slice(0, -'.md'.length));

  const reviews: Review[] = [];

  for (const slug of slugs) {
    const review = await getReview(slug);
    reviews.push(review);
  }

  return reviews;
}