import { readFile } from "node:fs/promises";
import { marked } from "marked";
import matter from "gray-matter";

export async function getReview() {
  const text = await readFile("./content/reviews/stardew-valley.md", "utf-8");
  const {
    content,
    data: { title, date, image },
  } = matter(text);
  const html = marked(content);

  return { title, date, image, html };
}