import { readFile, readdir } from "node:fs/promises";

import { marked } from "marked";
import matter from "gray-matter";
import qs from "qs";

const CMS_URL = 'http://localhost:1337';

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

export async function getFeaturedReview() {
  const reviews = await getReviews();
  return reviews[0];
}

export async function getReviews(): Promise<Review[]> {
  const url =
    `${CMS_URL}/api/reviews` +
    "?" +
    qs.stringify(
      {
        fields: ["slug", "title", "subtitle", "publishedAt"],
        populate: { image: { fields: ["url"] } },
        sort: ["publishedAt:desc"],
        pagination: { pageSize: 6 },
      },
      { encodeValuesOnly: true }
    );

  const response = await fetch(url);
  const { data } = await response.json();

  return data.map(({ attributes }) => ({
    slug: attributes.slug,
    title: attributes.title,
    date: attributes.publishedAt.slice(0, 'yyy-mm-dd'.length),
    image: CMS_URL + attributes.image.data.attributes.url
  }));
}

export async function getSlugs(): Promise<string[]> {
  const files = await readdir('./content/reviews');
  return files
    .filter((file: string) => file.endsWith('.md'))
    .map((file: any) => file.slice(0, -'.md'.length));
}