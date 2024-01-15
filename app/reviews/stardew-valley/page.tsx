import { readFile } from "node:fs/promises";
import { marked } from "marked";
import matter from "gray-matter";
import Heading from "@/components/Heading";

export default async function StardewValleyPage() {
  const text = await readFile("./content/reviews/stardew-valley.md", "utf-8");
  const {
    content,
    data: { title, date, image },
  } = matter(text);
  const html = marked(content);

  return (
    <>
      <Heading>{title}</Heading>
      <p className="italic pb-2">{date}</p>
      <img
        src={image}
        alt=""
        width={640}
        height={360}
        className="mb-2 rounded"
      />
      <article
        dangerouslySetInnerHTML={{ __html: html }}
        className="max-w-screen-sm prose prose-slate"
      ></article>
    </>
  );
}
